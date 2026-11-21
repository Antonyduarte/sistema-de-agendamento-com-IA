import * as registerRepo from "./register.respository.js"
import bcrypt from "bcrypt"
import * as responses from "../../../utils/response/apiRes.js"
import { MESSAGES } from "../../../messages/messages.js"

async function userRegister(nome, email, senha) {

    let emailExists = await registerRepo.findByEmail(email)
    if (emailExists) {
        throw new Error("EMAIL_ALREADY_EXISTS")
    }

    let saltRounds = 10
    const hashedPass = await bcrypt.hash(senha, saltRounds)

    const user = await registerRepo.userRegister(nome, email, hashedPass)

    return responses.apiResponse(true, "Conta registrada com sucesso")
}

export default userRegister
