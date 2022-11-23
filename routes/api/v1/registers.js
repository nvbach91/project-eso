const router = require('express').Router();
const utils = require('../../../utils');
const Registers = require('../../../models/Registers');

router.get('/registers', (req, res) => {
  const query = { subdomain: req.user.subdomain };

  Registers.find(query).select('_id name number').then((registers) => {
    res.json(registers);
  }).catch(utils.handleError(res));
});


module.exports = router;
