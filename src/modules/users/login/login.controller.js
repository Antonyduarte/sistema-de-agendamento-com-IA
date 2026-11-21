import loginService from "./login.service.js"
import * as apiRes from "../../../utils/response/apiRes.js"
import { MESSAGES } from "../../../messages/messages.js"

async function login(req, res) {
    try {
        const { email, senha } = req.body

        if (
            typeof email !== "string" ||
            typeof senha !== "string" ||
            email.length === 0 ||
            senha.length === 0
        ) {
            return res.status(400).json(apiRes.apiResponse(
                false,
                "Email e senha são obrigatórios"
            ))
        }

        const result = await loginService(email, senha)

        return res.status(200).json(apiRes.apiResponse(
            true,
            "Seja Bem-Vindo(a) !",
            result
        ))
    } catch (error) {
        if (error.message === MESSAGES.USER_NOT_FOUND) {
            return res.status(401).json(apiRes.apiResponse(
                false,
                "Usuário não encontrado"
            ))
        }
        if (error.message === MESSAGES.INVALID_LOGIN) {
            return res.status(401).json(apiRes.apiResponse(
                false,
                "Login inválido" // erro atual
            ))
        } else {
            return res.status(500).json(apiRes.apiResponse(
                false,
                MESSAGES.INTERNAL_ERROR_MSG
            ))
        }
    }
}

export default login
