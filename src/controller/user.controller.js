const user = require('../models/user.model');
exports.userRegister = async (req, res) => {
try{
    if(!req.body.phoneNumber && !req.body.name && !req.body.email && !req.body.dateOfBirth){
        res.status(400).json({
            "message": {
                "phoneNumber" : "10 digit phone no required",
                "name": "name is required",
                "email": "email is required",
                "dateOfBirth": "dateOfBith is required"
            } 
        });
    }

    let User = new user({
            phoneNumber: req.body.phoneNumber,
            name: req.body.name,
            email: req.body.email,
            dateOfBirth: req.body.dateOfBirth
    });

    const projection = { _id: 0, __v:0}
    const isUserPresent = await user.findOne({"phoneNumber" : req.body.phoneNumber},projection);
    console.log(isUserPresent)
    if(req.body.phoneNumber == isUserPresent?.phoneNumber){
        res.status(409).json({
            status: "Duplicate Record",
            message: `${req.body.phoneNumber} is already registered`
        });
    } else{
        const result = await User.save();
        res.status(201).json({
            phoneNumber: req.body.phoneNumber,
            name: req.body.name,
            dateOfBirth: req.body.dateOfBirth
        })
 }    
}catch(error){
    console.log(error);
}
}