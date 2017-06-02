// import Ember from 'ember';
// import { moduleForComponent, test } from 'ember-qunit';
// import hbs from 'htmlbars-inline-precompile';
//
// const { run } = Ember;
//
// moduleForComponent('simple-grid', 'Unit | Component | simple grid', {
//   // Specify the other units that are required for this test
//   needs: ['component:simple-grid/item'],
//   unit: true,
//
//   beforeEach() {
//     this.container.lookup('component:simple-grid/item');
//   }
// });
//
// test('it renders', function(assert) {
//   // Creates the component instance
//   // Renders the component to the page
//   let component = this.subject();
//
//   this.set('externalAction', () => {
//     console.log(arguments);
//   });
//
//   this.render(hbs`
//     {{#simple-grid as | grid |}}
//       {{#grid.item}}
//         Hello world
//       {{/grid.item}}
//
//       {{#grid.item}}
//         Hello world2
//       {{/grid.item}}
//     {{/simple-grid}}
//   `);
//
//   assert.equal(component.get('items.length'), 2);
// });
