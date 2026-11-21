import { apiResponse } from "../utils/response/apiRes.js"

function adminMiddleware(req, res, next) {
    if (req.user?.role !== "admin") {
        return res.status(403).json(apiResponse(
            false,
            "Acesso permitido apenas para administradores"
        ))
    }

    next()
}

export default adminMiddleware
