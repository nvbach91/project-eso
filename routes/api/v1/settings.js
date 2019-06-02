const router = require('express').Router();

const settings = {
  number: 0,
  name: 'The Elusive Camel',
  address: {
    street: 'Americká 123',
    city: 'Praha 2',
    zip: '12000',
    country: 'Česká republika',
  },
  taxRates: [0, 10, 15, 21],
  residence: {
    street: 'Madridská 456',
    city: 'ěščřžýáíéúůďťň ĚŠČŘŽÝÁÍÉÚŮĎŤŇ\n' +
      'abcdefg{hijlkm}n opqrstuvwxyz\n' +
      'ABCDEFGHI`JLKMN OP´QRSTUVWXYZ\n' +
      '1234567890-=[This is small];This is big\n' +
      '\'\\,.//*-+\n' +
      '~!@#$%^&*()_+{bold}:"|<>?\n' +
      '°ˇ§¨\n',
    zip: '11000',
    country: 'Česká republika',
  },
  employees: {
    kiosk: 'Kiosk'
  },
  receipt: {
    img: '',
    header: 'Enjoy your meal',
    footer: '\\tThank you for coming\\t\n\\telusivecamel.co.uk\\t',
    width: 58,
    printWidth: 35,
    extraPadding: 0,
  },
  tin: '12345678',
  vat: 'CZ12345678',
  carouselInterval: 20000,
  currency: { code: 'CZK', symbol: 'Kč' },
  printer: 'EPSON TM-T20II Receipt',
  paymentTerminal: {
    ip: '10.0.0.42',
    port: '2050',
    password: 'sJ8niYXknkLAdlM3s8WnFLNR2GdCMGaM8G8JxC7SizwIbu7QztAzY44y4A8Z1rMcwS9kvBH11QsA7LLP',
    endpoint: 'https://localhost:3443/pt',
  },
  ors: {
    public_key: '',
    private_key: '',
    vat: 'CZ12345678',
    fileName: '',
    store_id: '11',
    upload_date: '2019-05-03T12:54:11.000Z',
    valid_until: '2022-05-03T12:54:11.000Z'
  },
  activityTimeout: 60000, // if the app is idle for this amount of time, an activity check dialog will appear
  activityCheckTimeout: 25000, // if the app is idle for this amount of time after the check appeared, the app will reset
};

router.get('/settings', (req, res) => {
  //console.log(req.user);
  res.json(settings);
});

module.exports = router;
