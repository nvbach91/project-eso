const router = require('express').Router();
const Users = require('../models/Users');
const Groups = require('../models/Groups');
const Products = require('../models/Products');
const Slides = require('../models/Slides');
const Companies = require('../models/Companies');
const Registers = require('../models/Registers');
const utils = require('../utils');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const ObjectId = require('mongoose').Types.ObjectId;

router.post('/registration', (req, res) => {
  // console.log(req.body);
  const newCompanyId = new ObjectId();
  const newRegisterId = new ObjectId();

  const secret = req.get('host').includes('vcap.me:') ? '6LdxvfoUAAAAAIou4tejttm-i58FHkY7qFHPe4ob' : '6LePvPoUAAAAAGGe5cOWmerB1xb3EDS4Z4xP19L9';
  const response = req.body.token;
  axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${response}`).then((resp) => {
    if (!resp.data.success || resp.data.score < 0.5) {
      throw 'srv_recaptcha_failed';
    }
    return Companies.findOne({ subdomain: req.body.subdomain }).select('_id');
  }).then((company) => {
    if (company) {
      throw 'srv_subdomain_taken';
    }
    return Companies.findOne({ tin: req.body.tin }).select('_id');
  }).then((company) => {
    if (company) {
      throw 'srv_tin_registered';
    }
    const newCompany = JSON.parse(JSON.stringify(req.body));
    newCompany.vatRegistered = !!newCompany.vat;
    newCompany._id = newCompanyId;
    newCompany.license = 'trial';
    newCompany.expiration = new Date();
    newCompany.expiration.setDate(newCompany.expiration.getDate() + 180);
    newCompany.registrationDate = new Date();
    newCompany.bank = '';
    newCompany.theme = 'teal';
    newCompany.img = '';
    return new Companies(newCompany).save();
  }).then((newCompany) => {
    const newRegister = JSON.parse(JSON.stringify(req.body).replace(/"resicence\./g, '"address.').replace('"companyName"', '"name"'));
    newRegister._id = newRegisterId;
    newRegister.number = 0;
    newRegister.name = 'Kiosk #0';
    newRegister.vatRates = [0, 10, 15, 21];
    newRegister.receipt = { img: '', header: '', footer: '', extraPadding: 4 };
    newRegister.carouselInterval = 20000;
    newRegister.activityTimeout = 60000;
    newRegister.activityCheckTimeout = 25000;
    newRegister.autoNextTab = false;
    newRegister.printer = { name: '', diacritics: true, direct: true, columns: 42 };
    newRegister.kitchenPrinter = { name: '', diacritics: true, direct: true, columns: 42 };
    newRegister.paymentMethods = { card: { img: 'credit-card-min_aoqb3h', enabled: true }, cash: { img: 'cash-min_lautl6', enabled: true } };
    newRegister.terminal = { ip: '', port: 2050, password: 'sJ8niYXknkLAdlM3s8WnFLNR2GdCMGaM8G8JxC7SizwIbu7QztAzY44y4A8Z1rMcwS9kvBH11QsA7LLP', endpoint: 'https://localhost:3443/pt', id: '' };
    return new Registers(newRegister).save();
  }).then((newRegister) => {
    const newUser = JSON.parse(JSON.stringify(req.body));
    newUser.name = 'Admin';
    newUser.role = 'admin';
    newUser.username = `${req.body.subdomain}:${req.body.email}`;
    newUser.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    newUser.companyId = newCompanyId;
    newUser.regId = newRegisterId;
    newUser.token = '';
    return new Users(newUser).save();
  }).then((newUser) => {
    return new Groups({ number: 1, order: 0, regId: newRegisterId, img: 'https://image.flaticon.com/icons/svg/193/193552.svg', name: 'Starters' }).save();
  }).then((newGroup) => {
    return new Products({ ean: '1', name: 'Special offer', price: '240', img: 'https://res.cloudinary.com/ceny24/image/upload/bg07_wrsdxe', group: 1, vat: 15, desc: '', order: 0, regId: newRegisterId }).save();
  }).then((newProduct) => {
    return new Slides({ img: 'bg01_mog1lh-min_fbiyp4', text: 'Touch to start', order: 0, regId: newRegisterId }).save();
  }).then((newSlide) => {
    res.json({ msg: 'srv_registration_success' });
  }).catch(utils.handleError(res));
});

router.post('/ares', (req, res) => {
  axios.post('https://api.gokasa.cz/ares', req.body).then((resp) => {
    res.json(resp.data);
  }).catch(utils.handleError(res));
});

module.exports = router;
