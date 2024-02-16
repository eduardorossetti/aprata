import { Router } from 'express'
import FuncionarioCTRL from '../controllers/FuncionarioController.js'

const rotaFuncionario = new Router()
const funcionarioCtrl = new FuncionarioCTRL()

rotaFuncionario
  .post('/', funcionarioCtrl.gravar)
  .put('/', funcionarioCtrl.atualizar)
  .delete('/:codigo', funcionarioCtrl.excluir)
  .get('/', funcionarioCtrl.consultar)
  .get('/professores', funcionarioCtrl.consultarProfessores)
  .get('/orientadores', funcionarioCtrl.consultarOrientadores)

export default rotaFuncionario
