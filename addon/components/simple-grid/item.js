import Ember from 'ember';
import layout from '../../templates/components/simple-grid/item';

import CspStyleMixin from 'ember-cli-csp-style/mixins/csp-style';

const { Component, computed, on, observer } = Ember;
const { alias } = computed;

export default Component.extend(CspStyleMixin, {
  layout,

  classNames: ['simple-grid-item'],

  styleBindings: [
    'left:left[px]',
    'top:top[px]',
    'columnWidth:width[px]',
    'height:height[px]',
    'position',
    'display'
  ],

  position: 'absolute',
  display: 'inline-block',

  type: 'default',

  itemObserver: observer('type', 'index', function() {
    this.get('item').setProperties({
      type: this.get('type'),
      index: this.get('index'),
    });
  }),

  item: computed(function() {
    return Ember.Object.create({
      element: this.element,
      type: this.get('type'),
      index: this.get('index'),
    });
  }),

  width: alias('item.width'),
  height: 'initial',

  left: computed('item.column', 'width', 'gutter', function() {
    const {
      item,
      gutter,
      columnWidth
    } = this.getProperties(
      'item',
      'gutter',
      'columnWidth'
    );

    const column = item.get('column');

    if (column === undefined || column === 0) {
      return 0;
    }

    return column * (columnWidth + gutter);
  }),

  top: computed('item.top', function() {
    const {
      item,
    } = this.getProperties(
      'item',
    );

    const top = item.get('top');


    if (top === undefined || top === 0) {
      return 0;
    }

    return item.get('top');
  }),

  didGridItemInitialize: on('didInsertElement', function() {
    requestAnimationFrame(() => {
      this.sendAction('placeItem', this.get('item'));
    });
  }),

  willRemoveElement: on('willDestroyElement', function() {
    this.get('item').destroy();

    if (!this.get('isDestroyed')) {
      this.sendAction('fireRender');
    }
  })
});
