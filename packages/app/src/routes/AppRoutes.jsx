import { useContext } from 'react'
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom'

import {
  HomePage,
  Page404,
  PageAlunos,
  PageAlunosEmpresas,
  PageAlunosTurma,
  PageCargos,
  PageCursos,
  PageDesvincularAlunosEmpresas,
  PageDesvincularAlunosTurmas,
  PageEmpresas,
  PageFuncionarios,
  PageLancamentoFaltas,
  PageMatriculaAluno,
  PageOrientadoresEmpresas,
  PageRelatorioAlunosEmpresas,
  PageRelatorioAlunosTurmas,
  PageRelatorioAprendiz,
  PageRelatorioMatriculaAlunos,
  PageRelatorioNaoMatriculados,
  PageRelatorioOrientadoresEmpresas,
  PageConsultaFaltas,
  PageTurmas,
} from '../pages/Layout/Index'

import AuthProvider, { AuthContext } from '../contexts/auth'
import LoginPage from '../pages/LoginPage/Index'

const AppRoutes = () => {
  const Private = ({ children }) => {
    const { authenticated, loading } = useContext(AuthContext)

    if (loading) {
      return <div className="loading">Carregando...</div>
    }

    if (!authenticated) return <Navigate to="/login" />

    return children
  }

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route exact path="/login" element={<LoginPage />} />

          <Route
            exact
            path=""
            element={
              <Private>
                <HomePage />
              </Private>
            }
          />

          <Route
            exact
            path="/matricula-aluno"
            element={
              <Private>
                <PageMatriculaAluno />
              </Private>
            }
          />

          <Route
            exact
            path="/inserir-alunos-turmas"
            element={
              <Private>
                <PageAlunosTurma />
              </Private>
            }
          />

          <Route
            exact
            path="/relatorio-aprendiz"
            element={
              <Private>
                <PageRelatorioAprendiz />
              </Private>
            }
          />

          <Route path="/cadastro">
            <Route
              path="/cadastro/alunos"
              element={
                <Private>
                  <PageAlunos />
                </Private>
              }
            />
            <Route
              path="/cadastro/cargos"
              element={
                <Private>
                  <PageCargos />
                </Private>
              }
            />
            <Route
              path="/cadastro/cursos"
              element={
                <Private>
                  <PageCursos />
                </Private>
              }
            />
            <Route
              path="/cadastro/empresas"
              element={
                <Private>
                  <PageEmpresas />
                </Private>
              }
            />
            <Route
              path="/cadastro/funcionarios"
              element={
                <Private>
                  <PageFuncionarios />
                </Private>
              }
            />
            <Route
              path="/cadastro/turmas"
              element={
                <Private>
                  <PageTurmas />
                </Private>
              }
            />
          </Route>

          <Route path="/controle-frequencia">
            <Route
              path="/controle-frequencia/lancamento-faltas"
              element={
                <Private>
                  <PageLancamentoFaltas />
                </Private>
              }
            />
            <Route
              path="/controle-frequencia/consulta-faltas"
              element={
                <Private>
                  <PageConsultaFaltas />
                </Private>
              }
            />
          </Route>

          <Route path="/desvincular">
            <Route
              path="/desvincular/alunos-turmas"
              element={
                <Private>
                  <PageDesvincularAlunosTurmas />
                </Private>
              }
            />
            <Route
              path="/desvincular/alunos-empresas"
              element={
                <Private>
                  <PageDesvincularAlunosEmpresas />
                </Private>
              }
            />
          </Route>

          <Route path="/relatorios">
            <Route
              path="/relatorios/alunos-turmas"
              element={
                <Private>
                  <PageRelatorioAlunosTurmas />
                </Private>
              }
            />
            <Route
              path="/relatorios/alunos-empresas"
              element={
                <Private>
                  <PageRelatorioAlunosEmpresas />
                </Private>
              }
            />
            <Route
              path="/relatorios/orientadores-empresas"
              element={
                <Private>
                  <PageRelatorioOrientadoresEmpresas />
                </Private>
              }
            />
            <Route
              path="/relatorios/matriculas"
              element={
                <Private>
                  <PageRelatorioMatriculaAlunos />
                </Private>
              }
            />
            <Route
              path="/relatorios/nao-matriculados"
              element={
                <Private>
                  <PageRelatorioNaoMatriculados />
                </Private>
              }
            />
          </Route>

          <Route path="/vincular">
            <Route
              path="/vincular/alunos-empresas"
              element={
                <Private>
                  <PageAlunosEmpresas />
                </Private>
              }
            />
            <Route
              path="/vincular/orientadores-empresas"
              element={
                <Private>
                  <PageOrientadoresEmpresas />
                </Private>
              }
            />
          </Route>

          <Route path="*" element={<Page404 />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default AppRoutes
