const { REFERAL_CODES } = require('../config/config');
const tokenModel = require('../models/token.model');
const user = require('../models/user.model');

/**
 * this function register the user
 * @param {req.body.phoneNumber} req 
 * @param {req.body.name} req
 * @param {req.body.email} req
 * @param {req.body.dateOfBirth} req 
 */
exports.userRegister = async (req, res) => {
    try {
        let User = new user({
            phoneNumber: req.body.phoneNumber,
            name: req.body.name,
            email: req.body.email,
            dateOfBirth: req.body.dateOfBirth
        });
        const projection = { _id: 0, __v: 0 }
        const isUserPresent = await user.findOne({ "phoneNumber": req.body.phoneNumber }, projection);
        if (req.body.phoneNumber == isUserPresent?.phoneNumber) {
            res.status(409).json({
                status: "Duplicate Record",
                message: `${req.body.phoneNumber} is already registered`
            });
        } else {
            await User.save();
            res.status(201).json({
                data: {
                    phoneNumber: req.body.phoneNumber,
                    name: req.body.name,
                    email: req.body.email,
                    dateOfBirth: req.body.dateOfBirth
                }, details: {
                    status: "User Successfully Registered",
                    message: "To proceed hit api </user/referal> for referal code validation"
                }
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "Internal Server Error",
            message: "Their is some issue with the server"
        })
    }
}
/**
 * This funciton verify the entered referal code
 * @param {body.referalCode} req 
 * @param {*} res 
 */
exports.validateReferal = async (req, res) => {
    try {
        const referalCode = req.body.referalCode;
        const referals = REFERAL_CODES.split(" ");
        const a = referals.some((item) => {
            if (item == referalCode) {
                return true
            }
            return false
        })
        if (a) {
            res.status(200).json({
                status: "Success",
                message: "Entered referal code is correct"
            })
        } else {
            res.status(406).json({
                status: "Not Acceptable",
                message: "Invalid Referal Code"
            })
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
 * This funciton delete the token for respective user on behalf of it we logged him out
 * @param {body.req.phoneNumber} req 
 * @param {*} res 
 */
exports.logout = async (req, res) => {
    const phoneNumber = req.body.phoneNumber;
    try {
        await tokenModel.deleteOne({ "key": phoneNumber });
        res.status(200).json({
            status: "Successfully loggedOut",
            message: "User is logged out"
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: "Internal Server Error",
            message: "Their is some issue with the server"
        })
    }
}