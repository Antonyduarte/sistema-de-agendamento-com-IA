import mysql from "mysql2"
import pool from "../../config/db/db.js"
import { MESSAGES } from "../../messages/messages.js"

const connection = pool

// POST - AGENDAR HORARIO

async function agendar(user_id, compromisso, data, hora) {

    let [result] = await connection.query("INSERT INTO agendamentos (user_id, compromisso, data, hora) SELECT ?, ?, ?, ? WHERE TIMESTAMP (?, ?) > NOW()", [user_id, compromisso, data, hora, data, hora])

    if (result.affectedRows === 0) {
        throw Error(MESSAGES.INVALID_DATA)
    }

    return result
}

async function horarioVerify(data, hora, intervaloMinutos, agendamentoId = null) {
    const parametros = [
        data,
        hora,
        intervaloMinutos,
        intervaloMinutos,
        data,
        hora
    ]

    let query = `
        SELECT id
        FROM agendamentos
        WHERE TIMESTAMP(data, hora) < DATE_ADD(TIMESTAMP(?, ?), INTERVAL ? MINUTE)
          AND DATE_ADD(TIMESTAMP(data, hora), INTERVAL ? MINUTE) > TIMESTAMP(?, ?)
    `

    // Na edicao, o proprio agendamento nao deve ser considerado conflito
    if (agendamentoId) {
        query += " AND id <> ?"
        parametros.push(agendamentoId)
    }

    query += " LIMIT 1"

    let [result] = await connection.query(query, parametros)

    return result[0] || null
}

// GET - VER AGENDAMENTOS

async function getAgenda(user_id) {
    let [result] = await connection.query("SELECT user_id, id, compromisso, data, hora FROM agendamentos WHERE user_id = ?", [user_id])

    return result
}

async function getAllAgenda() {
    const [result] = await connection.query(`
        SELECT
            agendamentos.id,
            agendamentos.compromisso,
            agendamentos.data,
            agendamentos.hora,
            clientes.id AS user_id,
            clientes.nome AS cliente_nome,
            clientes.email AS cliente_email
        FROM agendamentos
        INNER JOIN clientes ON clientes.id = agendamentos.user_id
        ORDER BY agendamentos.data ASC, agendamentos.hora ASC
    `)

    return result
}

// DELETE - CANCELAR AGENDAMENTO By id

async function deleteAgenda(id, user_id) {
    let [result] = await connection.query("DELETE FROM agendamentos WHERE id = ? AND user_id = ?", [id, user_id])

    return result
}

// PUT - EDITAR AGENDAMENTO

async function editAgenda(data, hora, id, user_id) {

    let [result] = await connection.query(`UPDATE agendamentos
     SET data = ?, hora = ?
     WHERE id = ?
     AND user_id = ?
     AND TIMESTAMP(CONCAT(?, ' ', ?)) > NOW()`, [data, hora, id, user_id, data, hora])

    if (result.affectedRows === 0) {
        throw Error(MESSAGES.INVALID_DATA)
    }

    return result
}

// GET - lista slots livres sem expor os agendamentos existentes
async function getHorariosDisponiveis(data, intervaloMinutos, inicioExpediente, fimExpediente) {
    const query = `
        WITH RECURSIVE horarios AS (
            SELECT CAST(CONCAT(?, ' ', ?) AS DATETIME) AS horario

            UNION ALL

            SELECT DATE_ADD(horario, INTERVAL ? MINUTE)
            FROM horarios
            WHERE DATE_ADD(horario, INTERVAL ? MINUTE)
                  <= CAST(CONCAT(?, ' ', ?) AS DATETIME)
        )
        SELECT TIME_FORMAT(h.horario, '%H:%i') AS horario
        FROM horarios h
        WHERE NOT EXISTS (
            SELECT 1
            FROM agendamentos a
            WHERE TIMESTAMP(a.data, a.hora) < DATE_ADD(h.horario, INTERVAL ? MINUTE)
              AND DATE_ADD(TIMESTAMP(a.data, a.hora), INTERVAL ? MINUTE) > h.horario
        )
        ORDER BY h.horario
    `

    const parametros = [
        data,
        inicioExpediente,
        intervaloMinutos,
        intervaloMinutos * 2,
        data,
        fimExpediente,
        intervaloMinutos,
        intervaloMinutos
    ]

    const [result] = await connection.query(query, parametros)

    return result
}


// ------------- ADMIN ENDPOINTS ----------

//CANCELAR AGENDAMENTO
async function admDeleteAgenda(id) {

    const [rows] = await connection.query("DELETE FROM agendamentos WHERE id = ?", [id])

    return rows

}

async function findExpiredAppointments() {

    const [result] = await connection.query("SELECT *, DATE_ADD(CONCAT(data, ' ', hora), INTERVAL 35 MINUTE) AS horario_expiracao FROM agendamentos WHERE DATE_ADD(CONCAT(data, ' ', hora), INTERVAL 35 MINUTE) < NOW()")

    return result

}
async function updateStatus() {

    const [rows] = await connection.query("UPDATE agendamentos SET status = 'EXPIRED' WHERE DATE_ADD(CONCAT(data, ' ', hora), INTERVAL 35 MINUTE) < NOW() AND status IN ('PENDING', 'CONFIRMED')")

    return rows

}

export default {
    agendar,
    horarioVerify,
    getAgenda,
    getAllAgenda,
    deleteAgenda,
    editAgenda,
    getHorariosDisponiveis,
    admDeleteAgenda,
    findExpiredAppointments,
    updateStatus,
}
