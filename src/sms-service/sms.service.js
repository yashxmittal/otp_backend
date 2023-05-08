// Download the helper library from https://www.twilio.com/docs/node/install
// Set environment variables for your credentials
// Read more at http://twil.io/secure
// /**
//  * NEVER STORE BELOW DETAILS HARDCODED 
//  * its a bad practice w.r.t security
//  *          //TO DO //
//  * make a backend global_config and store sensitive info there
//  */
const accountSid = "AC59664a913c453f9dc6bc36b73a73b7d2";
const authToken = "e43f9abeb7ba89ce0e7c94627b2c85e7";
const verifySid = "VAb230cce068ab97d76865a4e90f71376c";
const client = require("twilio")(accountSid, authToken);

var verificationStatus;


// PRE-written code from twilio for receiving otp verification

// this function is used to send phoneNumber as request and receive otp on you number
// Paid service, it has only limited free otp
exports.twilio = async (phoneNumber) => {
   await client.verify.v2
    .services(verifySid)
    .verifications.create({ to: `+91${phoneNumber}`, channel: "sms" })
    .then(async (verification) => {
      verificationStatus = await verification.status;
    })
    return await verificationStatus;
  }

  // this function take received otp and send status such as verified or not
exports.verify = async (phoneNumber, otpCode) => {
   try{
    await client.verify.v2
    .services(verifySid)
    .verificationChecks.create({ to: `+91${phoneNumber}`, code: otpCode })
    .then(async (verification_check) => {
      verificationStatus = await verification_check.status;
     })
     return await verificationStatus;
    }catch(err){
      console.log(error)
    }
  }