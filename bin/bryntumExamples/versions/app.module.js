import { StringHelper, VersionGrid, Base, Toast, BrowserHelper, Events, ProjectModel, Container, DateHelper, MessageDialog, ChangeLogTransactionModel, VersionModel, Gantt } from '../../build/gantt.module.js';
import shared from '../_shared/shared.module.js';
//region "lib/MyVersionGrid.js"

/**
 * Customize VersionGrid by inserting user avatars into transaction descriptions
 */
class MyVersionGrid extends VersionGrid {

    static $name = 'MyVersionGrid';

    static type = 'myversiongrid';

    static configurable = {
        columns : [
            {
                type      : 'tree',
                text      : 'Description',
                field     : 'description',
                flex      : 3,
                groupable : false,
                renderer(event) {
                    const { record, grid } = event;
                    if (record.transactionModel) {
                        const {
                            description,
                            transactionModel: { username }
                        } = record;
                        return {
                            children : [
                                {
                                    tag   : 'img',
                                    class : `user-avatar`,
                                    src   : `../_shared/images/users/${username}.jpg`,
                                    alt   : username
                                },
                                {
                                    tag  : 'span',
                                    html : StringHelper.encodeHtml(description)
                                }
                            ]
                        };
                    }
                    return grid.renderDescription(event);
                },
                autoHeight : true
            },
            {
                text      : 'Occurred At',
                field     : 'occurredAt',
                type      : 'date',
                format    : 'M/D/YY h:mm a',
                flex      : 1,
                groupable : false
            }
        ]
    };
}

MyVersionGrid.initClass();

//endregion

//region "lib/websocket/ProjectWebSocketHandlerMixin.js"

/**
 * This mixin allows project to communicate changes over websocket connection to stay in sync with other clients. By
 * default, project will automatically sync changes, to temporarily suspend autoSync call {@link Scheduler.crud.AbstractCrudManager#function-suspendAutoSync}
 * and to resume {@link Scheduler.crud.AbstractCrudManager#function-resumeAutoSync}. These methods use counter, meaning for every suspendAutoSync call
 * there should be resumeAutoSync.
 */
