import "dotenv/config"
import * as loginRepo from "./login.repository.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { MESSAGES } from "../../../messages/messages.js"
import refreshService from "../refresh/refresh.service.js"

async function userLogin(email, senha) {

    // Impede que objetos sejam enviados ao repository e interpretados pelo
    // driver do MySQL como pares de coluna/valor.
    if (typeof email !== "string" || typeof senha !== "string") {
        throw new Error(MESSAGES.INVALID_LOGIN)
    }

    const user = await loginRepo.findByEmail(email)
    
    if (!user) {
        throw new Error(MESSAGES.USER_NOT_FOUND)
    }
    
    const user_id = user.id

    const passVerify = await bcrypt.compare(senha, user.password) // compara a senha enviada com a senha criptografada no banco

    if (!passVerify) {
        throw new Error(MESSAGES.INVALID_LOGIN)
    }

    // Access token curto, usado nas requisições normais da API.
    const accessToken = jwt.sign({
        id: user.id,
        name: user.nome,
        email: user.email,
        role: user.role
    }, process.env.SECRET_KEY, { expiresIn: "15m" })

    // Refresh token longo, registrado no banco para validação e revogação.
    const refreshToken = await refreshService.createRefreshToken(user_id)

    return {
        accessToken,
        refreshToken
    }
}

export default userLogin
