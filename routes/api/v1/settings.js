const router = require('express').Router();
const mongoose = require('mongoose');
const Registers = require('../../../models/Registers');
const Companies = require('../../../models/Companies');
const Slides = require('../../../models/Slides');
const Users = require('../../../models/Users');
const utils = require('../../../utils');
const btoa = require('btoa');
const pem = require('pem');
const bluebird = require('bluebird');
//const atob = require('atob');
const readPkcs12 = bluebird.promisify(pem.readPkcs12);
//const verifySigningChain = bluebird.promisify(pem.verifySigningChain);
const readCertificateInfo = bluebird.promisify(pem.readCertificateInfo);

router.get('/settings', (req, res) => {
  let settings = {};
  let _register;
  Registers.findOne({ _id: req.user.regId }).select('-__v').then((register) => {
    settings = { ...register._doc };
    _register = register;

    return Companies.findOne({ _id: req.user.companyId }).select('tin vat vatRegistered residence companyName bank theme img');
  }).then((company) => {
    const { residence, tin, vat, vatRegistered, companyName, bank, theme, img } = company._doc;
    settings = { ...settings, residence, tin, vat, vatRegistered, companyName, bank, theme, img };

    return Users.find({ subdomain: req.user.subdomain }).select('username name regId');
  }).then((users) => {
    settings.employees = {};
    users.forEach((user) => settings.employees[user.username.split(':')[1]] = { name: user.name, regId: user.regId });

    return Registers.find({ subdomain: req.user.subdomain }).select('_id name number');
  }).then((registers) => {
    settings.registers = registers;

    return Slides.find({ regId: _register.syncRegId || req.user.regId }).select('-__v -regId');
  }).then((slides) => {
    settings.slides = {};
    slides.forEach(({ _id, text, img, position, video }) => {
      settings.slides[_id.toString()] = { text, img, position, video };
    });

    res.json(settings);
  }).catch(utils.handleError(res));
});

router.post('/settings', (req, res) => {
  const settings = { ...req.body };
  Registers.updateOne({ _id: req.user.regId }, { $set: settings }).then(() => {
    res.json({ msg: 'srv_success' });
  }).catch(utils.handleError(res));
});

router.post('/company', (req, res) => {
  const settings = { ...req.body };
  Companies.updateOne({ _id: req.user.companyId }, { $set: settings }).then(() => {
    res.json({ msg: 'srv_success' });
  }).catch(utils.handleError(res));
});

router.delete('/ors', (req, res) => {
  Registers.updateOne({ _id: req.user.regId }, { $unset: { ors: true } }).then(() => {
    res.json({ msg: 'srv_success' });
  });
});

router.post('/ors', (req, res) => {
  const { _content, _password, _upload_date, _valid_until, ...settings } = req.body;
  readPkcs12(Buffer.from(_content.replace(/^data:application\/x-pkcs12;base64,/, ''), 'base64'), { p12Password: _password }).then((result) => {
    settings['ors.public_key'] = btoa(result.cert);
    settings['ors.private_key'] = btoa(result.key);
    return readCertificateInfo(result.cert);
  }).then((certInfo) => {
    if (!certInfo.commonName.includes(settings['ors.vat'])) {
      throw { code: 400, msg: 'srv_certificate_invalid_vat' };
    }
    settings['ors.upload_date'] = new Date();
    settings['ors.valid_until'] = new Date(Number(certInfo.validity.end));
    return Registers.updateOne({ _id: req.user.regId }, { $set: settings });
  }).then(() => {
    res.json({ msg: settings });
  }).catch(utils.handleError(res));
});

