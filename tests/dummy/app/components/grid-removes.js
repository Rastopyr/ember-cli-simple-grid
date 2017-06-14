import Ember from 'ember';
import layout from '../templates/components/grid-removes';

const { Component, computed } = Ember;

export default Component.extend({
  layout,

  classNames: ['grid-wrapper'],

  columns: 3,

  items: computed(function() {
    const list = [];

    for (var i = 0; i < 100; i++) {
      list.push({
        index: i,
        image: i % 2 ?
          'http://lorempixel.com/300/600/' : 'http://lorempixel.com/600/400/'
      });
    }

    return list;
  }),
});
