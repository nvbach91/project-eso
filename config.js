const https = require('https');
const axiosConfig = {};//{ httpsAgent: new https.Agent({ rejectUnauthorized: false }) };

const config = {
  secret: 'such+sEcrEEt<much=sEcurity~wow',
  orsSaleAuthorizationUrl: 'https://trafika.vcap.me:3000/public/eet-authorize-sale',
  axiosConfig,
};

module.exports = config;