router.post('/slides', async (req, res) => {
  const register = await Registers.findOne({ _id: req.user.regId }).select('syncRegId');
  if (register.syncRegId) {
    return res.status(409).json({ success: false, msg: 'srv_cannot_modify_synced_reg' });
  }

  const { _id, ...slide } = req.body;
  if (_id) {
    return Slides.updateOne({ _id }, { $set: slide }).then(() => {
      res.json({ msg: 'srv_success' });
    }).catch(utils.handleError(res));
  } else {
    return new Slides({ ...slide, regId: req.user.regId }).save().then(() => {
      res.json({ msg: 'srv_success' });
    }).catch(utils.handleError(res));
  }
});

router.delete('/slides/:_id', async (req, res) => {
  const register = await Registers.findOne({ _id: req.user.regId }).select('syncRegId');
  if (register.syncRegId) {
    return res.status(403).json({ success: false, msg: 'srv_cannot_modify_synced_reg' });
  }

  Slides.deleteOne({ _id: req.params._id }).then(() => {
    res.json({ msg: 'srv_success' });
  }).catch(utils.handleError(res));
});

router.delete('/settings/kioskPrinters/:id', (req, res) => {
  Registers.updateOne({ _id: req.user.regId }, { $unset: { [`kioskPrinters.${req.params.id}`]: true } }).then(() => {
    res.json({ msg: 'srv_success' });
  }).catch(utils.handleError(res));
});

router.delete('/settings/kitchenPrinters/:id', (req, res) => {
  Registers.updateOne({ _id: req.user.regId }, { $unset: { [`kitchenPrinters.${req.params.id}`]: true } }).then(() => {
    res.json({ msg: 'srv_success' });
  }).catch(utils.handleError(res));
});

router.delete('/settings/labelPrinters/:id', (req, res) => {
  Registers.updateOne({ _id: req.user.regId }, { $unset: { [`labelPrinters.${req.params.id}`]: true } }).then(() => {
    res.json({ msg: 'srv_success' });
  }).catch(utils.handleError(res));
});

