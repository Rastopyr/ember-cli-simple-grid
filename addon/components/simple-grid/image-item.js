import Ember from 'ember';
import Item from './item';

const { on } = Ember;

export default Item.extend({
  type: 'image',

  reprocessAfterImageLoad: on('didInsertElement', function() {
    const image = this.$('img');

    if (!image[0]) {
      return;
    }

    image.on('load', () => {
      const item = this.get('item');

      item.set('state', 'loaded');
      this.sendAction('replaceItems', item);
    });
  }),
});
