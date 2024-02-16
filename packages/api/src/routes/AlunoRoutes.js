import { Router } from 'express'
import AlunoCTRL from '../controllers/AlunoController.js'

const rotaAluno = new Router()
const alunoCtrl = new AlunoCTRL()

rotaAluno
  .post('/', alunoCtrl.gravar)
  .put('/', alunoCtrl.atualizar)
  .delete('/:codigo', alunoCtrl.excluir)
  .get('/', alunoCtrl.consultar)

rotaAluno
  .get('/matricula/nao-matriculados', alunoCtrl.consultarNaoMatriculados)
  .put('/matricula', alunoCtrl.matricular)
  .get('/matricula', alunoCtrl.consultarMatriculados)

rotaAluno
  .get('/relatorio', alunoCtrl.consultarRelatorios)
  .post('/relatorio/:codigo', alunoCtrl.gravarRelatorio)
  .put('/relatorio/:codigo', alunoCtrl.atualizarRelatorio)
  .delete('/relatorio/:codigo', alunoCtrl.excluirRelatorio)

export default rotaAluno
