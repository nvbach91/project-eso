const router = require('express').Router();
const Companies = require('../models/Companies');
const themes = {
  //default: 'https://unpkg.com/bootstrap-material-design@4.1.1/dist/css/bootstrap-material-design.min.css',
  teal: '/css/bootstrap-material-design.min.css',
  dark: '/css/bootstrap-material-design.dark.min.css',
};
const imageUrlBase = 'https://res.cloudinary.com/itakecz/image/upload/';
const defaultCompanyImg = 'favicon_zuuuf9';
const appName = 'Enterprise Self-Ordering System';


router.get('/themes', (req, res) => {
  res.json(themes);
});

/* GET home page. */
router.get('/', (req, res, next) => {
  Companies.findOne({ subdomain: req.get('host').split('.')[0] }).select('companyName theme img').then((company) => {
    if (!company) {
      throw 'srv_company_not_found';
    }
    res.render('index', {
      title: `${company.companyName} | ${appName}`,
      theme: themes[company.theme] || themes.teal,
      icon: `${imageUrlBase}${company.img || defaultCompanyImg}`,
    });
  }).catch((err) => {
    res.render('error', { message: err })
  });
});

router.get('/admin', (req, res, next) => {
  Companies.findOne({ subdomain: req.get('host').split('.')[0] }).select('companyName theme img').then((company) => {
    if (!company) {
      throw 'srv_company_not_found';
    }
    res.render('admin', {
      title: `${company.companyName} | ${appName}`,
      theme: themes[company.theme] || themes.teal,
      icon: `${imageUrlBase}${company.img || defaultCompanyImg}`,
    });
  }).catch((err) => {
    res.render('error', { message: err })
  });
});

module.exports = router;
