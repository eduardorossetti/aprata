import { Router } from 'express'
import CursoCTRL from '../controllers/CursoController.js'

const rotaCurso = new Router()
const cursoCtrl = new CursoCTRL()

rotaCurso
  .post('/', cursoCtrl.gravar)
  .put('/', cursoCtrl.atualizar)
  .delete('/:codigo', cursoCtrl.excluir)
  .get('/', cursoCtrl.consultar)

export default rotaCurso
