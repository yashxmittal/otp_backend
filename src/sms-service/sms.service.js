// Download the helper library from https://www.twilio.com/docs/node/install
// Set environment variables for your credentials
// Read more at http://twil.io/secure
const accountSid = "AC59664a913c453f9dc6bc36b73a73b7d2";
const authToken = "e5e46a77ee6f18b8862818debe4599f6";
const verifySid = "VAb230cce068ab97d76865a4e90f71376c";
const client = require("twilio")(accountSid, authToken);



/** 
 *  This will call apis of Twilio and handle sending otp and verifying otp
 *  We are using status send by this after it verify the otp
*/



client.verify.v2
  .services(verifySid)
  .verifications.create({ to: "+918273623243", channel: "sms" })
  .then((verification) => console.log(verification.status))
  .then(() => {
    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    readline.question("Please enter the OTP:", (otpCode) => {
      client.verify.v2
        .services(verifySid)
        .verificationChecks.create({ to: "+918273623243", code: otpCode })
        .then((verification_check) => console.log(verification_check.status))
        .then(() => readline.close());
    });
  });