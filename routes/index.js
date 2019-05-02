const router = require('express').Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'The Elusive Camel | ESO' });
});

module.exports = router;
