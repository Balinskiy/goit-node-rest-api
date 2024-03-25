import "dotenv/config";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const message = {
  to: "3879342@gmail.com",
  from: "3879342@gmail.com", // Use the email address or domain you verified above
  subject: "Sending with Twilio SendGrid is Fun",
  text: "and easy to do anywhere, even with Node.js",
  html: "<strong>and easy to do anywhere, even with Node.js</strong>",
};

sgMail
  .send(message)
  .then(() => {
    console.log("Email sent successfully");
  })
  .catch((error) => {
    console.error("Error sending email:", error);
  });
