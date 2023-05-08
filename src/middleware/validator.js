exports.validator = function (req, res, next) {

    if (!req.body.phoneNumber && !req.body.name && !req.body.email && !req.body.dateOfBirth) {
        return res.status(400).json({
            "status": "Validation error",
            "message": {
                "phoneNumber": "10 digit phone no required",
                "name": "name is required",
                "email": "email is required",
                "dateOfBirth": "dateOfBith is required"
            }
        });
    }
    if (!/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/.test(req.body.phoneNumber)) {
        return res.status(404).json({
            "status": "Validation error",
            "message": "Not a valid phonenumber",
            "expected": "must be of 10 digits"
        })
    }
    if (!/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(req.body.email)) {
        return res.status(404).json({
            "status": "Validation error",
            "message": "Not a valid email",
            "ecpected": "abc@xyz.pqr"
        })
    }
    if (!/^(?:0[1-9]|[12]\d|3[01])([\/.-])(?:0[1-9]|1[012])\1(?:19|20)\d\d$/.test(req.body.dateOfBirth)) {
        return res.status(404).json({
            "status": "Validation error",
            "message": "Not a valid Date of birth",
            "expected": "DD-MM-YYYY"
        })
    }
    next();
}