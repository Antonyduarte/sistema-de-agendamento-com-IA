import "dotenv/config"
import jwt from "jsonwebtoken"
import * as apiRes from "../utils/response/apiRes.js"

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization

    if(!authHeader) {   //Verifica se o token foi enviado ao header
        return res.status(401).json(apiRes.apiResponse(
            false,
            "Token inválido"
        ))
    }
    // Bearer token aqui
    const parts = authHeader.split(" ")

    if(parts.length !== 2) {
        return res.status(401).json(apiRes.apiResponse(
            false,
            "Token inválido"
        ))
    }

    const [ scheme, token ] = parts

    if(scheme.toLowerCase() !== "bearer") {  // Verifica se começa com "Bearer"
        return res.status(401).json(apiRes.apiResponse(
            false,
            "Formato de token inválido"
        ))
    }

    try { // Verifica e decodifica o token
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        //salva os dados do usuario na requisição
        req.user = decoded

        next()

    } catch (error) {
        return res.status(401).json(apiRes.apiResponse(
            false,
            "Token inválido, ou expirado"
        ))
    }
}

export default authMiddleware
