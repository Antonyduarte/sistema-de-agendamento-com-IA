import express from "express"
import { apiResponse } from "../utils/response/apiRes.js"
const router = express.Router()

function pageNotFound(req, res, next) {
    return res.status(404).json(apiResponse(
        false,
        "Rota não encontrada"
    ))
}

export default pageNotFound
