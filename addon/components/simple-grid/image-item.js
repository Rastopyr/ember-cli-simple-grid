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

    const item = this.get('item');

    item.set('column', 0);
    item.set('top', 0);

    image.on('load', () => {
      const { item, isDestroyed } = this.getProperties('item', 'isDestroyed');

      if (isDestroyed) {
        return;
      }

      item.set('state', 'loaded');
      item.set('shouldRerender', true);
    });
  }),
});
