const MESSAGES = {
    // ERROS DE AGENDAMENTO
    TIME_CONFLICT: "TIME_CONFLICT",
    INVALID_DATA: "Data ou horário inválidos",
    INVALID_TIME: "Horário inválido",
    NO_APPOINTMENTS: "NO_APPOINTMENTS",
    INTERVAL_ERROR: "Erro ao agendar",
    UNVAILABLE_DATA: "Horário indisponível, mantenha pelo menos 35 minutos entre agendamentos",
    EDIT_DATA_TRUE: "Horário alterado com sucesso",
    EDIT_DATA_FALSE: "Ocorreu um erro, seu horário não foi alterado",
    DATA_NOT_FOUND: "Agendamento não encontrado",
    FOUND_REGISTER_FALSE: "Nenhum registro encontrado",
    
    //ERROS DE LOGIN/REGISTER/AUTH
    USER_NOT_FOUND: "USER_NOT_FOUND",
    INVALID_LOGIN: "INVALID_LOGIN",
    REGEX_MAIL: "Formato inválido de e-mail",
    SENHA_LENGTH: "Sua senha deve conter no mínimo 8 dígitos",

    //INTERNAL SERVER ERROR
    INTERNAL_ERROR: "INTERNAL_ERROR",
    INTERNAL_ERROR_MSG: "Ocorreu um erro interno, tente novamente mais tarde",

    //EMPTY DATA
    EMPTY_DATA_MSG: "Certifique-se de preencher todos os campos",
    // FORGOT PASSWORD MESSAGE
    FORGOT_MESSAGE: "Se este e-mail estiver cadastrado, enviaremos um código de segurança para o mesmo",
    //RESET PASSWORD
    UNVAILABLE_CODE: "Código expirado ou inválido",
    PASSWORD_ALTERED: "Senha alterada com sucesso",
    //MENSAGENS DE AGENDAMENTO
    DELETED_DATA: "Deletado com sucesso",
    //REFRESH TOKEN 201 GERADO COM SUCESSO
    REFRESH_TOKEN_TRUE: "Tokens renovados com sucesso",
    INVALID_REFRESH_TOKEN: "Refresh token inválido",
    EXPIRED_REFRESH_TOKEN: "Refresh token expirado"
}

module.exports = { MESSAGES }
