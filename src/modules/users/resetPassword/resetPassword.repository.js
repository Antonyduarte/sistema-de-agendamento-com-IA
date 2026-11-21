import mysql from "mysql2"
import pool from "../../../config/db/db.js"

async function findByEmail(email){
    
    const [result] = await pool.query("SELECT * FROM clientes WHERE email = ?", [email])

    return result[0]
}
async function recentlyCode(user_id) {

    const [rows] = await pool.query("SELECT * FROM recovery_codes WHERE user_id = ? AND expires_at > NOW() AND used = FALSE ORDER BY id DESC LIMIT 1", [user_id])

    const recoveryCode = rows[0]

    return recoveryCode
}

async function setPasswordAndConsumeCode(newPassword, userId, recoveryCodeId) {
    const connection = await pool.getConnection()

    try {
        await connection.beginTransaction()

        const [consumeResult] = await connection.query(
            "UPDATE recovery_codes SET used = TRUE, used_at = NOW() WHERE id = ? AND user_id = ? AND used = FALSE",
            [recoveryCodeId, userId]
        )

        if (consumeResult.affectedRows !== 1) {
            await connection.rollback()
            
            return false
        }

        await connection.query("UPDATE clientes SET password = ? WHERE id = ?", [newPassword, userId])

        await connection.commit()

        return true
        
    } catch (error) {

        await connection.rollback()

        throw error

    } finally {

        connection.release()

    }
}

export { findByEmail, recentlyCode, setPasswordAndConsumeCode }