const ProjectWebSocketHandlerMixin = Target => class extends (Target || Base) {
    messages = [];

    static configurable = {
        /**
         * Address of the websocket server. If configured websocket will be opened during
         * instantiation.
         * @config {String}
         */
        wsAddress : null,

        /**
         * Username config for websocket connection
         * @config {String}
         */
        wsUserName : '',

        /**
         * Set to `false` to not request dataset automatically
         * @config {Boolean}
         * @category Websocket
         * @default
         */
        wsAutoLoad : true,

        /**
         * Websocket connection timeout
         * @config {Number}
         * @category Websocket
         * @default
         */
        wsConnectionTimeout : 60000,

        /**
         * ID of the project to use for load/sync requests. When changed project will load the dataset if
         * {@link #config-wsAutoLoad} is true. Otherwise, you need to call {@link #function-wsLoad} manually.
         * @config {String|Number}
         * @category Websocket
         * @default
         */
        wsProjectId : null
    };

    doDestroy() {
        this.websocketManager?.destroy();

        super.doDestroy();
    }

    //#region Config handlers

    updateWsAddress(address) {
        const me = this;

        me.websocketManager?.destroy();

        me.detachListeners('websocket-listeners');

        if (address) {
            me.websocketManager = new WebSocketManager({
                address,
                userName          : me.wsUserName,
                internalListeners : {
                    message : 'handleWebsocketMessage',
                    close   : 'handleWebsocketClose',
                    error   : 'handleWebsocketError',
                    thisObj : me
                }
            });

            if (me.wsAutoLoad) {
                me.wsLoad().then();
            }

            me.ion({
                name                 : 'websocket-listeners',
                revisionNotification : 'handleRevisionNotification'
            });
        }
    }

    updateWsProjectId(value) {
        if (value != null && this.wsAutoLoad) {
            this.wsLoad().then();
        }
    }

    //#endregion

    /**
     * Sends message over configured websocket connection. Requires {@link #config-wsAddress} to be configured.
     * @param {String} command
     * @param {Object} [data] Data object to send to the websocket
     * @param {Boolean} silent Pass true to not trigger {@link #event-wsSendMessage} event
     * @returns {Promise} Returns true if message was sent
     */
    async wsSend(command, data, silent = false) {
        const me = this;

        if (await me.wsOpen()) {
            if (command === 'project_change') {
                data.client = me.clientId;
            }

            if (me.LOGMESSAGES) {
                me.messages.push({ type : 'send', command, data });
            }

            me.websocketManager.send(command, data);

            /**
             * Fires after project has sent a message over websocket connection
             * @event wsSendMessage
             * @param {Object} data Data object with mandatory `command` key and arbitrary data keys.
             * @param {String} data.command Mandatory command to send
             * @category Websocket
             */
            if (!silent) {
                me.trigger('wsSendMessage', { command, data });
            }
            return true;
        }

        return false;
    }

    /**
     * Template function which might be implemented to process messages from the websocket server
     * @param {Object} data Data object with mandatory `command` key and arbitrary data keys.
     * @param {String} data.command Mandatory command to send
     */
    wsReceive(data) {
    }

    handleWebsocketClose() {
        /**
         * Fires when websocket connection is closed
         * @event wsClose
         * @category Websocket
         */
        this.trigger('wsClose');
    }

    handleWebsocketError({ error }) {
        /**
         * Fires when websocket manager throws error onn connection or trying to process the response
         * @event wsError
         * @param {Error} error Error event
         * @category Websocket
         */
        this.trigger('wsError', { error });
    }

    async handleWebsocketMessage({ data }) {
        const
            me              = this,
            { wsProjectId } = me,
            {
                command,
                data : payload
            }               = data;

        let project;

        if (me.LOGMESSAGES) {
            me.messages.push({ type : 'receive', command, data });
        }

        /**
         * Fires when project receives message from the websocket server
         * @event wsMessage
         * @param {Object} data Data object with mandatory `command` key and arbitrary data keys.
         * @param {String} data.command Mandatory command to send
         * @category Websocket
         */
        me.trigger('wsMessage', { data });

        if (command === 'error' || 'error' in data) {
            Toast.show(data.error || data.message);

            return;
        }

        if (command !== 'error') {
            project = payload.project;
        }

        if (project === wsProjectId && command === 'project_change') {

            /**
             * Fires before project has applied project changes from the websocket server
             * @event wsBeforeReceiveChanges
             * @category Websocket
             */
            me.trigger('wsBeforeReceiveChanges');

            await me.applyRevisions(payload.revisions.map(r => ({
                revisionId            : r.revision,
                localRevisionId       : r.localRevision,
                conflictResolutionFor : r.conflictResolutionFor,
                clientId              : r.client,
                changes               : r.changes
            })));

            /**
             * Fires after project has applied project changes from the websocket server
             * @event wsReceiveChanges
             * @category Websocket
             */
            me.trigger('wsReceiveChanges');
        }
        else if (project === wsProjectId && command === 'dataset') {
            await me.queue(async() => {
                me.stm.disable();

                me.stm.resetQueue();

                await me.loadInlineData(payload.dataset);

                me.stm.enable();

                me.initRevisions(me.clientId, 'base');
            });

            /**
             * Fires after project has applied dataset from the websocket server
             * @event wsReceiveDataset
             * @category Websocket
             */
            me.trigger('wsReceiveDataset');
        }
        else if (project === wsProjectId && command === 'versionAutoSaveOK') {
            /**
             * Fires when client receives permission to proceed with a version auto-save.
             * @event versionAutoSaveOK
             */
            me.trigger('wsVersionAutoSaveOK');
        }
        else if (project === wsProjectId && command === 'loadVersionContent') {
            /**
             * Fires when client receives version content.
             * @event loadVersionContent
             */
            const { versionId, content } = payload;
            me.trigger('loadVersionContent', { versionId, project, content });
        }
        else {
            me.wsReceive(data);
        }
    }

    /**
     * Open websocket connection
     * @returns {Promise}
     */
    async wsOpen() {
        const { websocketManager } = this;

        if (websocketManager) {
            const trigger = !websocketManager.isOpened && await websocketManager.open();

            if (trigger) {
                /**
                 * Fires when websocket is opened
                 * @event wsOpen
                 * @category Websocket
                 */
                this.trigger('wsOpen');
            }

            return websocketManager.isOpened;
        }

        return false;
    }

    /**
     * Loads data to the project and calculates it:
     *
     * ```javascript
     * await project.wsLoad();
     * ```
     *
     * @category Websocket
     */
    async wsLoad() {
        const me = this;

        if (me.wsProjectId == null) {
            return;
        }

        // Send request for dataset
        await me.wsSend('dataset', { project : me.wsProjectId });

        // Await for `wsReceiveDataset` event. When such event arrives `inlineData` is set and project committed
        await new Promise(resolve => {
            const detacher = me.ion({
                wsReceiveDataset() {
                    detacher();
                    resolve(true);
                },
                expires : {
                    delay : me.wsConnectionTimeout,
                    alt   : () => {
                        detacher();
                        resolve(false);
                    }
                }
            });
        });

        await me.commitAsync();

        /**
         * Fires when dataset is loaded
         * @event wsLoad
         * @category Websocket
         */
        me.trigger('wsLoad');
    }

    async handleRevisionNotification({ localRevisionId, conflictResolutionFor, clientId, changes }) {
        const
            me              = this,
            { wsProjectId } = me;

        if (wsProjectId == null) {
            return;
        }

        const revision = { revision : localRevisionId, clientId, changes };

        if (conflictResolutionFor) {
            revision.conflictResolutionFor = conflictResolutionFor;
        }

        if (me.isAutoSyncSuspended) {
            this._queuedRevisions = (this._queuedRevisions || []);

            this._queuedRevisions.push(revision);
        }
        else {
            const revisions = [];

            if (me._queuedRevisions?.length) {
                revisions.push(...me._queuedRevisions);

                delete me._queuedRevisions;
            }

            revisions.push(revision);

            await me.sendRevisions(revisions);
        }
    }

    async sendRevisions(revisions) {
        const
            me = this,
            trigger = await me.wsSend('project_change', {
                project : me.wsProjectId,
                revisions
            });

        if (trigger) {
            /**
             * Fires after project has sent changes over websocket connection
             * @event wsSendChanges
             * @category Websocket
             */
            me.trigger('wsSendChanges');
        }
    }

    /**
     * Closes websocket connection
     */
    wsClose() {
        this.websocketManager?.close();
    }

    resumeAutoSync() {
        const me = this;

        super.resumeAutoSync();

        if (!me.isAutoSyncSuspended && me._queuedRevisions?.length) {
            const revisions = me._queuedRevisions;

            delete me._queuedRevisions;

            me.sendRevisions(revisions).then();
        }
    }
};

