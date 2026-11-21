import "dotenv/config"
import sql from "mysql2"
import pool from "../../../config/db/db.js"

const connection = pool

async function findByEmail(email) {
    const [rows] = await connection.query("SELECT * FROM clientes WHERE email = ?", [email])

    return rows[0] || null
}

async function userRegister(nome, email, senha) {

    const [result] = await connection.query("INSERT INTO clientes(nome, email, password) VALUES(?, ?, ?)", [nome, email, senha])

    return result[0] || null
}

export { findByEmail, userRegister }
