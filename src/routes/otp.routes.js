module.exports = function(app) {
    const otp = require('../controller/otp.controller');

    app.post('/otp', otp.findOne);
    app.post('/otp/verify', otp.verify);
}