import "dotenv/config"
import app from "./app.js"
import "./jobs/expiredAppointments.js"

const PORT = process.env.SERVER_PORT || 3000

console.log("Starting server...")
app.listen(PORT, () => {
    console.log(`Server running in port: ${PORT}`)
})

job.expiredAppointments()
