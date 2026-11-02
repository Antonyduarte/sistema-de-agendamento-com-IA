require("dotenv").config()
const express = require("express")
const cors = require("cors")
const { apiResponse } = require("./utils/response/apiRes")

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
const authRoutes = require("./modules/users/auth/auth.routes")
app.use("/auth", authRoutes)

//Rotas de agendamentos/agenda
const agendaRoutes = require("./modules/agendamentos/agenda.routes")
app.use("/agendamento", agendaRoutes)


const notFound = require("./middlewares/notFound.middleware")
app.use(notFound)

module.exports = app
