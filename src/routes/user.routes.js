module.exports = function(app) {
    var user = require('../controller/user.controller');
    const validator = require('../middleware/validator');
    app.post('/user/reg', validator.validator, user.userRegister);
    app.post('/user/referal', user.validateReferal);
    app.delete('/user/logout', user.logout);
}