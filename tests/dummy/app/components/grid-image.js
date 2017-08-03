import Ember from 'ember';
import layout from '../templates/components/grid-image';

const { Component, A, on, computed} = Ember;

function randomInteger(min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1)
  rand = Math.round(rand);
  return rand;
}


export default Component.extend({
  layout,

  classNames: ['grid-wrapper'],

  columns: 3,

  items: computed(() => A()),

  itemTimer: on('init', function() {
    const interval = setInterval(() => {
      this.get('items').pushObjects(
        this.generateItems()
      );
    }, 500);

    setTimeout(() => clearInterval(interval), 500);
  }),

  generateItems() {
    const list = A();

    for (var i = 0; i < 100; i++) {
      list.push({
        index: i,
        image: `http://lorempixel.com/${randomInteger(100, 700)}/${randomInteger(100, 700)}`
      });
    }

    return list;
  }
});
