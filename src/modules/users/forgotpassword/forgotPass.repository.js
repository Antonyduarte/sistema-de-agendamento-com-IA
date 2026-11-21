import mysql from "mysql2"
import pool from "../../../config/db/db.js"

const connection = pool

async function userEmail(email) {

    const [rows] = await connection.query("SELECT id FROM clientes WHERE email = ?", [email])
    if (rows.length === 0) {
        return null
    }

    return rows[0]
}

async function recoveryCode(user_id, code_hash) {
    await connection.query(
        "UPDATE recovery_codes SET used = TRUE, used_at = NOW() WHERE user_id = ? AND used = FALSE",
        [user_id]
    )

    const [result] = await connection.query(
        "INSERT INTO recovery_codes (user_id, code_hash, expires_at) VALUES(?, ?, DATE_ADD(NOW(), INTERVAL 15 MINUTE))",
        [user_id, code_hash]
    )

    return result
}

export { recoveryCode, userEmail }
