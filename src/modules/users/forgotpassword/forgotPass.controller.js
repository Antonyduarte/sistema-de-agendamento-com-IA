import { MESSAGES } from "../../../messages/messages.js"
import { apiResponse } from "../../../utils/response/apiRes.js"
import { EMAIL_REGEX } from "../../../utils/regex/regex.js"
import * as forgotService from "./forgotPass.service.js"

async function recoveryCode(req, res) {

    try{
        const { email } = req.body
        if (!email) {
            return res.status(400).json(apiResponse(
                false,
                MESSAGES.EMPTY_DATA_MSG
            ))
        }
        await forgotService.recoveryCode(email)

        return res.status(200).json(apiResponse(
            true,
            MESSAGES.FORGOT_MESSAGE
        ))

        
    } catch (error) {
        return res.status(500).json(apiResponse(
            false,
            MESSAGES.INTERNAL_ERROR_MSG
        ))
    }
}
   
export { recoveryCode }
