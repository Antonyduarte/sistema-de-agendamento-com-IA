import "dotenv/config"
import express from "express"
import cors from "cors"
import { apiResponse } from "./utils/response/apiRes.js"

const app = express()

app.use(express.json())
app.use(cors({
    origin: process.env.CORS_ROUTE
}))
app.use(express.static("public"))

app.use((req, res, next) => {
    if (req.app.locals.systemAvailable === false) {
        return res.status(503).json(apiResponse(
            false,
            "Servidor está offline"
        ))
    }  

    next()
})

// Rotas de autenticação
import authRoutes from "./modules/users/auth/auth.routes.js"
app.use("/auth", authRoutes)

//Rotas de agendamentos/agenda
import agendaRoutes from "./modules/agendamentos/agenda.routes.js"
app.use("/agendamento", agendaRoutes)


import notFound from "./middlewares/notFound.middleware.js"
app.use(notFound)

export default app
