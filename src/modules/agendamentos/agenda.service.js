const agendaRepo = require("./agenda.repository")
const { MESSAGES } = require("../../messages/messages")

// Dois agendamentos, mesmo de usuarios diferentes, precisam ter este intervalo.
const intervalo = 35
const INICIO_EXPEDIENTE = "09:00:00"
const FIM_EXPEDIENTE = "18:00:00"

// POST agenda
async function agendar(user_id, compromisso, data, hora) {
    
    const horarioExiste = await agendaRepo.horarioVerify(
        data,
        hora,
        intervalo
    )

    // if(agendaRepo.agendar)
    
    if(horarioExiste) {
        throw new Error(MESSAGES.TIME_CONFLICT)
    }

    const create = await agendaRepo.agendar(user_id, compromisso, data, hora)

    return create
}

async function getHorariosDisponiveis(data) {
    return agendaRepo.getHorariosDisponiveis(
        data,
        intervalo,
        INICIO_EXPEDIENTE,
        FIM_EXPEDIENTE
    )
}
// GET agenda completa
async function getAgenda(user_id) {
    
    let agendamentos = await agendaRepo.getAgenda(user_id)

    
    return agendamentos

}

async function getAllAgenda() {
    return agendaRepo.getAllAgenda()
}
// DELETE AGENDA by id
async function deleteAgenda(id, user_id) {

    let agendaDelete = await agendaRepo.deleteAgenda(id, user_id)

    return agendaDelete

}

// PUT - UPDATE agendamento
async function editAgenda(data, hora, id, user_id) {
    const horarioExiste = await agendaRepo.horarioVerify(
        data,
        hora,
        intervalo,
        id
    )

    if (horarioExiste) {
        throw new Error(MESSAGES.TIME_CONFLICT)
    }

    let edit = await agendaRepo.editAgenda(data, hora, id, user_id)

    return edit
}

// ------- ADM endpoints -------

async function admDeleteAgenda(id){

    let deleteAgenda = await agendaRepo.admDeleteAgenda(id)

    return deleteAgenda

}

async function expireAppointments() {

    // await agendaRepo.findExpiredAppointments

    await agendaRepo.updateStatus()

    return true
}

module.exports = { 
    agendar, 
    getHorariosDisponiveis, 
    getAgenda, 
    getAllAgenda, 
    deleteAgenda, 
    editAgenda,
    admDeleteAgenda,
    expireAppointments
}