//endregion

//region "lib/websocket/ProjectWebSocketSubscriberMixin.js"

/**
 * This mixin is used to allow target classes to track login state.
 */
const ProjectWebSocketSubscriberMixin = Target => class extends Target {

    static $name = 'ProjectWebSocketSubscriberMixin';

    static configurable = {
        loggedIn : false,
        project  : null
    };

    updateProject(project) {
        // detach old listeners
        this.detachListeners('projectListeners');

        // attach listeners to the new project
        project.on({
            name      : 'projectListeners',
            wsMessage : this.handleWebSocketMessage,
            wsClose   : this.handleWebSocketClose,
            thisObj   : this
        });
    }

    handleWebSocketMessage({ data }) {
        const { command, error } = data;

        if (command === 'login' && !this.loggedIn && !error) {
            this.handleLogin();
        }
        // Username is only missing in case current client is logged out
        else if (command === 'logout' && !data.data.userName && this.loggedIn) {
            this.handleLogout();
        }
    }

    handleWebSocketClose() {
        this.handleLogout();
    }

    handleLogin() {
        this.loggedIn = true;
        this.trigger('login');
    }

    handleLogout() {
        this.loggedIn = false;
        this.trigger('logout');
    }
};

//endregion

//region "lib/websocket/WebSocketHelper.js"

