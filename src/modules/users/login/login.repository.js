import mysql from "mysql2"
import pool from "../../../config/db/db.js"

const connection = pool

async function findByEmail(email) {
    if (typeof email !== "string") {
        throw new TypeError("Email deve ser uma string")
    }

    const [result] = await connection.query("SELECT * FROM clientes WHERE email = ?", [email])

    return result[0]
}

async function login(email) {

    const [result] = await connection.query("SELECT * FROM clientes WHERE email = ?", [email])

    return result[0] || null
}

export { findByEmail, login }
