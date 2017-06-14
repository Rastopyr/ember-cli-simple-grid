import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('simple-grid/image-item', 'Integration | Component | simple grid/image item', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{simple-grid/image-item}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#simple-grid/image-item}}
      template block text
    {{/simple-grid/image-item}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
