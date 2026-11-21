import * as forgotRepo from "./forgotPass.repository.js"
import { randomInt } from "crypto"
import { MESSAGES } from "../../../messages/messages.js"
import * as mailer from "../../../config/mail/mailerSend.js"
import { EMAIL_REGEX } from "../../../utils/regex/regex.js"
import bcrypt from "bcrypt"

// function generateCode()

async function recoveryCode(email) {
  
  if (!email) {
    throw Error(MESSAGES.EMPTY_DATA_MSG)
  }

  if (!EMAIL_REGEX.test(email)) {
    throw Error(MESSAGES.REGEX_MAIL)
  }

  const user = await forgotRepo.userEmail(email)

  if (!user) {
    return null
  }
  // Gera o código !! LEMBRETE ==== HASHEAR CÓDIGO DEPOOIS

  const code = randomInt(100000, 1000000)
  const hashedCode = await bcrypt.hash(String(code), 10)

  // Salva o código e usuário no banco
  await forgotRepo.recoveryCode(user.id, hashedCode)

  await mailer.sendCode(email, code)

  return true
}

export { recoveryCode }