/**
 * This class is required for the demo to extend interaction with websocket server. By default, project will handle the
 * data, but we also need to show list of users and handle login/logout. Therefore, we connect project from here and
 * start listening to project events to handle messages from the server.
 * For more information about the demo please refer to the guide:
 * https://bryntum.com/products/gantt/docs/guide/Gantt/integration/websockets
 */
class WebSocketHelper {
    //region Constructor

    /**
     * Constructs WebSocketHelper class for the Gantt instance
     * @param client
     * @param host
     */
    constructor(client, host) {
        const
            me        = this,
            autoLogin = BrowserHelper.searchParam('auto');

        me.client = client;

        me.project = client.project;

        me.setConnectedState(false);

        if (autoLogin) {
            client.project.wsAddress = host;
            client.project.wsSend('login', { login : 'auto' }).then(() => client.project.wsProjectId = 1);
        }
    }

    //endregion

    get project() {
        return this._project;
    }

    set project(project) {
        const me = this;

        me._project = project;

        project.on({
            wsError() {
                me.client.maskBody('Error connecting to server');
            },
            wsMessage({ data }) {
                me.wsReceive(data);
            },
            wsOpen() {
                me.setConnectedState(true);
                Toast.show(`Connected to server`);
            },
            wsClose() {
                Toast.show(`Disconnected from server`);
                me.setConnectedState(false);
            }
        });

        return project;
    }

    //region WebSocket methods

    /**
     * Processes received data
     * @data {Object} data JSON data object
     */
    wsReceive(data) {
        const
            me       = this,
            userName = data?.data?.userName;

        switch (data.command) {
            // User has connected to the server
            case 'login':
                if (data.error) {
                    Toast.show(`Error: ${data.error}`);
                }
                else if (userName) {
                    Toast.show(`${userName} just connected`);
                }
                break;
            // User has disconnected from the server
            case 'logout':
                if (userName) {
                    Toast.show(`${userName} disconnected`);
                }
                break;
            case 'reset':
                Toast.show(`${userName} reset the data`);
                break;
            case 'error':
                Toast.show(data.error);
                break;
            default:
                break;
        }
    };

    //endregion

    /**
     * Sets visual state for login / logout controls
     * @param {Boolean} connected Connected status
     */
    setConnectedState(connected) {
        const { client } = this;

        if (connected) {
            client.unmask();
        }
        else {
            client.maskBody('<div style="text-align: center">OFFLINE</div>');
        }
    }

    //endregion
}

//endregion

//region "lib/websocket/WebSocketManager.js"

/**
 * This class allows to send and receive messages from websocket server passing responses via events. This helper is
 * meant to be used with a demo websocket server. It sends messages that are JSON strings including "command" key and
 * arbitrary data keys. For example:
 *
 * ```javascript
 * // request string to notify other clients that new client is connected
 * "{ \"command\": \"hello\", \"userName\": \"new user\" }"
 *
 * // response message from the websocket server with list of connected users
 * "{ \"command\": \"users\", \"users\": [\"new user\"] }"
 * ```
 *
 * Usage:
 * ```javascript
 * connector = new WebSocketManager({
 *     address     : 'ws://localhost:8080',
 *     userName    : 'Test client',
 *     autoConnect : false
 * });
 *
 * const opened = await connector.open();
 *
 * if (!opened) {
 *     console.log('Could not open connection');
 * }
 *
 * connector.on({
 *     message({ data }) {
 *         console.log(data);
 *     }
 * });
 *
 * // Sends "{ \"command\": \"hello\", \"userName\": \"mark\" }" string to the websocket server
 * // When response arrives helper will log following message: "{ command: 'users', users: ['mark'] }"
 * connector.send('hello', { userName : 'mark' });
 * ```
 */
class WebSocketManager extends Events(Base) {
    // This allows to hook into for testing purposes
    static webSocketImplementation = typeof WebSocket === 'undefined' ? null : WebSocket;

    static configurable = {
        /**
         * WebSocket server address
         * @config {String}
         */
        address : '',

        /**
         * Username allowing to identify client
         * @config {String}
         */
        userName : 'User',

        /**
         * Connect to websocket server immediately after instantiation
         * @config {Boolean}
         */
        autoConnect : true
    };

