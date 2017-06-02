import Ember from 'ember';
import layout from '../../templates/components/simple-grid/item';

import CspStyleMixin from 'ember-cli-csp-style/mixins/csp-style';

const { Component, computed, on, $ } = Ember;

export default Component.extend(CspStyleMixin, {
  layout,

  classNames: ['simple-grid-item'],

  styleBindings: [
    'position.left:left[px]',
    'position.top:top[px]'
  ],

  /**
   * Passed position from top
   * @type {Object}
   */
  computedPosition: computed(() => ({})),

  /**
   * Position for inline styles
   * @type {Object}
   */
  position: computed(function() {
    return Ember.Object.create({
      left: 0,
      top: 0,
    });
  }),

  didGridItemInitialize: on('didInsertElement', function() {
    this.sendAction('pushItem', Ember.Object.create({
      position: this.get('position'),
      element: this.element,
      height: $(this.element).height(),
      width: $(this.element).width(),
    }));
  }),
});
