const { REFERAL_CODES } = require('../config/config');
const tokenModel = require('../models/token.model');
const user = require('../models/user.model');
exports.userRegister = async (req, res) => {
try{

    let User = new user({
            phoneNumber: req.body.phoneNumber,
            name: req.body.name,
            email: req.body.email,
            dateOfBirth: req.body.dateOfBirth
    });

    const projection = { _id: 0, __v:0}
    const isUserPresent = await user.findOne({"phoneNumber" : req.body.phoneNumber},projection);
    if(req.body.phoneNumber == isUserPresent?.phoneNumber){
        res.status(409).json({
            status: "Duplicate Record",
            message: `${req.body.phoneNumber} is already registered`
        });
    } else{
        const result = await User.save();
        res.status(201).json({data : {
            phoneNumber: req.body.phoneNumber,
            name: req.body.name,
            dateOfBirth: req.body.dateOfBirth
        }, details: {
            status: "User Successfully Registered",
            message: "To proceed hit api </user/referal> for referal code validation"
        }})
 }    
}catch(error){
    console.log(error);
}
}

exports.validateReferal = async (req, res) => {
    const referalCode = req.body.referalCode;
    const referals  = REFERAL_CODES.split(" ");
    const a = referals.some((item)=> {
        if(item == referalCode){
            return true
        }
        return false
    })
    if(a){
        res.status(200).json({
            status: "Success",
            message: "Entered referal code is correct"
        })
    }else{
        res.status(406).json({
            status:"Not Acceptable",
            message: "Invalid Referal Code"
        })
    }
}

exports.logout = async (req, res) => {
    const phoneNumber = req.body.phoneNumber;
    try{
        await tokenModel.deleteOne({"key": phoneNumber});
        res.status(200).json({
            status: "Successfully loggedOut",
            message: "User is logged out"
        })
    }catch(err){
        console.log(err);
        res.status(500).json({err})
    }
}