import sgMail from "@sendgrid/mail";

//sgMail.setApiKey(process.env.SENDGRID_API_KEY);
console.log("SENDGRID KEY:");
console.log(process.env.SENDGRID_API_KEY);
function sendEmail(address, code) {
  console.log("address:");
  console.log(address);
  const msg = {
    to: address, // Change to your recipient
    from: "yarintz33@gmail.com", // Change to your verified sender
    subject: "code to bank",
    // text: "your code: " + code,
    html: "<strong> your code: " + code + " </strong>",
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
}
export default sendEmail;
