const https = require('https');
const axiosConfig = {};//{ httpsAgent: new https.Agent({ rejectUnauthorized: false }) };

const utils = {};

utils.handleError = (res) => (err) => {
  console.error(err);
  res.status(err.code || 500).json({ msg: err.msg || (err.isOperational ? 'srv_invalid_certificate_password' : 'srv_internal_server_error') });
};

utils.axiosConfig = axiosConfig;

module.exports = utils;