import GridImage from '../grid-image';
import layout from '../../templates/components/grid-image/added';

function randomInteger(min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1)
  rand = Math.round(rand);
  return rand;
}

export default GridImage.extend({
  layout,

  add() {
    const items = this.get('items');
    const length =  items.length;

    items.unshiftObject({
      index: length,
      image: `http://lorempixel.com/${randomInteger(100, 700)}/${randomInteger(100, 700)}`
    });
  }
});