    construct(config = {}) {
        const me = this;

        super.construct(config);

        me.onWsOpen = me.onWsOpen.bind(me);
        me.onWsClose = me.onWsClose.bind(me);
        me.onWsMessage = me.onWsMessage.bind(me);
        me.onWsError = me.onWsError.bind(me);

        if (me.autoConnect && me.address) {
            me.open();
        }
    }

    doDestroy() {
        const me = this;

        if (me.connector) {
            me.detachSocketListeners(me.connector);
            me.connector.close();
            me.connector = null;
        }
        super.doDestroy();
    }

    //#region Websocket state

    get isConnecting() {
        return this.connector?.readyState === this.constructor.webSocketImplementation.CONNECTING;
    }

    get isOpened() {
        return this.connector?.readyState === this.constructor.webSocketImplementation.OPEN;
    }

    get isClosing() {
        return this.connector?.readyState === this.constructor.webSocketImplementation.CLOSING;
    }

    get isClosed() {
        return this.connector?.readyState === this.constructor.webSocketImplementation.CLOSED;
    }

    //#endregion

    //#region Websocket init

    createWebSocketConnector() {
        const connector = this.connector = new this.constructor.webSocketImplementation(this.address);

        this.attachSocketListeners(connector);
    }

    destroyWebSocketConnector() {
        this.detachSocketListeners(this.connector);

        this.connector.close();

        this.connector = null;
    }

    attachSocketListeners(connector) {
        const me = this;

        connector.addEventListener('open', me.onWsOpen);
        connector.addEventListener('close', me.onWsClose);
        connector.addEventListener('message', me.onWsMessage);
        connector.addEventListener('error', me.onWsError);
    }

    detachSocketListeners(connector) {
        const me = this;

        connector.removeEventListener('open', me.onWsOpen);
        connector.removeEventListener('close', me.onWsClose);
        connector.removeEventListener('message', me.onWsMessage);
        connector.removeEventListener('error', me.onWsError);
    }

    //#endregion

    //#region Websocket methods

    /**
     * Connect to the server and start listening for messages
     * @returns {Promise} Returns true if connection was successful and false otherwise
     */
    async open() {
        const me = this;

        if (me._openPromise) {
            return me._openPromise;
        }

        if (!me.address) {
            console.warn('Server me.address cannot be empty');
            return;
        }

        if (me.isOpened) {
            return true;
        }

        me.createWebSocketConnector();

        let detacher;

        // Wait for `open` or `close` event
        me._openPromise = new Promise(resolve => {
            detacher = me.ion({
                open() {
                    resolve(true);
                },
                error() {
                    resolve(false);
                }
            });
        }).then(value => {
            // Detach listeners
            detacher();

            // Cleanup the promise
            me._openPromise = null;

            // If quit early with a timeout then remove reference to the WebSocket instance
            if (!value) {
                me.destroyWebSocketConnector();
            }

            return value;
        }).catch(() => {
            me._openPromise = null;
            me.destroyWebSocketConnector();
        });

        return me._openPromise;
    }

    /**
     * Close socket and disconnect from the server
     */
    close() {
        if (this.connector) {
            this.destroyWebSocketConnector();
            this.trigger('close');
        }
    }

    /**
     * Send data to the websocket server
     * @param {String} command
     * @param {*} data
     */
    send(command, data = {}) {
        this.connector?.send(JSON.stringify({ command, data }));
    }

    //#endregion

    //#region websocket event listeners

    onWsOpen(event) {
        this.trigger('open', { event });
    }

    onWsClose(event) {
        this.trigger('close', { event });
    }

    onWsMessage(message) {
        try {
            const data = JSON.parse(message.data);
            this.trigger('message', { data });
        }
        catch (error) {
            this.trigger('error', { error });
        }
    }

    onWsError(error) {
        this.trigger('error', { error });
    }

    //#endregion
}

//endregion

//region "lib/websocket/WebSocketProjectModel.js"

class WebSocketProjectModel extends ProjectWebSocketHandlerMixin(ProjectModel) {
    static $name = 'WebsocketProjectModel';
}

//endregion

