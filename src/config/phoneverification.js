import "dotenv/config"; 
import moment from "moment"
import  db  from "./db.js";

async function generteotp() {
    const otp = Math.floor(1000 +Math.random() * 9000).toString(); 
    return otp
}
async function storeotp(phone, otp) {  


    const expiresAt = moment().add(30,'minute').format('YYY-MM-DD HH:mm:ss'); 
    return new Promise((resolve, reject)=>{ 
        db.run(
            `INSERT OR REPLACE INTO otps (phone_number,otp,expires_at)  
             VALUES (?,?,?)
            `,[phone,otp,expiresAt], 
            function(err){
                if(err) reject(err); 
                else resolve(err)
            }
        )
        
    });
    
}
export const sentotp =async(phone)=>{
   try {
       const otp = await generteotp(); 
         // Ensure phone number has country code and no special characters
    const formattedPhone = phone.replace(/\D/g, ''); // Remove all non-digit characters
    const countryCode = formattedPhone.length === 10 ? '91' : ''; // Add Indian country code if missing
    const fullPhoneNumber = `${countryCode}${formattedPhone}`;
       await storeotp(phone, otp); 
       const url = "https://7105.api.greenapi.com/waInstance7105217236/sendMessage/4049d5782e5d43aabc0876b2be5f9317786096be7d4e47e5b9";
       const payload = {
        "chatId": `${fullPhoneNumber}@c.us`,  // Added full phone number with country code
        "message": `Your OTP is: ${otp}.OTP valid for thirty mins.Do not Share your otp`
      };
      const headers = {
        'Content-Type': 'application/json'
      };
      const res = await fetch(url, {
        method:"POST", 
        headers:headers, 
        body:JSON.stringify(payload)
      })
      const response = await res.json() 
      
       console.log("Otp sent sucessfuly", response);
   } catch (error) {
      console.log(error)
   }
   
}
export const verifyOtp = async (phone, otp) => {
    return new Promise((resolve, reject) => {
        db.get(
          `SELECT otp, expires_at FROM otps  
           WHERE phone_number = ? AND expires_at > datetime('now')`,  // Fixed: Added missing closing parenthesis
          [phone], 
          (err, row) => {
            if (err) return reject(err);
            if (!row) {
                return resolve({ valid: false, message: "OTP expired or not found" });
            }  
            if (row.otp === otp) {
                db.run(`DELETE FROM otps WHERE phone_number = ?`, [phone]);
                return resolve({ valid: true, message: "OTP verification successful" });  // Fixed: Added missing resolve
            } else {
                return resolve({ valid: false, message: "Invalid OTP" });
            }
          }
        );
    });
};