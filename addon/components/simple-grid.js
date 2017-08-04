import Ember from 'ember';
import layout from '../templates/components/simple-grid';

import CspStyleMixin from 'ember-cli-csp-style/mixins/csp-style';

const { Component, computed, A, $, observer, run } = Ember;
const { alias } = computed;

export default Component.extend(CspStyleMixin, {
  layout,

  styleBindings: ['position'],
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

    const columnWidth = (layoutWidth / columns) - gutter;

    if (columnWidth < 0) {
      return $(this.get('_itemsPerColumnsfirstObject.element')).width() - gutter;
    }

    return Math.ceil((layoutWidth / columns) - gutter);
  }),

  /**
   * Width of grid
   * @type {Number}
   */
  layoutWidth: computed('columns', 'columnWidth', 'gutter', function() {
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
  _itemsPerColumns: computed('columns', function() {
    const columns = this.get('columns');
    const colContainers = A();

    for (let i = 0; i < columns; i++) {
      const colContainer = Ember.Object.extend({
        items: computed(() => A()),
        length: alias('items.length')
      }).create({});

      this.on('destroy', () => colContainer.destroy());
      colContainers.pushObject(colContainer);
    }

    return colContainers;
  }),

  /**
   * List of heights of columns
   * @return {Array} [description]
   */
  columnHeights: computed('columns', 'items.[]', function() {
    const {
      _itemsPerColumns,
      gutter
    } = this.getProperties(
      '_itemsPerColumns',
      'gutter'
    );

    return _itemsPerColumns.map(function(columnItems, index) {
      const items = columnItems.get('items')
      const lastItem = items.get('lastObject');
      const top = (!lastItem ?
        0 : (lastItem.get('top') || 0) + ($(lastItem.get('element')).height() + gutter)
      );

      return {
        index,
        top,
      };
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
    ).sort((a, b) => a.top > b.top ? -1 : 1)[0];

    if (!highestColumn || highestColumn.index === -1) {
      return {
        index: 0,
        top: 0
      };
    }

    return highestColumn;
  }),

  /**
   * Object represent of lowest column
   * @return {Object} [description]
   */
  lowestColumn: computed('columnHeights.[]', function() {
    if (this.get('isDestroyed')) {
      return {
        index: 0,
        top: 0
      };
    }

    const {
      columnHeights
    } = this.getProperties('columnHeights');

    const lowestColumn = columnHeights.slice(
      0, columnHeights.length
    ).sort((a, b) => a.top > b.top ? 1 : -1)[0];

    if (!lowestColumn || lowestColumn.index === -1) {
      return {
        index: 0,
        top: 0
      };
    }

    return lowestColumn;
  }),

  /**
   * Rerender by chanes columns
   */
  columnsRerender: observer('columns', function() {
    this.fireRerender();
  }),

  /**
   * Rerender by chanes columns
   */
  columnWidthRerender: observer('columnWidth', function() {
    this.fireRerender();
  }),

  /**
   * Rerender items by change shouldRerender in Item
   */
  itemsRerenderObserver: observer('items.@each.shouldRerender', function() {
    const items = this.get('items');
    const firstShouldRender = items.findBy('shouldRerender', true);

    if (!firstShouldRender || firstShouldRender.isDestroyed) {
      return;
    }

    firstShouldRender.set('shouldRerender', false);

    this.fireRerender();
  }),

  /**
   * Process if new Item
   * @param  {Object} item Placed item
   */
  placeItem(item) {
    if (this.get('isDestroyed')) {
      return {
        index: 0,
        top: 0
      };
    }

    const {
      items,
      lowestColumn,
      _itemsPerColumns
    } = this.getProperties(
      'items',
      'lowestColumn',
      '_itemsPerColumns',
      'isDestroyed'
    );

    const { index } = item;

    if(item.isDestroyed) {
      return;
    }

    _itemsPerColumns[lowestColumn.index].get('items').pushObject(item);

    if (index !== undefined && items[index] && items[index] !== item) {
      items.insertAt(index, item);
    } else {
      items.pushObject(item);
    }

    const column = lowestColumn.index;
    const top = lowestColumn.top;
    const columnWidth = this.get('columnWidth');

    item.setProperties({
      column,
      top,
      width: columnWidth,
      height: 'initial',
    });
  },

  /**
   * Rerender all items
   */
  reRenderItems() {
    const { items, isDestroyed } = this.getProperties('items', 'isDestroyed');

    if (isDestroyed) {
      return;
    }

    const clonedItems = items.slice(0, items.get('length')).filter(
      (i) => {
        return !i.isDestroyed;
      }
    );

    this.itemsPerColumn();

    items.clear();

    run.schedule('afterRender', () =>
      requestAnimationFrame(() => {
        clonedItems.forEach((i) =>
          this.placeItem(i)
        );

        this.setHeight()
      })
    );
  },

  fireRerender() {
    Ember.run.debounce(this, this.reRenderItems, 200);
  },

  setHeight() {
    if (this.get('isDestroyed')) {
      return;
    }

    const { highestColumn } = this.getProperties('highestColumn');

    this.$().css({
      height: highestColumn.top,
    });
  },

  itemsPerColumn() {
    if (this.get('isDestroyed')) {
      return;
    }

    const { columns } = this.getProperties('columns');

    const colContainers = A();

    for (let i = 0; i < columns; i++) {
      colContainers.pushObject(Ember.Object.extend({
        items: computed(() => A()),
        length: alias('items.length')
      }).create({}));
    }

    this.set('_itemsPerColumns', colContainers);
  }
});
