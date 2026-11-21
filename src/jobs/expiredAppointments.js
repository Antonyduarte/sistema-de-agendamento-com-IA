import service from "../modules/agendamentos/agenda.service.js"

//Atualiza a cada minuto, os status dos agendamentos
async function expiredAppointments() {

    setInterval(async () => {
        await service.expireAppointments()
    }, 60000);
}

export { expiredAppointments }
