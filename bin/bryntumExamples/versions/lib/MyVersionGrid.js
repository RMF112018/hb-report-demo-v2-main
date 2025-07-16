import StringHelper from '../../../lib/Core/helper/StringHelper.js';
import VersionGrid from '../../../lib/SchedulerPro/widget/VersionGrid.js';

/**
 * Customize VersionGrid by inserting user avatars into transaction descriptions
 */
export default class MyVersionGrid extends VersionGrid {

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
