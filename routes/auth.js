const router = require('express').Router();

router.post('/auth', (req, res) => {
  if (req.body.username !== req.body.password) {
    return res.sendStatus(401);
  }
  res.sendStatus(200);
});

module.exports = router;
