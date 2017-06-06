import Ember from 'ember';
import layout from '../templates/components/simple-grid';

import CspStyleMixin from 'ember-cli-csp-style/mixins/csp-style';

const { Component, computed, A } = Ember;

export default Component.extend(CspStyleMixin, {
  layout,

  styleBindings: ['display'],
  classNames: ['simple-grid'],

  display: 'inline-block',

  /**
   * Default column width
   * @type {Number}
   */
  columnWidth: computed('columns', 'layoutWidth', function() {
    const {
      columns, layoutWidth
    } = this.getProperties('columns', 'layoutWidth');

    if (!columns || !layoutWidth) {
      return 90;
    }

    return layoutWidth / columns;
  }),

  /**
   * Width of grid
   * @type {Number}
   */
  layoutWidth: computed('layoutWidth', 'columns', 'columnWidth', 'gutter', function() {
    return this.$().width();
  }),

  /**
   * Count of columns
   * @type {Number}
   */
  columns: 3,

  /**
   * Margin between columns
   * @type {Number}
   */
  gutter: 10,

  /**
   * List of items for rendering
   * @type {Array}
   */
  items: computed(() => A()),

  /**
   * Cursor of current processed element
   * @type {Object}
   */
  cursor: computed(() => Ember.Object.create({
    row: 0,
    column: 0,
  })),

  /**
   * Highest column
   * @type {[type]}
   */
  topOffset: computed('items.[]', 'cursor.row', 'cursor.column', 'columns', 'layoutWidth', 'columnWidth', function() {
    const { cursor, gutter, items, columns } = this.getProperties(
      'cursor', 'gutter', 'items', 'columns'
    );

    const { row } = cursor.getProperties('row');
    const lastElement = items.get((row * columns) - 1);

    if (!lastElement || !items.get('length')) {
      return 0;
    }

    const rowCofficient = row === 0 ? 0 : gutter + lastElement.get('height');

    return rowCofficient + lastElement.get('position.top');
  }),

  /**
   * Left offset for current element
   * @return {[type]} [description]
   */
  leftOffset: computed('items.[]', 'cursor.row', 'cursor.column', 'columns', 'columnWidth', function() {
    const {
      cursor, gutter, columns, items, columnWidth
    } = this.getProperties(
      'cursor', 'gutter', 'columns', 'items', 'columnWidth'
    );

    const { row, column } = cursor.getProperties('row', 'column');
    const lastElement = items.get((row * columns) - 1);

    if (!lastElement || !items.get('length')) {
      if (!lastElement) {
        return column * (columnWidth + gutter);
      }

      return 0;
    }

    return column * (columnWidth + gutter);
  }),

  /**
   * Process items
   * @param  {Object} item [description]
   */
  processItem(item) {
    const {
      topOffset,
      leftOffset,
      columns,
      cursor
    } = this.getProperties(
      'topOffset',
      'leftOffset',
      'columns',
      'cursor'
    );

    const { column, row } = cursor.getProperties('column', 'row')
    const position = item.get('position');

    position.set('top', topOffset);
    position.set('left', leftOffset);

    this.get('items').pushObject(item);

    if (column !== columns - 1) {
      cursor.set('column', column + 1);
    } else {
      cursor.setProperties({
        row: row + 1,
        column: 0,
      });
    }
  }
});
