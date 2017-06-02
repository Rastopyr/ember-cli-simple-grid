import Ember from 'ember';
import layout from '../templates/components/grid-list';

const { Component, computed } = Ember;

export default Component.extend({
  layout,

  classNames: ['grid-wrapper'],

  items: computed(function() {
    const list = [];

    for (var i = 0; i < 100; i++) {
      list.push(i);
    }

    return list;
  }),
});
