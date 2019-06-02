const router = require('express').Router();

var categories = [
  {
    number: '0',
    name: 'Starters',
    img: 'https://image.flaticon.com/icons/svg/193/193552.svg'
  },
  {
    number: '1',
    name: 'Main course',
    img: 'https://image.flaticon.com/icons/svg/985/985505.svg'
  },
  {
    number: '2',
    name: 'Beverages',
    img: 'https://image.flaticon.com/icons/svg/130/130973.svg'
  },
  {
    number: '3',
    name: 'Alcohol',
    img: 'https://image.flaticon.com/icons/svg/113/113224.svg'
  },
  {
    number: '4',
    name: 'Deserts',
    img: 'https://image.flaticon.com/icons/svg/1588/1588999.svg'
  },
  // { number: '5', name: 'Burgers', img: 'bg01_mog1lh' },
  // { number: '6', name: 'Rice', img: 'bg05_osoyo0' },
  // { number: '7', name: 'Noodles', img: 'bg02_komziq' },
  // { number: '8', name: 'Wraps', img: 'bg03_tdlabn' },
  // { number: '9', name: 'Fasties', img: 'bg08_hsajsa' },
  // { number: '11', name: 'Beers', img: 'bg10_coyfml' },
  // { number: '22', name: 'Beverages', img: 'bg07_wrsdxe' },
  // { number: '33', name: 'Coffees', img: 'bg04_i3fq68' },
  // { number: '44', name: 'Menus', img: 'bg06_gmmeqj' },
  // { number: '55', name: 'Burgers', img: 'bg01_mog1lh' },
  // { number: '66', name: 'Rice', img: 'bg05_osoyo0' },
  // { number: '77', name: 'Noodles', img: 'bg02_komziq' },
  // { number: '88', name: 'Wraps', img: 'bg03_tdlabn' },
  // { number: '99', name: 'Fasties', img: 'bg08_hsajsa' },
  // { number: '00', name: 'Soups', img: 'bg09_hjz6no' }
];

router.get('/categories', (req, res) => {
  res.json(categories);
});

module.exports = router;
