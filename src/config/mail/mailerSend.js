import "dotenv/config"
import transporter from "./mail.js"

async function sendCode(userMail, code) {
  return transporter.sendMail({
    from: process.env.MAIL_USER,
    to: userMail,
    subject: "Código de verificação",
    text: `Seu código de verificação para recuperar sua conta é ${code}`
  })
}
// const sendCode = transporter.sendMail({
//   from: process.env.MAIL_USER,
//   to: "antonyrafael3214@gmail.com",
//   subject: "Teste",
//   text: "Seu código de verificação é ${code}",
// });

export { sendCode }
