import GridImage from '../grid-image';
import layout from '../../templates/components/grid-image/added';

export default GridImage.extend({
  layout,

  add() {
    const items = this.get('items');
    const length =  items.length;

    items.unshiftObject({
      index: length,
      image: length % 2 ?
        'http://lorempixel.com/300/600/' : 'http://lorempixel.com/600/400/'
    });
  }
});
