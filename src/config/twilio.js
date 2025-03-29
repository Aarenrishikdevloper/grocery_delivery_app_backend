import "dotenv/config"; 
import twilio from "twilio";
const accountSid = process.env.TWILIO_ACCOUBT_SID; 

const authToken  = process.env.TWILIO_AUTH_TOKEN; 
 
const client  = twilio(accountSid, authToken,{lazyLoading:true});  
export const sentotp =async(phone)=>{
    try {
        await client.verify.v2?.services(process.env.TWILIO_SERVER_SID).verifications.create({
            channel:"sms",
            to:phone
        })
        console.log("Verification code sent");
    } catch (error) {
        console.log(error);
    }
}
export const verifyOtp =async(phone,otp)=>{
    try {
      const verify =  await client.verify.v2?.services(process.env.TWILIO_SERVER_SID).verificationChecks.create({
            to:phone, 
            code:otp
        })

        if(verify){
            console.log("Verification true");
            return true;
        }else{
            return false;
        }
    } catch (error) {
        console.log(error); 
        return false;
    }
}