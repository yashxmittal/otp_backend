module.exports = function(app) {
    var user = require('../controller/user.controller');

    app.post('/user/reg', user.userRegister);
}