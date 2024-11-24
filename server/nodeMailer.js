import sgMail from "@sendgrid/mail";

async function sendEmail(address, code) {
  //console.log(process.env.SENDGRID_API_KEY2);
  //await sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  // console.log("address:");
  // console.log(address);
  const msg = {
    to: address, // Change to your recipient
    from: "yarintz33@gmail.com", // Change to your verified sender
    subject: "code to bank",
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
