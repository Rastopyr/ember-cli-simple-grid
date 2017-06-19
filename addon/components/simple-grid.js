import Ember from 'ember';
import layout from '../templates/components/simple-grid';

import CspStyleMixin from 'ember-cli-csp-style/mixins/csp-style';

const { Component, computed, A, $, observer, run, set } = Ember;

export default Component.extend(CspStyleMixin, {
  layout,

  styleBindings: ['position', 'highestColumn.height:height[px]'],
  classNames: ['simple-grid'],

  /**
   * Prebuild position value
   * @type {String}
   */
  position: 'relative',

  /**
   * Default column width
   * @type {Number}
   */
  columnWidth: computed('columns', 'layoutWidth', function() {
    const {
      columns, layoutWidth, gutter
    } = this.getProperties(
      'columns', 'layoutWidth', 'gutter'
    );

    return Math.ceil((layoutWidth / columns) - gutter);
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
   * Mode of grid layout
   * @type {[type]}
   */
  mode: 'default',

  /**
   * List of column indexes
   * @return {Array} [description]
   */
  colContainers: computed('columns', function() {
    const columns = this.get('columns');
    const colContainers = A();

    for (let i = 0; i < columns; i++) {
      colContainers.push({
        index: i,
        height: 0,
      })
    }

    return colContainers;
  }),

  /**
   * List of heights of columns
   * @return {Array} [description]
   */
  columnHeights: computed('columns', 'items.[]', function() {
    const {
      items,
      gutter,
      colContainers,
    } = this.getProperties(
      'items',
      'gutter',
      'colContainers',
    );

    const _itemsPerColumns = colContainers.map(function(c) {
      return items.filter((i) => {
        return i.get('column') === c.index;
      });
    });

    return _itemsPerColumns.map(function(columnItems, index) {
      set(colContainers[index], 'height', columnItems.reduce((acc, item) => {
        return acc + gutter + $(item.get('element')).height();
      }, 0));

      return colContainers[index];
    });
  }),

  /**
   * Object represent of highes column
   * @return {Object} [description]
   */
  highestColumn: computed('columnHeights.[]', function() {
    const {
      columnHeights
    } = this.getProperties(
      'columnHeights'
    );

    const highestColumn = columnHeights.slice(
      0, columnHeights.length
    ).sort((a, b) => a.height > b.height ? -1 : 1)[0];

    if (highestColumn.index === -1) {
      return {
        index: 0,
        height: 0
      };
    }

    return highestColumn;
  }),

  /**
   * Object represent of lowest column
   * @return {Object} [description]
   */
  lowestColumn: computed('columnHeights.[]', function() {
    const {
      columnHeights
    } = this.getProperties('columnHeights');

    const lowestColumn = columnHeights.slice(
      0, columnHeights.length
    ).sort((a, b) => a.height > b.height ? 1 : -1)[0];

    if (lowestColumn.index === -1) {
      return {
        index: 0,
        height: 0
      };
    }

    return lowestColumn;
  }),

  columnsRerender: observer('columns', function() {
    this.fireRerender();
  }),

  /**
   * Process if new Item
   * @param  {Object} item Placed item
   */
  placeItem(item) {
    const {
      items,
      lowestColumn,
    } = this.getProperties(
      'lowestColumn',
      'items',
    );

    item.setProperties({
      column: lowestColumn.index,
      top: lowestColumn.height,
      width: this.get('columnWidth'),
    });

    items.pushObject(item);
  },

  reRenderItems() {
    const items = this.get('items')
    const clonedItems = items.slice(0, items.get('length')).filter(
      (i) => {
        return !i.isDestroyed;
      }
    );

    items.clear();

    clonedItems.forEach((i) =>
      run.schedule('afterRender', () =>
        this.placeItem(i)
      )
    );
  },

  rerenderPartItems() {
    const { items } = this.getProperties('items');
    const itemsShouldRerender = items.filter(
      (item) => item.shouldRerender
    );

    const indexStartRerender = items.indexOf(
      itemsShouldRerender[0]
    );

    if (indexStartRerender === -1) {
      return;
    }

    this.rerenderAfterIndex(indexStartRerender);
  },

  rerenderAfterItem(item) {
    const { items } = this.getProperties('items');
    const indexStartRerender = items.indexOf(item);

    if (indexStartRerender === -1) {
      return;
    }

    this.rerenderAfterIndex(indexStartRerender);
  },

  rerenderAfterIndex(indexStartRerender) {
    const { items } = this.getProperties('items');
    const cloned = items.slice(
      indexStartRerender,
      items.get('length')
    );

    items.removeObjects(
      items.slice(indexStartRerender, items.get('length'))
    );

    cloned.forEach((item) => {
      this.placeItem(item);
    });
  },

  fireRerender() {
    const schedule = this.get('schedule');

    if (schedule) {
      run.cancel(schedule);
    }

    const runSchedule = run.next(() => {
      run.scheduleOnce('afterRender', this, this.reRenderItems);
    });

    this.set('schedule', runSchedule);
  },

  fireRerenderPart() {
    const schedule = this.get('schedule');

    if (schedule) {
      run.cancel(schedule);
    }

    const runSchedule = run.next(() => {
      run.scheduleOnce('afterRender', this, this.rerenderPartItems);
    });

    this.set('schedule', runSchedule);
  }
});
