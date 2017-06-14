import Ember from 'ember';
import layout from '../../templates/components/grid-removes/item';

const { Component, on } = Ember;

export default Component.extend({
  layout,

  didInsertedElement: on('didInsertElement', function() {
    setTimeout(() => {
      this.set('isHided', true);
    }, Math.random() * (10000 - 1000) + 1000);
  }),
});
