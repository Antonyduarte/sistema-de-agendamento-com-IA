import refreshService from "./refresh.service.js"
import * as apiRes from "../../../utils/response/apiRes.js"
import { MESSAGES } from "../../../messages/messages.js"

// Esta rota não usa authMiddleware: ela precisa funcionar quando o access
// token já expirou. A autenticação desta operação é o próprio refresh token.
async function refreshAccessToken(req, res) {
    try {
        const { refreshToken } = req.body

        // Apenas strings devem chegar ao service 
        // objetos podem ser transformados pelo mysql em pares "coluna = valor"
        if (typeof refreshToken !== "string" || refreshToken.length === 0) {
            return res.status(400).json(apiRes.apiResponse(
                false,
                "Refresh token é obrigatório"
            ))
        }

        const tokens = await refreshService.refreshAccessToken(refreshToken)

        return res.status(200).json(apiRes.apiResponse(
            true,
            MESSAGES.REFRESH_TOKEN_TRUE,
            tokens
        ))
    } catch (error) {
        if (
            error.message === MESSAGES.INVALID_REFRESH_TOKEN ||
            error.message === MESSAGES.EXPIRED_REFRESH_TOKEN
        ) {
            return res.status(401).json(apiRes.apiResponse(false, error.message))
        }
        console.error(error)
        return res.status(500).json(apiRes.apiResponse(
            false,
            MESSAGES.INTERNAL_ERROR_MSG
        ))
    }
}

// Revoga o refresh token atual e encerra a sessão no servidor.
async function logout(req, res) {
    try {
        const { refreshToken } = req.body || {}

        if (typeof refreshToken !== "string" || refreshToken.length === 0) {
            return res.status(400).json(apiRes.apiResponse(
                false,
                "Refresh token é obrigatório"
            ))
        }

        await refreshService.revokeRefreshToken(refreshToken)

        return res.status(200).json(apiRes.apiResponse(
            true,
            "Logout realizado com sucesso"
        ))
    
    } catch (error) {
        console.error(error)
        return res.status(500).json(apiRes.apiResponse(
            false,
            MESSAGES.INTERNAL_ERROR_MSG
        ))
    }
}

export default {
    refreshAccessToken,
    logout
}
