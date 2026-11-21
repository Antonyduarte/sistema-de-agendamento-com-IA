import express from "express"
const router = express.Router()
import verify from "../../../utils/verify/verify.js"

import loginController from "../login/login.controller.js"
import registerController from "../register/register.controller.js"
import { recoveryCode as forgotPassController } from "../forgotpassword/forgotPass.controller.js"
import resetPasswordController from "../resetPassword/resetPassword.controller.js"
import refreshTokenController from "../refresh/refresh.controller.js"

router.post("/login", loginController) // endpoint de login 
router.post("/register", verify, registerController) // endpoint de registro
router.post("/forgot-password", forgotPassController) // endpoint de forgotpassword
router.put("/reset-password", resetPasswordController.setPassword)

// Não usa authMiddleware porque o access token pode já estar expirado.
router.post("/refresh", refreshTokenController.refreshAccessToken)
router.post("/logout", refreshTokenController.logout)

export default router
 
