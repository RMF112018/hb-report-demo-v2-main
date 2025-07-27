import Column from '../../../lib/Grid/column/Column.js';
import ColumnStore from '../../../lib/Grid/data/ColumnStore.js';
import './ComplexityCombo.js';

/**
 * @module ComplexityColumn
 */

/**
 * A custom column showing the complexity of a task
 *
 * @extends Gantt/column/Column
 * @classtype complexitycolumn
 */
export default class ComplexityColumn extends Column {
    static $name         = 'ComplexityColumn';
    static type          = 'complexitycolumn';
    static isGanttColumn = true;
    static defaults      = {
        // Set your default instance config properties here
        field   : 'complexity',
        text    : 'Complexity',
        cellCls : 'b-complexity-column-cell',
        editor  : { type : 'complexitycombo' }
    };

    //endregion

    renderer({ column, value }) {
        const
            { store } = column.editor,
            complexity = store.getById(value)?.text;

        return complexity ? [{
            tag       : 'i',
            className : `b-fa b-fa-square ${complexity}`
        }, complexity] : '';
    }
}

ColumnStore.registerColumnType(ComplexityColumn);