/* test
var vat = 'CZ00000019';
var store_id = '11';
var file_name  = 'EET_CA1_Playground-CZ00000019.p12';
var fileContent = decodeURIComponent('data%3Aapplication%2Fx-pkcs12%3Bbase64%2CMIIPqwIBAzCCD3EGCSqGSIb3DQEHAaCCD2IEgg9eMIIPWjCCChEGCSqGSIb3DQEHAaCCCgIEggn%2BMIIJ%2BjCCBOwGCyqGSIb3DQEMCgEDoIIEtDCCBLAGCiqGSIb3DQEJFgGgggSgBIIEnDCCBJgwggOAoAMCAQICBHRzlycwDQYJKoZIhvcNAQELBQAwdzESMBAGCgmSJomT8ixkARkWAkNaMUMwQQYDVQQKDDrEjGVza8OhIFJlcHVibGlrYSDigJMgR2VuZXLDoWxuw60gZmluYW7EjW7DrSDFmWVkaXRlbHN0dsOtMRwwGgYDVQQDExNFRVQgQ0EgMSBQbGF5Z3JvdW5kMB4XDTE2MDkzMDA5MDM1OVoXDTE5MDkzMDA5MDM1OVowQzESMBAGCgmSJomT8ixkARkWAkNaMRMwEQYDVQQDEwpDWjAwMDAwMDE5MRgwFgYDVQQNEw9wcmF2bmlja2Egb3NvYmEwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCZzVD1vKwJS4tigMLtdltb6i49NpliIn6vyadP7VI3%2FQfEaZAwA9xjqg3Vbh0n8Xo%2FdlohKLg8u1%2FLl8yA3WbuKVwN7dyp7cTPKwJbtlOkqrRd5E0fgCQncH5DOd1N8%2BP6qMiqnUPJRrjMSSrO1%2BbiI3GP1A0lzCvTk5l0YZ3Y2HF9aCC6%2BRdjjX9WdJFspf0vcCNHJdIENRfdZs6oJ5R%2FNLtopzJpgaeNp3UeExktZ743q%2BQ%2B925C4NO03Xqp1IOtPVsI1CTfejimTLCl8wTM7dPTW4UHAAVpwFm0U0lYbAHQzvL35lsdgvoF1JZCL7TvvX24%2FNRktcXTaAJKQEVHAgMBAAGjggFeMIIBWjAJBgNVHRMEAjAAMB0GA1UdDgQWBBS%2F9G9CMOhWN91E%2FIiRMtVe52VUejAfBgNVHSMEGDAWgBR8MHaszNaH0ezJH%2BJwCCzjX94MBzAOBgNVHQ8BAf8EBAMCBsAwYwYDVR0gBFwwWjBYBgpghkgBZQMCATABMEowSAYIKwYBBQUHAgIwPAw6VGVudG8gY2VydGlmaWvDoXQgYnlsIHZ5ZMOhbiBwb3V6ZSBwcm8gdGVzdG92YWPDrSDDusSNZWx5LjCBlwYDVR0fBIGPMIGMMIGJoIGGoIGDhilodHRwOi8vY3JsLmNhMS1wZy5lZXQuY3ovZWV0Y2ExcGcvYWxsLmNybIYqaHR0cDovL2NybDIuY2ExLXBnLmVldC5jei9lZXRjYTFwZy9hbGwuY3JshipodHRwOi8vY3JsMy5jYTEtcGcuZWV0LmN6L2VldGNhMXBnL2FsbC5jcmwwDQYJKoZIhvcNAQELBQADggEBAL13VrFPiG3dVcrCp46MukQmFXCPfqEVEkk70EAySxY8J%2BUpuh3m4XIvBERsAM3dkerqj3c5dSgo5hzorcqWeunvv3vcI9wWg6oASkWWL8WcpGlVHbUIBtPNfSWZol02xoDgiolDyFzvNHJz%2B1NWT5FTVe1mcIdCNpP34NVS0yORwP8eAXg%2B%2B8IhDhMWu3qnjyRE9I6U1Sty8UlufSyyCUToeP5HykG07wy%2BWKcPFmoADFQj71pxiSHFK7vgKS1OKWQ%2FW3R0mtSG%2BC6RYbVq5B2DP16im49mzSio06OU97FNAX9kA90M5JnI5TVRtFfqgIIpsE3T7nlP5rRMcPu89fwxJTAjBgkqhkiG9w0BCRUxFgQUKF17UFIVl0MH%2FEzmhS1dvnuWrxUwggUGBgsqhkiG9w0BDAoBA6CCBPUwggTxBgoqhkiG9w0BCRYBoIIE4QSCBN0wggTZMIIDwaADAgECAgUAg8P1hTANBgkqhkiG9w0BAQsFADB3MRIwEAYKCZImiZPyLGQBGRYCQ1oxQzBBBgNVBAoMOsSMZXNrw6EgUmVwdWJsaWthIOKAkyBHZW5lcsOhbG7DrSBmaW5hbsSNbsOtIMWZZWRpdGVsc3R2w60xHDAaBgNVBAMTE0VFVCBDQSAxIFBsYXlncm91bmQwHhcNMTYwOTI5MTk1NDQwWhcNMjIwOTI5MTk1NDQwWjB3MRIwEAYKCZImiZPyLGQBGRYCQ1oxQzBBBgNVBAoMOsSMZXNrw6EgUmVwdWJsaWthIOKAkyBHZW5lcsOhbG7DrSBmaW5hbsSNbsOtIMWZZWRpdGVsc3R2w60xHDAaBgNVBAMTE0VFVCBDQSAxIFBsYXlncm91bmQwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDUjJTbNL%2BCb7ron0fmYvlbnTvXLzwQXR%2FhfjjRNe4KM2%2FB2O9CFpDLabCbn6EbdGe5q9CclA6giLnfZcsk1NrDM%2FbcxS0KGOhrQHieABudJFdeyNKxwl17549TxYqTGbF93kF65biwcWHgK6QjVSbAOzdwvLgFDd5zS1iaf4fND7HM6BM7wSYN2vmhOyjFXRNKiIhBVp5L6nlCiHH1lSwHofajKDrwYJKT%2Bi1lSjzDPvUtbZtY1PG8O%2FFHpg%2Bmcq1D6P0U1T0l5fvpre8RnnvwNtwatL%2FSIJnixPOtTjvMGZ2GfiYgnfIAHpTTLh1IpV3pMyqV1XLmHp6nqFNChQV3AgMBAAGjggFqMIIBZjASBgNVHRMBAf8ECDAGAQH%2FAgEAMCAGA1UdDgEB%2FwQWBBR8MHaszNaH0ezJH%2BJwCCzjX94MBzAOBgNVHQ8BAf8EBAMCAQYwHwYDVR0jBBgwFoAUfDB2rMzWh9HsyR%2FicAgs41%2FeDAcwYwYDVR0gBFwwWjBYBgpghkgBZQMCATABMEowSAYIKwYBBQUHAgIwPAw6VGVudG8gY2VydGlmaWvDoXQgYnlsIHZ5ZMOhbiBwb3V6ZSBwcm8gdGVzdG92YWPDrSDDusSNZWx5LjCBlwYDVR0fBIGPMIGMMIGJoIGGoIGDhilodHRwOi8vY3JsLmNhMS1wZy5lZXQuY3ovZWV0Y2ExcGcvYWxsLmNybIYqaHR0cDovL2NybDIuY2ExLXBnLmVldC5jei9lZXRjYTFwZy9hbGwuY3JshipodHRwOi8vY3JsMy5jYTEtcGcuZWV0LmN6L2VldGNhMXBnL2FsbC5jcmwwDQYJKoZIhvcNAQELBQADggEBAEeJ4dX6ftqBsFFhjMdtau6qLWIXt1fWDxyi08%2BDn3QV9AQCEr43B5%2Fz%2Bw816jyBP32J3PJFKrrRzZ%2FWdWVxr7lbthWNRXYqtWpsT7Uq7gZP0r9kVbrLIg5J4cGQIKOOg0lgtUEWAkx56lKgcViw2TSnPNmDsCZ6aHSTHF3hhzFzFkd7Sja03N1xQnqlDGDA5gjru56mwFKivfSpdOd4Ci4yothAcdzy%2FomwxcXOu%2BDa0MC1DM0Lchuyq7D5K6voi2BgyaSY6T1Z8rferuVR9fHfhfkX05MXpR0p9eS%2B342ZbtrJjB34Xj7el8WvfC8E12sbq2b9JRkFDjVO3g5MpaAwggVBBgkqhkiG9w0BBwGgggUyBIIFLjCCBSowggUmBgsqhkiG9w0BDAoBAqCCBO4wggTqMBwGCiqGSIb3DQEMAQMwDgQIaY2iOqP51e0CAggABIIEyBvU4RlKKrCqGMcC9xS6olH%2FVQuJjCmf70FIXIp9Cuj9UOUy2gKbnzGvuOz%2Fvq2SQOjXxGUSNB873MHIlSSsCkGWoCg05EreOFHiDm%2FS%2BxvH71HVihyqg2twgIf0rw39gmqOyhv8CWPFY1n5SQS62pdLqSUQDhdXKOMA1d6eJSWTx79IYATJCVYxtSkAlU6XnksbavtIk42x0afRpil3rj07UYAtNGDrmtOmCOn%2BDa00pVl5ylemJZvyIcflF89E7f4NLTdrobx8FAsG714n6s4DNzn9lc9jLbMCEqLwca2OAr%2BuxBnQ%2FcHkYMr%2FfKKuznrN385bgmis56Y4yz5c%2B1j9%2F1nXlU3Bc1JyZydtVUXZ8mR5Ja41Wx6U6vbDOxe7Cd6uJ3Fn7oxBvhRsRxn0C5VuWcuKYakauNWDy%2FQnw5PtDv5BszMYt1mIBuHqE%2B9qPoNeeX9e70cFpMqplaRyzQ98MzW%2BJgchoPDmQj6k1MXq%2FxFE2vCHKt3GdMMJ0DjfgSn5yzybxQoWle1EP3EF7KPAVHFb0sKYEvKdmf9GqLOF9CwIb4FaiIYIuJdUUrkiXNjnsHvCDZkZbm%2BcY0f65UGi1DHf1c3K47ujLg%2BsD9tT%2Bd3N5TC%2FMsKg6L1tW1Cj6qb0Dtpd4rGwkxUGpiYUxVv%2FFgf8sxwi0kqqQz8Sd3FeTT1BBQs8iwnh8YDov6YYvqQTtgiBIvipkpFXWiJ1tToUlRc7vFjxSvqXI4TXcOuDR2q6wW3u3F1maufRR1s%2F8B%2Bq3AnQ7qsv%2FinicRYVV8G%2BAYbRLVrNJ3nyDXnYzUNeG3dcnd%2Fl4g2y2kVvN5mFW1jjJWTb4bJJgRSPb1ZiD%2FI8DfvzJkIeeBQENoJubzMWkuP1%2FEo1Jbe9wEOLioB28HFFvaEzcjk7z3jZ2%2BQbvc7waE3hE2%2Fb1u7WFQlR00IJLqOCed3JPV2jh%2FepAXjSNhKNwQEzjh%2F1oi7wcNTys58q5PXiWhQDrqabEje%2BFCZ0ZrtqP%2FfpIe5eFwPhBnzHgFrWJATGsYrGtMwXhJ80%2FTofvRn%2B4qn%2Ftpu%2B1DK2WDJg%2BBP6t6ZBj5nxaTkvgKewfjx1Zme3X2YPJQath8MoUizjkUz%2BtZ2Q3EZEUfxRbck%2BuVnthvc0b3wXTfEoARMkr58p0V87uKInvnHQ9XVeZHAMAP8hiRsv2PH1Z7pj1W%2BXhq9riSHzaDeA2FXcCkQuA4EjUhs4BacnSmt3PD%2B8wMGt%2FWZUPMTIYm1v7hPC8%2FNm%2FyH2NJNjSCyrAwP8DEV0p1XsIUrvGYTpDUBafpJ6pwHhtiM6V2Vc8ZJl8FaDtRYE%2FynnuSuEr62aAs9W2V3FtchHCzp%2BqFwhanMsLP35GwBjn0LUyeiT6jCG3%2BMHHaZQ4ypu%2FmAcV6qIDhj1GLEu98Y7xdowGxVhWMpqnJe%2BTrlPaF%2BX3c9AjSYr9zaEHUfID%2B9Cmp9Dg7ABjKEl8E8BngyO3xaHUmp1cky%2BgTz8nYETZ7th3fE%2BE7%2FWD7YaoFrFWLmKi80hSthK4cGJzzlODV2L0JF33NjWVAUYZnIClthSD1RF3vmikl5hj6YJiTd1rE%2BMe4psHEZBPmgRgiJVRksu3%2BSoLogBOVi3FDHsSqBUFOd17h1GKjElMCMGCSqGSIb3DQEJFTEWBBQoXXtQUhWXQwf8TOaFLV2%2Be5avFTAxMCEwCQYFKw4DAhoFAAQUBjgt9BebT6gbwcHharzpmSO3P24ECNHPJXECW9k0AgIIAA%3D%3D');
var p12Password = 'eet';

readPkcs12(Buffer.from(fileContent.replace(/^data:application\/x-pkcs12;base64,/, ''), 'base64'), { p12Password }).then((file) => {
  console.log(file.cert);
  console.log(file.key);
  return readCertificateInfo(file.cert);
}).then((certInfo) => {
  console.log(certInfo);
});
*/

module.exports = router;
