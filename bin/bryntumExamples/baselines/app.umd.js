var {
    DateHelper,
    Gantt,
    ProjectModel,
    StringHelper
} = bryntum.gantt;
const setBaseline = index => {
        gantt.taskStore.setBaseline(index);
    },
    toggleBaselineVisible = (index, visible) => {
        gantt.element.classList[visible ? 'remove' : 'add'](`b-hide-baseline-${index}`);
    },
    baselineRenderer = ({
        baselineRecord,
        taskRecord,
        renderData
    }) => {
        if (baselineRecord.isScheduled && taskRecord.isScheduled && baselineRecord.endDate.getTime() + 24 * 3600 * 1000 < taskRecord.endDate.getTime()) {
            renderData.className['b-baseline-behind'] = 1;
        }
        else if (taskRecord.endDate < baselineRecord.endDate) {
            renderData.className['b-baseline-ahead'] = 1;
        }
        else {
            renderData.className['b-baseline-on-time'] = 1;
        }
    },
    project = window.project = new ProjectModel({
        autoSetConstraints : true,
        transport          : {
            load : {
                url : '../_datasets/launch-saas.json'
            }
        }
    }),
    gantt = new Gantt({
        appendTo          : 'container',
        dependencyIdField : 'wbsCode',
        project,
        columns           : [{
            type : 'wbs'
        }, {
            type  : 'name',
            width : 300
        }, {
            type : 'startdate'
        }, {
            type : 'enddate'
        }, {
            type : 'duration'
        }, {
            text        : 'Baseline 1',
            collapsible : true,
            children    : [{
                type  : 'baselinestartdate',
                text  : 'Start',
                field : 'baselines[0].startDate'
            }, {
                type  : 'baselineenddate',
                text  : 'Finish',
                field : 'baselines[0].endDate'
            }, {
                type  : 'baselineduration',
                text  : 'Duration',
                field : 'baselines[0].fullDuration'
            }, {
                type  : 'baselinestartvariance',
                field : 'baselines[0].startVariance'
            }, {
                type  : 'baselineendvariance',
                field : 'baselines[0].endVariance'
            }, {
                type  : 'baselinedurationvariance',
                field : 'baselines[0].durationVariance'
            }]
        }, {
            text        : 'Baseline 2',
            collapsible : true,
            collapsed   : true,
            children    : [{
                type  : 'baselinestartdate',
                text  : 'Start',
                field : 'baselines[1].startDate'
            }, {
                type  : 'baselineenddate',
                text  : 'Finish',
                field : 'baselines[1].endDate'
            }, {
                type  : 'baselineduration',
                text  : 'Duration',
                field : 'baselines[1].fullDuration'
            }, {
                type  : 'baselinestartvariance',
                field : 'baselines[1].startVariance'
            }, {
                type  : 'baselineendvariance',
                field : 'baselines[1].endVariance'
            }, {
                type  : 'baselinedurationvariance',
                field : 'baselines[1].durationVariance'
            }]
        }, {
            text        : 'Baseline 3',
            collapsible : true,
            collapsed   : true,
            children    : [{
                type  : 'baselinestartdate',
                text  : 'Start',
                field : 'baselines[2].startDate'
            }, {
                type  : 'baselineenddate',
                text  : 'Finish',
                field : 'baselines[2].endDate'
            }, {
                type  : 'baselineduration',
                text  : 'Duration',
                field : 'baselines[2].fullDuration'
            }, {
                type  : 'baselinestartvariance',
                field : 'baselines[2].startVariance'
            }, {
                type  : 'baselineendvariance',
                field : 'baselines[2].endVariance'
            }, {
                type  : 'baselinedurationvariance',
                field : 'baselines[2].durationVariance'
            }]
        }],
        subGridConfigs : {
            locked : {
                flex : 1
            },
            normal : {
                flex : 1
            }
        },
        // Allow extra space for baseline(s)
        rowHeight : 60,
        features  : {
            baselines : {
                // Custom tooltip template for baselines
                template(data) {
                    const me = this,
                        {
                            baseline
                        } = data,
                        {
                            task
                        } = baseline,
                        delayed = task.startDate > baseline.startDate,
                        overrun = task.durationMS > baseline.durationMS;
                    let {
                        decimalPrecision
                    } = me;
                    if (decimalPrecision == null) {
                        decimalPrecision = me.client.durationDisplayPrecision;
                    }
                    const multiplier = Math.pow(10, decimalPrecision),
                        displayDuration = Math.round(baseline.duration * multiplier) / multiplier;
                    return `
                        <div class="b-gantt-task-title">${StringHelper.encodeHtml(task.name)} (${me.L('baseline')} ${baseline.parentIndex + 1})</div>
                        <table>
                        <tr><td>${me.L('Start')}:</td><td>${data.startClockHtml}</td></tr>
                        ${baseline.milestone ? '' : `
                            <tr><td>${me.L('End')}:</td><td>${data.endClockHtml}</td></tr>
                            <tr><td>${me.L('Duration')}:</td><td class="b-right">${displayDuration + ' ' + DateHelper.getLocalizedNameOfUnit(baseline.durationUnit, baseline.duration !== 1)}</td></tr>
                        `}
                        </table>
                        ${delayed ? `
                            <h4 class="statusmessage b-baseline-delay"><i class="statusicon b-fa b-fa-exclamation-triangle"></i>${me.L('Delayed start by')} ${DateHelper.formatDelta(task.startDate - baseline.startDate)}</h4>
                        ` : ''}
                        ${overrun ? `
                            <h4 class="statusmessage b-baseline-overrun"><i class="statusicon b-fa b-fa-exclamation-triangle"></i>${me.L('Overrun by')} ${DateHelper.formatDelta(task.durationMS - baseline.durationMS)}</h4>
                        ` : ''}
                        `;
                },
                renderer : baselineRenderer
            },
            columnLines : false,
            filter      : true,
            labels      : {
                before : {
                    field  : 'name',
                    editor : {
                        type : 'textfield'
                    }
                }
            }
        },
        tbar : {
            items : {
                setBaseline : {
                    type      : 'button',
                    text      : 'Set baseline',
                    iconAlign : 'end',
                    menu      : [{
                        text : 'Set baseline 1',
                        onItem() {
                            setBaseline(1);
                        }
                    }, {
                        text : 'Set baseline 2',
                        onItem() {
                            setBaseline(2);
                        }
                    }, {
                        text : 'Set baseline 3',
                        onItem() {
                            setBaseline(3);
                        }
                    }]
                },
                showBaseline : {
                    type      : 'button',
                    text      : 'Show baseline',
                    iconAlign : 'end',
                    menu      : [{
                        checked : true,
                        text    : 'Baseline 1',
                        onToggle({
                            checked
                        }) {
                            toggleBaselineVisible(1, checked);
                        }
                    }, {
                        checked : true,
                        text    : 'Baseline 2',
                        onToggle({
                            checked
                        }) {
                            toggleBaselineVisible(2, checked);
                        }
                    }, {
                        checked : true,
                        text    : 'Baseline 3',
                        onToggle({
                            checked
                        }) {
                            toggleBaselineVisible(3, checked);
                        }
                    }]
                },
                showBaselines : {
                    type       : 'checkbox',
                    text       : 'Show baselines',
                    checked    : true,
                    toggleable : true,
                    onAction({
                        checked
                    }) {
                        gantt.features.baselines.disabled = !checked;
                    }
                },
                enableRenderer : {
                    type       : 'checkbox',
                    text       : 'Enable baseline renderer',
                    cls        : 'b-baseline-toggle',
                    checked    : true,
                    toggleable : true,
                    onAction({
                        checked
                    }) {
                        gantt.features.baselines.renderer = checked ? baselineRenderer : () => {};
                    }
                }
            }
        }
    });
project.load();
