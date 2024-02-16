import { Router } from 'express'
import AuthCtrl from '../controllers/AuthController.js'

const rotaAuth = new Router()
const auth = new AuthCtrl()

rotaAuth.post('/', auth.autenticar).get('/access_token', auth.access_token)

export default rotaAuth