/**
 * Demonstrates extending the built-in VersionModel in order to annotate versions
 * with a username or other application-specific data.
 */
class VersionModelWithUser extends VersionModel {

    static $name = 'VersionModelWithUser';

    static fields = [
        { name : 'username', type : 'string' }
    ];

    onBeforeSave() {
        this.username = currentUserName;
    }

    get defaultDescription() {
        return `${this.isAutosave ? 'Auto-saved' : `Saved by ${StringHelper.capitalize(this.username)}`} on 
        ${DateHelper.format(this.savedAt, 'MMM D YYYY')} at ${DateHelper.format(this.savedAt, 'h:mm a')}`;
    }
}

/**
 * Also demonstrate extending ChangeLogTransactionModel to track which
 * user generated the transaction.
 */
class TransactionModelWithUser extends ChangeLogTransactionModel {
    static $name = 'TransactionModelWithUser';

    static fields = [
        /**
         * Add a username field
         */
        { name : 'username', type : 'string' }
    ];

    construct(config) {
        super.construct({
            username : currentUserName,
            ...config
        });
    }
}

const
    userNames       = ['amit', 'dan', 'emilia', 'linda', 'hitomi', 'henrik', 'kate', 'steve'],
    currentUserName = userNames[Math.floor(Math.random() * userNames.length)],
    project         = new ProjectModel({
        autoSetConstraints : true,
        loadUrl            : '../_datasets/launch-saas.json',
        autoLoad           : true,
        // The State TrackingManager which the UndoRedo widget in the toolbar uses
        stm                : {
            // NOTE, that this option does not enable the STM itself, this is done by the `undoredo` widget, defined in the toolbar
            // If you don't use `undoredo` widget in your app, you need to enable STM manually: `stm.enable()`,
            // otherwise, it won't be tracking changes in the data
            // It's usually best to enable STM after the initial data loading is completed.
            autoRecord : true
        },
        validateResponse : true,
        listeners        : {
            load : {
                async fn() {
                    // Listener will be started once on load and is used for demo purposes to add Undo operations on start

                    // Code may be edited in CodeEditor during data load and this will destroy existing gantt and project
                    if (gantt.isDestroyed) {
                        return;
                    }

                    const
                        { project }  = gantt,
                        { versions } = gantt.features,
                        task         = project.taskStore.getById(11); // Get Install Apache task by id

                    project.stm.enable();

                    // Make repeated edits, saving versions along the way, to populate version grid
                    await task.setStartDate(new Date(2019, 0, 20));

                    if (gantt.isDestroyed) {
                        return;
                    }

                    versions.transactionDescription = `Moved task ${task.name}`;
                    versions.stopTransaction();
                    versions.saveVersion();

                    await task.setStartDate(new Date(2019, 0, 21));

                    if (gantt.isDestroyed) {
                        return;
                    }

                    versions.transactionDescription = `Moved task ${task.name}`;
                    versions.stopTransaction();
                },
                once : true
            }
        }
    }),
    gantt           = new Gantt({
        enableUndoRedoKeys      : true,
        dependencyIdField       : 'wbsCode',
        flex                    : 2,
        resourceImageFolderPath : '../_shared/images/users/',
        project,
        columns                 : [
            { type : 'wbs' },
            { type : 'name', field : 'name', text : 'Name', width : 250 },
            { type : 'startdate', text : 'Start date' },
            { type : 'duration', text : 'Duration' },
            { text : 'Predecessors', type : 'predecessor', width : 112 },
            { text : 'Successors', type : 'successor', width : 112 },
            { type : 'addnew' }
        ],
        subGridConfigs : {
            locked : {
                width : 420
            }
        },
        loadMask : 'Loading tasks...',
        tbar     : [
            'Gantt view',
            '->',
            {
                ref   : 'undoredoTool',
                type  : 'undoredo',
                text  : true,
                items : {
                    transactionsCombo : null
                }
            }
        ],
        features : {
            baselines : {
                disabled : true
            },
            versions : {
                /**
                 * Configure the versions feature with our custom models that track user information
                 */
                versionModelClass     : VersionModelWithUser,
                transactionModelClass : TransactionModelWithUser
            },
            dependencies   : true,
            dependencyEdit : true
        },
        listeners : {
            /**
             * Demonstrates overriding the default transaction description to provide more detail
             * about which user action initiated the transaction. In this case, we set a custom
             * description for transactions involving a task drag event.
             */
            taskDrop({ taskRecords }) {
                this.features.versions.transactionDescription = taskRecords.length === 1
                    ? `Dragged task ${taskRecords[0].name}` : `Dragged ${taskRecords.length} tasks`;
            },

            taskResizeEnd({ taskRecord }) {
                this.features.versions.transactionDescription = `Resized task ${taskRecord.name}`;
            },

            afterDependencyCreateDrop() {
                this.features.versions.transactionDescription = `Drew a link`;
            },

            transactionChange({ hasUnattachedTransactions }) {
                this.owner.widgetMap.saveButton.disabled = !hasUnattachedTransactions;
            }
        }
    }),
    app             = new Container({
        appendTo : 'container',
        layout   : 'box',
        items    : {
            gantt,
            splitter    : { type : 'splitter' },
            versionGrid : {
                type                       : MyVersionGrid.type,
                flex                       : 1,
                emptyText                  : 'No versions to display',
                project                    : gantt.project,
                showUnattachedTransactions : true,
                selectionMode              : {
                    row  : true,
                    cell : false
                },
                features : {
                    cellMenu : {
                        /**
                         * Add a button to the version row context menu.
                         */
                        items : {
                            duplicateButton : {
                                text   : 'Duplicate',
                                icon   : 'b-fa b-fa-copy',
                                onItem : async({ record }) => {
                                    const result = await MessageDialog.confirm({
                                        title   : 'Duplicate Version?',
                                        message : `This will create a new project from the content of the selected version.
                                        Do you want to continue?`
                                    });
                                    if (result === MessageDialog.yesButton) {
                                        // Sample code demonstrating cloning a saved version
                                        await gantt.features.versions.getVersionContent(record.versionModel);
                                        gantt.project = new WebSocketProjectModel(record.versionModel.content);
                                    }
                                }
                            }
                        }
                    }
                },
                dateFormat : 'M/D/YY h:mm a',
                tbar       : {
                    items : {
                        saveButton : {
                            text      : 'Save Version',
                            icon      : 'b-fa b-fa-plus',
                            listeners : {
                                click : () => {
                                    gantt.features.versions.saveVersion();
                                }
                            }
                        },
                        spacer          : '->',
                        onlyNamedToggle : {
                            type      : 'slidetoggle',
                            text      : 'Show named versions only',
                            color     : 'b-blue',
                            listeners : {
                                change : ({ checked }) => {
                                    app.widgetMap.versionGrid.showNamedVersionsOnly = checked;
                                }
                            }
                        },
                        showVersionsToggle : {
                            type      : 'slidetoggle',
                            text      : 'Changes only',
                            color     : 'b-blue',
                            checked   : false,
                            listeners : {
                                change : ({ checked }) => {
                                    app.widgetMap.versionGrid.showVersions = !checked;
                                }
                            }
                        }
                    }
                },
                listeners : {
                    // Handle the user asking to restore a given version
                    restore : async({ version }) => {
                        const result = await MessageDialog.confirm({
                            title   : 'Restore Version?',
                            message : `Are you sure you want to restore the selected version, replacing the
                            current project? You will lose any unsaved changes.`
                        });
                        if (result === MessageDialog.yesButton) {
                            const { versions, baselines } = gantt.features;
                            await versions.restoreVersion(version);
                            baselines.disabled = true;
                            project.stm.resetQueue();
                        }
                    },

                    // Handle the user asking to compare a given version
                    compare : async({ source, version }) => {
                        const { versions, baselines } = gantt.features;
                        baselines.disabled = false;
                        await versions.compareVersion(version);
                        source.comparingVersionId = version.id;
                        gantt.refreshRows();
                    },

                    stopCompare : async({ source }) => {
                        const { versions, baselines } = gantt.features;
                        baselines.disabled = true;
                        await versions.stopComparing();
                        source.comparingVersionId = null;
                    }
                }
            }
        }
    });
