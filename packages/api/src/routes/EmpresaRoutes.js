import { Router } from 'express'
import EmpresaCTRL from '../controllers/EmpresaController.js'

const rotaEmpresa = new Router()
const empresaCtrl = new EmpresaCTRL()

rotaEmpresa
  .post('/', empresaCtrl.gravar)
  .put('/', empresaCtrl.atualizar)
  .delete('/:codigo', empresaCtrl.excluir)
  .get('/', empresaCtrl.consultar)

rotaEmpresa
  .get('/alunos/:codigo', empresaCtrl.consultarAlunos)
  .post('/alunos/:codigo', empresaCtrl.vincularAlunos)
  .put('/alunos/:codigo', empresaCtrl.atualizarAlunos)
  .delete('/alunos/:codigo', empresaCtrl.removerAlunos)
  .get(
    '/alunos/:codigo/nao-vinculados',
    empresaCtrl.consultarAlunosNaoVinculados,
  )

rotaEmpresa
  .get('/orientadores/:codigo', empresaCtrl.consultarOrientadoresVinculados)
  .post('/orientadores/:codigo', empresaCtrl.vincularOrientadores)
  .put('/orientadores/:codigo', empresaCtrl.atualizarOrientadores)
  .delete('/orientadores/:codigo', empresaCtrl.removerOrientadores)
  .get(
    '/orientadores/:codigo/nao-vinculados',
    empresaCtrl.consultarOrientadoresNaoVinculados,
  )

export default rotaEmpresa
