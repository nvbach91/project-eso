const router = require('express').Router();
const Companies = require('../models/Companies');
const themes = {
  //default: 'https://unpkg.com/bootstrap-material-design@4.1.1/dist/css/bootstrap-material-design.min.css',
  teal: '/css/bootstrap-material-design.min.css',
  dark: '/css/bootstrap-material-design.dark.min.css',
  red: '/css/bootstrap-material-design.red.min.css',
};
const imageUrlBase = 'https://res.cloudinary.com/itakecz/image/upload/';
const defaultCompanyImg = 'favicon_zuuuf9';
const appName = 'Enterprise Self-Ordering System';


router.get('/themes', (req, res) => {
  res.json(themes);
});

router.post('/secret/errors', (req, res) => {
  console.error(req.body.err_msg, '\nuser:', req.body.user);
  res.json({ success: true });
});

/* GET home page. */
router.get('/', (req, res) => {
  const subdomain = req.get('host').split('.')[0];
  if (subdomain === 'registration') {
    return res.render('registration', {
      title: appName,
      theme: themes.teal,
      icon: defaultCompanyImg,
      recaptchaApiUrl: `https://www.google.com/recaptcha/api.js?render=${req.get('host').includes('vcap.me:') ? '6LdxvfoUAAAAAJKKOOh1aVzl09Zr9PC1HmjhUfEN' : '6LePvPoUAAAAAMDCrKvC8LZVkqO4uCRXQbJw8Rbm'}`,
    });
  }
  Companies.findOne({ subdomain }).select('companyName theme img').then((company) => {
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

router.get('/admin', (req, res) => {
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
