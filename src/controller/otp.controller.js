const User = require('../models/user.model');
const { twilio, verify } = require('../sms-service/sms.service');
exports.findOne = async function(req, res){
    try{
        // verify if user exists or not
        const phoneNumber = req.body.phoneNumber;
        const projection = { _id: 0, __v:0}
        const isUserPresent = await User.findOne({"phoneNumber" : phoneNumber},projection);

        /**
         * if user present then redirect it to twilio apis
         * for otp verification
         */
        if(!!isUserPresent){
            const result = await twilio(phoneNumber)
            if(result == 'pending'){
                res.status(200).json({
                    type: "Success",
                    message: `OTP has been sent on number ${phoneNumber}`,
                    redirecting: "redirect to enter otp api to enter and verify otp </otp/verify>"
                })
            } else {
                res.status(500).json({
                    type: "Internal Server Error",
                    message: "Their is some error from the server side"
                })
            }
        }
        /**
         * if user isnot present then redirect it to register himself first
         */
    }catch(err){
        console.log(err)
    }
}
    

exports.verify = async function(req, res){
        try{
            const otp = req.body.otp;
            const phoneNumber = req.body.phoneNumber;
            const projection = { _id: 0, __v:0}
            const isUserPresent = await User.findOne({"phoneNumber" : phoneNumber},projection);
            const userName = isUserPresent.name;
            const result = await verify(phoneNumber,otp);
            if(result == "pending"){
                res.status(401).json({
                    type: "Unauthorized",
                    message: "OTP entered is in-correct",
                })
            } 
            else if(result == "approved"){
                res.status(200).json({
                    type: "Success",
                    message: `WELCOME! ${userName} ` 
                })
            }
        }catch(error){
            console.log(error)
        }
    }