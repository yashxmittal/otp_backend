const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { twilio, verify } = require('../sms-service/sms.service');
const tokenModel = require('../models/token.model');

/**
 * This function take the number and check
 * if session present then directly logged him in 
 * if not then send otp
 * @param {req.body.phoneNumber} req 
 */
exports.findOne = async function (req, res) {
    try {
        const projection = { _id: 0, __v: 0 }
        const phoneNumber = req.body.phoneNumber;
        const isUserPresent = await User.findOne({ "phoneNumber": phoneNumber }, projection);
        if (isUserPresent) {
            const token = await tokenModel.findOne({ "key": phoneNumber }, projection);
            if (token) {
                const verification = await jwt.verify(token.token, "JWT_SECRET");
                if (verification) {
                    const userName = isUserPresent.name;
                    res.status(200).json({
                        type: "Success",
                        message: `WELCOME! ${userName} `
                    })
                } else {
                    // TO DO make this function DRY(Don't repeat youself)
                    const result = await twilio(phoneNumber)
                    if (result == 'pending') {
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
            }
            else {
                const result = await twilio(phoneNumber)
                if (result == 'pending') {
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
        } else {
            const result = await twilio(phoneNumber)
            if (result == 'pending') {
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
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: "Internal Server Error",
            message: "Their is some issue with the server"
        })
    }
}

/**
 * This funciton sends the otp with the number linked with that otp and verify it
 * @param {phoneNumber} req.body
 * @param {otp} req.body 
 */
exports.verify = async function (req, res) {
    try {
        const otp = req.body.otp;
        const phoneNumber = req.body.phoneNumber;
        const projection = { _id: 0, __v: 0 }
        const isUserPresent = await User.findOne({ "phoneNumber": phoneNumber }, projection);
        const result = await verify(phoneNumber, otp);
        if (result == "pending") {
            res.status(401).json({
                type: "Unauthorized",
                message: "OTP entered is in-correct",
            })
        }
        const token = jwt.sign({ id: phoneNumber }, "JWT_SECRET", { expiresIn: "12h" });
        const Token = new tokenModel({
            key: phoneNumber,
            token: token
        })
        // TO do redis implementation for managin token more efficiently
        const tokendb = await tokenModel.findOne({ "key": phoneNumber }, projection);
        if (tokendb) {
            await tokenModel.findOneAndUpdate({ "key": phoneNumber }, { $set: { "token": token } })
        } else {
            await tokenModel.save()
        }
        if (isUserPresent) {
            if (result == "approved") {
                const userName = isUserPresent.name;
                res.status(200).json({
                    type: "Success",
                    message: `WELCOME! ${userName} `
                })
            }
        } else {
            if (result == "approved") {
                res.status(404).json({
                    type: "Not Found",
                    message: "user is not registered. Please register it using api </user/reg>"
                })
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "Internal Server Error",
            message: "Their is some issue with the server"
        })
    }
}