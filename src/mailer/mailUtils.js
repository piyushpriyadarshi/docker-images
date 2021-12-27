import Mailer from "./Mailer.js";
export async function sendAlertMail(subject, htmlString ) {
    return new Promise((resolve,reject)=>{
        const mailOptions = {
            from: "awsomecoders@gmail.com",
            to: "priyadarship4@gmail.com",
            subject: subject,
            html: htmlString,
          };
        
          const transporter=Mailer.getInstance();
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              reject(err);
            } else {
                resolve("Email sent: " + info.response)
            }
          });
    });
}
