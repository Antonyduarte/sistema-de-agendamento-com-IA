function apiResponse(success, message, data = null) {
    return {
        success: success,
        message: message,
        data: data,
        timestamp: new Date().toISOString()
    }
}

// Função em desuso 
// function userResponse(success, message){
//     return{
//         success: success,
//         message: message
//     }
// }

module.exports = { apiResponse }
