import Ember from 'ember';
import layout from '../templates/components/simple-grid';

const { Component, computed, A } = Ember;

export default Component.extend({
  layout,

  classNames: ['simple-grid'],

  actions: {
    pushItem(item) {
      this.processItem(item);
    },
  },

  /**
   * Default column width
   * @type {Number}
   */
  columdWidth: 90,

  /**
   * Count of columns
   * @type {Number}
   */
  columns: 3,

  /**
   * Margin between columns
   * @type {Number}
   */
  margin: 10,

  /**
   * List of items for rendering
   * @type {Array}
   */
  items: computed(() => A()),

  /**
   * Margin between columns
   * @type {Number}
   */
  gutter: computed(function() {
    return this.get('margin');
  }),

  /**
   * Width of grid
   * @type {Number}
   */
  layoutWidth: computed(function() {
    return this.$().width();
  }),

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
  topOffset: computed('items.[]', 'cursor.row', 'cursor.column', function() {
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
  leftOffset: computed('items.[]', 'cursor.row', 'cursor.column', function() {
    const { cursor, gutter, columns, items } = this.getProperties(
      'cursor', 'gutter', 'columns', 'items'
    );

    const { row, column } = cursor.getProperties('row', 'column');
    const lastElement = items.get((row * columns) - 1);

    const defaultColumnWidth = this.get('layoutWidth') / columns;

    if (!lastElement || !items.get('length')) {
      if (!lastElement) {
        return column * (defaultColumnWidth + gutter);
      }

      return 0;
    }

    return column * (lastElement.get('width') + gutter);
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
