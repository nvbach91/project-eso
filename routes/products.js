const router = require('express').Router();

const products = [
  {
    ean: '0',
    name: 'swallow grass',
    price: '142.00',
    img: 'bg09_hjz6no',
    category: '2',
    highlight: true
  },
  {
    ean: '1',
    name: 'freight dream',
    price: '142.00',
    img: 'bg10_coyfml',
    category: '2'
  },
  {
    ean: '2',
    name: 'comfort veil',
    price: '112.00',
    img: 'bg07_wrsdxe',
    category: '7'
  },
  {
    ean: '3',
    name: 'equinox faint',
    price: '172.00',
    img: 'bg04_i3fq68',
    category: '4'
  },
  {
    ean: '4',
    name: 'cunning voyage',
    price: '156.00',
    img: 'bg06_gmmeqj',
    category: '3'
  },
  {
    ean: '5',
    name: 'trolley bus',
    price: '171.00',
    img: 'bg01_mog1lh',
    category: '2'
  },
  {
    ean: '6',
    name: 'scandal shark',
    price: '181.00',
    img: 'bg05_osoyo0',
    category: '0',
    highlight: true
  },
  {
    ean: '7',
    name: 'primary die',
    price: '162.00',
    img: 'bg02_komziq',
    category: '7'
  },
  {
    ean: '8',
    name: 'capital top',
    price: '131.00',
    img: 'bg03_tdlabn',
    category: '0'
  },
  {
    ean: '9',
    name: 'service pull',
    price: '119.00',
    img: 'bg08_hsajsa',
    category: '8'
  },
  {
    ean: '11',
    name: 'reactor deer',
    price: '242.00',
    img: 'bg10_coyfml',
    category: '5'
  },
  {
    ean: '22',
    name: 'freedom cherry',
    price: '212.00',
    img: 'bg07_wrsdxe',
    category: '2'
  },
  {
    ean: '33',
    name: 'recruit kneel',
    price: '272.00',
    img: 'bg04_i3fq68',
    category: '4'
  },
  {
    ean: '44',
    name: 'dribble suburb',
    price: '256.00',
    img: 'bg06_gmmeqj',
    category: '3'
  },
  {
    ean: '55',
    name: 'overall oak',
    price: '271.00',
    img: 'bg01_mog1lh',
    category: '2'
  },
  {
    ean: '66',
    name: 'cabinet pass',
    price: '281.00',
    img: 'bg05_osoyo0',
    category: '7'
  },
  {
    ean: '77',
    name: 'release cope',
    price: '262.00',
    img: 'bg02_komziq',
    category: '0'
  },
  {
    ean: '88',
    name: 'penalty sniff',
    price: '231.00',
    img: 'bg03_tdlabn',
    category: '1'
  },
  {
    ean: '99',
    name: 'clothes walk',
    price: '219.00',
    img: 'bg08_hsajsa',
    category: '0'
  },
  {
    ean: '111',
    name: 'fortune linen',
    price: '342.00',
    img: 'bg10_coyfml',
    category: '6'
  },
  {
    ean: '522',
    name: 'skilled jaw',
    price: '312.00',
    img: 'bg07_wrsdxe',
    category: '8'
  },
  {
    ean: '633',
    name: 'academy marine',
    price: '372.00',
    img: 'bg04_i3fq68',
    category: '6'
  },
  {
    ean: '666',
    name: 'husband wander',
    price: '381.00',
    img: 'bg05_osoyo0',
    category: '9'
  },
  {
    ean: '744',
    name: 'glasses salmon',
    price: '356.00',
    img: 'bg06_gmmeqj',
    category: '3'
  },
  {
    ean: '777',
    name: 'overeat duck',
    price: '362.00',
    img: 'bg02_komziq',
    category: '1'
  },
  {
    ean: '855',
    name: 'whisper porter',
    price: '371.00',
    img: 'bg01_mog1lh',
    category: '2'
  },
  {
    ean: '1111',
    name: 'chapter betray',
    price: '442.00',
    img: 'bg10_coyfml',
    category: '1'
  },
  {
    ean: '5222',
    name: 'soprano maze',
    price: '412.00',
    img: 'bg07_wrsdxe',
    category: '5'
  },
  {
    ean: '6333',
    name: 'attract pot',
    price: '472.00',
    img: 'bg04_i3fq68',
    category: '4'
  },
  {
    ean: '6666',
    name: 'inflate salad',
    price: '481.00',
    img: 'bg05_osoyo0',
    category: '0'
  },
  {
    ean: '7444',
    name: 'channel sight',
    price: '456.00',
    img: 'bg06_gmmeqj',
    category: '3'
  },
  {
    ean: '7777',
    name: 'fashion lazy',
    price: '462.00',
    img: 'bg02_komziq',
    category: '0'
  },
  {
    ean: '8555',
    name: 'recycle manage',
    price: '471.00',
    img: 'bg01_mog1lh',
    category: '7'
  },
  {
    ean: '8888',
    name: 'adviser class',
    price: '431.00',
    img: 'bg03_tdlabn',
    category: '1'
  },
  {
    ean: '9999',
    name: 'serious heal',
    price: '419.00',
    img: 'bg08_hsajsa',
    category: '0'
  },
  {
    ean: '22222',
    name: 'partner drama',
    price: '512.00',
    img: 'bg07_wrsdxe',
    category: '2'
  },
  {
    ean: '33333',
    name: 'density chief',
    price: '572.00',
    img: 'bg04_i3fq68',
    category: '4'
  },
  {
    ean: '44444',
    name: 'drawing seller',
    price: '556.00',
    img: 'bg06_gmmeqj',
    category: '3'
  },
  {
    ean: '55555',
    name: 'musical pair',
    price: '571.00',
    img: 'bg01_mog1lh',
    category: '2'
  },
  {
    ean: '66666',
    name: 'wrestle ditch',
    price: '581.00',
    img: 'bg05_osoyo0',
    category: '7'
  },
  {
    ean: '77777',
    name: 'kinship oppose',
    price: '562.00',
    img: 'bg02_komziq',
    category: '0'
  },
  {
    ean: '88888',
    name: 'offense panel',
    price: '531.00',
    img: 'bg03_tdlabn',
    category: '1'
  },
  {
    ean: '00',
    name: 'produce retire',
    price: '242.00',
    img: 'bg09_hjz6no',
    category: '2'
  },
  {
    ean: '000',
    name: 'bathtub shrink',
    price: '342.00',
    img: 'bg09_hjz6no',
    category: '2'
  },
  {
    ean: '0000',
    name: 'address cousin',
    price: '442.00',
    img: 'bg09_hjz6no',
    category: '2'
  }
];

router.get('/products', (req, res) => {
  res.json(products);
});

module.exports = router;
