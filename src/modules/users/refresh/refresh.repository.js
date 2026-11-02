const pool = require("../../../config/db/db")

const connection = pool

async function getRefreshTokens() {
    const [rows] = await connection.query("SELECT * FROM refresh_tokens")

    return rows
}

// Busca o usuário relacionado ao refresh token para gerar um novo JWT.
async function getUserById(user_id) {
    const [rows] = await connection.query(
        "SELECT id, nome, email, role FROM clientes WHERE id = ?",
        [user_id]
    )

    return rows[0]
}
async function saveRefreshToken(user_id, token, expires_at) {
    
    const [result] = await connection.query("INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES(?, ?, ?)", [user_id, token, expires_at])

    return result
}
async function deleteRefreshToken(token) {
    if (typeof token !== "string") {
        throw new TypeError("Refresh token deve ser uma string")
    }

    const [rows] = await connection.query("DELETE FROM refresh_tokens WHERE token = ?", [token])

    return rows
}

async function deleteRefreshTokenById(id) {
    const [result] = await connection.query(
        "DELETE FROM refresh_tokens WHERE id = ?",
        [id]
    )

    return result
}

module.exports = {
    getRefreshTokens,
    getUserById,
    saveRefreshToken,
    deleteRefreshToken,
    deleteRefreshTokenById
}
