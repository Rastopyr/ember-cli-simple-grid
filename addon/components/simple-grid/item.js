import Ember from 'ember';
import layout from '../../templates/components/simple-grid/item';

import CspStyleMixin from 'ember-cli-csp-style/mixins/csp-style';

const { Component, computed, on, computed: { alias } } = Ember;

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

  item: computed(function() {
    return Ember.Object.create({
      element: this.element,
      type: this.get('type'),
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
    this.sendAction('placeItem', this.get('item'));
  }),

  willRemoveElement: on('willDestroyElement', function() {
    this.get('item').destroy();
    this.sendAction('reposAfterItem', this.get('item'));
  })
});
