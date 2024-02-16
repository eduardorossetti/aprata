import express from 'express'
import rotaEmpresa from './src/routes/EmpresaRoutes.js'
import rotaCurso from './src/routes/CursoRoutes.js'
import rotaFuncionario from './src/routes/FuncionarioRoutes.js'
import rotaCargo from './src/routes/CargoRoutes.js'
import rotaAluno from './src/routes/AlunoRoutes.js'
import rotaTurma from './src/routes/TurmaRoutes.js'
import rotaAuth from './src/routes/AuthRoutes.js'
import authMiddleware from './src/middleware/AuthMiddleware.js'
import accessLevel from './src/middleware/AccessLevel.js'
import { roles } from './roles.js'

const routes = express()
routes.use('/auth', rotaAuth)
routes.use('*', authMiddleware)
routes.use('/cursos', accessLevel(roles.Orientador), rotaCurso)
routes.use('/empresas', accessLevel(roles.Orientador), rotaEmpresa)
routes.use('/funcionarios', rotaFuncionario)
routes.use('/cargos', accessLevel(roles.Orientador), rotaCargo)
routes.use('/alunos', accessLevel(roles.Orientador), rotaAluno)
routes.use('/turmas', accessLevel(roles.Orientador), rotaTurma)

export default routes
