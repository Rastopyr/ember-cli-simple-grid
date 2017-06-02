import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('simple-grid/item', 'Integration | Component | simple grid/item', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{simple-grid/item}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#simple-grid/item}}
      template block text
    {{/simple-grid/item}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

test('correct count of items', function(assert) {
  this.set('pushItem', () => {
    assert.ok(true);
  });

  this.render(hbs`
    {{#simple-grid/item pushItem=(action pushItem)}}
      Hello world
    {{/simple-grid/item}}
  `);
});

test('send own position', function(assert) {
  const expectedPosition = Ember.Object.create({
    left: 0,
    top: 0,
  });

  this.set('position', expectedPosition);
  this.set('pushItem', (actual) => {
    assert.deepEqual(actual.position, expectedPosition);
  });

  this.render(hbs`
    {{#simple-grid/item pushItem=(action pushItem)}}
      Hello world
    {{/simple-grid/item}}
  `);
});

test('send element', function(assert) {
  this.set('pushItem', (actual) => {
    assert.ok(actual.element instanceof window.Element);
  });

  this.render(hbs`
    {{#simple-grid/item pushItem=(action pushItem)}}
      Hello world
    {{/simple-grid/item}}
  `);
});

test('send instance of Ember.Object', function(assert) {
  this.set('pushItem', (actual) => {
    assert.ok(actual instanceof Ember.Object);
  });

  this.render(hbs`
    {{#simple-grid/item pushItem=(action pushItem)}}
      Hello world
    {{/simple-grid/item}}
  `);
});
