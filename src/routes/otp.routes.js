module.exports = function(app) {
    const otp = require('../controller/otp.controller');
// route for receiving otp
    app.post('/otp', otp.findOne);
// route for verification of otp 
    app.post('/otp/verify', otp.verify);
}