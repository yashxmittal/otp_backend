module.exports = function(app) {
    var otp = require('../controller/otp.controller')

    app.post('/otp', otp.findOne)
    app.post('/otp/verify', otp.verify)
}