const router = require('express').Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Enterprise Self-Ordering System' });
});

module.exports = router;
