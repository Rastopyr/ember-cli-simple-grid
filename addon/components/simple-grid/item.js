import Ember from 'ember';
import layout from '../../templates/components/simple-grid/item';

import CspStyleMixin from 'ember-cli-csp-style/mixins/csp-style';

const { Component, computed, on, observer,  run } = Ember;
const { alias } = computed;

export default Component.extend(CspStyleMixin, {
  layout,

  classNames: ['simple-grid-item'],

  styleBindings: [
    'left:left[px]',
    'item.top:top[px]',
    'item.width:width[px]',
    'height[px]',
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

  top: computed('item.top', 'gutter', function() {
    const {
      item,
      gutter
    } = this.getProperties(
      'item',
      'gutter',
    );

    return item.get('top') + gutter;
  }),

  didGridItemInitialize: on('didInsertElement', function() {
    const placeItemNext = run.schedule('afterRender', () => {
      this.sendAction('placeItem', this.get('item'));
    });

    this.set('placeItemNext', placeItemNext);
  }),

  willRemoveElement: on('willDestroyElement', function() {
    this.get('item').destroy();

    run.cancel(this.get('placeItemNext'));

    this.sendAction('rerenderPart', this.get('item'));
  })
});
