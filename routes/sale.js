const router = require('express').Router();

router.post('/', (req, res) => {
  console.log(req.body);
  const receipt = {
    number: 19010000000,
    date: '2019-05-03T00:34:34.000Z',
    items: [
      {
        ean: '101',
        name: 'Noodle soup 101',
        price: '101.00',
        quantity: 2,
        tax: 15,
        category: 1,
      },
      {
        ean: '102',
        name: 'Candy cake slice',
        price: '42.00',
        quantity: 3,
        tax: 15,
        category: 4,
      }
    ],
    tendered: 101,
    payment: 'card',
    takeout: false,
    discount: 0,
    clerk: 'kiosk',
    bkp: '',
    fik: '',
    customer: '',
  }
  res.json({ success: true, msg: receipt });
});

module.exports = router;
