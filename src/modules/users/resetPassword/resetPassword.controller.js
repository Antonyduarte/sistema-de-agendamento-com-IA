import resetService from "./resetPassword.service.js"
import * as apiRes from "../../../utils/response/apiRes.js"
import { MESSAGES } from "../../../messages/messages.js"

async function setPassword(req, res) {
    try {
        const { email, code, password } = req.body
        
        await resetService.resetPassword(email, code, password)

        return res.status(200).json(apiRes.apiResponse(
            true,
            MESSAGES.PASSWORD_ALTERED
        ))

    } catch (error) {
        if(error.message === MESSAGES.EMPTY_DATA_MSG ||
            error.message === MESSAGES.REGEX_MAIL ||
            error.message === MESSAGES.UNVAILABLE_CODE ||
            error.message === MESSAGES.USER_NOT_FOUND
        ) {
            return res.status(400).json(apiRes.apiResponse(
                false,
                error.message
            ))
        }
        return res.status(500).json(apiRes.apiResponse(
            false,
            MESSAGES.INTERNAL_ERROR_MSG
        ))
    }

}

export default { setPassword }
