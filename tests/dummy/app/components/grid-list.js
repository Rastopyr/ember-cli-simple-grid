import Ember from 'ember';
import layout from '../templates/components/grid-list';

const { Component, computed } = Ember;

export default Component.extend({
  layout,

  classNames: ['grid-wrapper'],

  columns: 3,

  items: computed(function() {
    const list = [];

    for (var i = 0; i < 400; i++) {
      list.push({
        index: i,
      });
    }

    return list;
  }),
});
