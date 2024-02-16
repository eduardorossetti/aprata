import { Router } from 'express'
import TurmaCTRL from '../controllers/TurmaController.js'

const rotaTurma = new Router()
const turmaCtrl = new TurmaCTRL()

rotaTurma
  .get('/', turmaCtrl.consultar)
  .get('/:codigo', turmaCtrl.consultarTurma)
  .post('/', turmaCtrl.gravar)
  .put('/', turmaCtrl.atualizar)
  .delete('/:codigo', turmaCtrl.excluir)

rotaTurma
  .get('/inscricoes/:codigo', turmaCtrl.consultarInscricoes)
  .post('/inscricoes/:codigo', turmaCtrl.inscrever)
  .put('/inscricoes/:codigo', turmaCtrl.atualizarInscricoes)
  .delete('/inscricoes/:codigo', turmaCtrl.removerInscricoes)
  .get('/inscricoes/:codigo/nao-inscritos', turmaCtrl.consultarNaoInscritos)

rotaTurma
  .get('/frequencias/:codigo', turmaCtrl.consultarFrequencias)
  .post('/frequencias/:codigo', turmaCtrl.gravarFrequencias)
  .put('/frequencias/:codigo', turmaCtrl.atualizarFrequencias)

rotaTurma.get('/cursos/:codigo', turmaCtrl.consultarCursos)
rotaTurma
  .get('/faltas/:codigo', turmaCtrl.consultarFaltas)
  .delete('/faltas/:codigo', turmaCtrl.removerFrequencias)

export default rotaTurma
