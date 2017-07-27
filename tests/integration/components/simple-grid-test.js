import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

const { run } = Ember;

moduleForComponent('simple-grid', 'Integration | Component | simple grid', {
  integration: true,
  beforeEach() {
    this.container.lookup('component:simple-grid/item');
  }
});

function list(length) {
  const l = [];

  for (var i = 0; i < length; i++) {
    l.push(i);
  }

  return l;
}

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{simple-grid}}`);

  assert.equal(this.$().text().trim(), '');
});

test('it should correct compute all elements', function(assert) {
  this.set('items', list(30));

  this.render(hbs`
    {{#simple-grid columnWidth=300 as |grid|}}
      {{#each items as | item |}}
        {{#grid.item height=300 class=(concat "grid-item grid-item-" item)}}
          Item {{item}}
        {{/grid.item}}
      {{/each}}
    {{/simple-grid}}
  `);

  this.$('.grid-item').each((index, elem) => {
    assert.equal(this.$(elem).width(), 300, 'width of elems')
  });
});

test('it should compute correct element bounding rect', function(assert) {
  this.render(hbs`
    {{#simple-grid columnWidth=300 as |grid|}}
      {{#grid.item height=300 class="grid-item-1"}}
        300x300
      {{/grid.item}}
    {{/simple-grid}}
  `);


  assert.equal(this.$('.grid-item-1').height(), 300, 'height of elem');
  assert.equal(this.$('.grid-item-1').width(), 300, 'width of elem');
});

test('it should adapt to the columns count', function(assert) {
  this.set('columns', 3);
  this.set('items', list(30));

  this.render(hbs`
    <div style="width: 300px">
      {{#simple-grid columns=columns as |grid|}}
        {{#each items as | item |}}
          {{#grid.item height=300 class=(concat "grid-item grid-item-" item)}}
            Item {{item}}
          {{/grid.item}}
        {{/each}}
      {{/simple-grid}}
    </div>
  `);

  assert.equal(this.$('.grid-item-1').width(), 90, 'width of elem');

  this.set('columns', 2);

  return run.next( () => run.next(() => {
    run.schedule('afterRender', () => {
      assert.equal(this.$('.grid-item-1').width(), 140, 'width of elem');
    });
  }));
});
