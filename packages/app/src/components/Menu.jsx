import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Offcanvas from 'react-bootstrap/Offcanvas'
import { Link } from 'react-router-dom'
import { GiHamburgerMenu } from 'react-icons/gi'
import './styles/menu.css'
import { useContext } from 'react'
import { AuthContext } from '../contexts/auth'

const roles = {
  Administrativo: ['Administrativo'],
  Professor: ['Professor', 'Administrativo'],
  Orientador: ['Orientador', 'Administrativo'],
}

const checkRoles = (user, accessRole) =>
  user.roles.findIndex((role) => accessRole.includes(role)) !== -1

export default function Menu() {
  const { user } = useContext(AuthContext)
  return (
    <>
      <Navbar className="custom-navbar" expand={false}>
        <Container>
          <Navbar.Toggle aria-controls="offcanvasNavbar">
            <GiHamburgerMenu color="white" size={25} />
          </Navbar.Toggle>
          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="start"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel">Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="flex-column">
                <Nav.Link as={Link} to="/">
                  Home
                </Nav.Link>
                {checkRoles(user, roles.Administrativo) && (
                  <NavDropdown title="Cadastros">
                    <NavDropdown.Item as={Link} to="/cadastro/alunos">
                      Alunos
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/cadastro/cargos">
                      Cargos
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/cadastro/cursos">
                      Cursos
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/cadastro/empresas">
                      Empresas
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/cadastro/funcionarios">
                      Funcionários
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/cadastro/turmas">
                      Turmas
                    </NavDropdown.Item>
                  </NavDropdown>
                )}
                {checkRoles(user, roles.Administrativo) && (
                  <NavDropdown title="Relatórios">
                    <NavDropdown.Item
                      as={Link}
                      to="/relatorios/alunos-empresas"
                    >
                      Vínculo - Alunos e Empresas
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/relatorios/alunos-turmas">
                      Vínculo - Alunos e Turmas
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      as={Link}
                      to="/relatorios/orientadores-empresas"
                    >
                      Vínculo - Orientadores e Empresas
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/relatorios/matriculas">
                      Alunos Matriculados
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      as={Link}
                      to="/relatorios/nao-matriculados"
                    >
                      Alunos Não Matriculados
                    </NavDropdown.Item>
                  </NavDropdown>
                )}
                {checkRoles(user, roles.Administrativo) && (
                  <NavDropdown title="Vinculações">
                    <NavDropdown.Item as={Link} to="/vincular/alunos-empresas">
                      Alunos / Empresas
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/vincular/orientadores-empresas"
                    >
                      Orientadores / Empresas
                    </NavDropdown.Item>
                  </NavDropdown>
                )}

                {checkRoles(user, roles.Administrativo) && (
                  <NavDropdown title="Desvinculações">
                    <NavDropdown.Item as={Link} to="/desvincular/alunos-turmas">
                      Alunos / Turmas
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/desvincular/alunos-empresas"
                    >
                      Alunos / Empresas
                    </NavDropdown.Item>
                  </NavDropdown>
                )}
                {checkRoles(user, roles.Professor) && (
                  <NavDropdown title="Controle de Frequência">
                    <NavDropdown.Item
                      as={Link}
                      to="/controle-frequencia/lancamento-faltas"
                    >
                      Lançamento
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      as={Link}
                      to="/controle-frequencia/consulta-faltas"
                    >
                      Consulta
                    </NavDropdown.Item>
                  </NavDropdown>
                )}

                {checkRoles(user, roles.Administrativo) && (
                  <Nav.Link as={Link} to="/matricula-aluno">
                    Matrícula do Aluno
                  </Nav.Link>
                )}
                {checkRoles(user, roles.Administrativo) && (
                  <Nav.Link as={Link} to="/inserir-alunos-turmas">
                    Inserir Alunos às Turmas
                  </Nav.Link>
                )}

                {checkRoles(user, roles.Orientador) && (
                  <Nav.Link as={Link} to="/relatorio-aprendiz">
                    Relatório do Aprendiz
                  </Nav.Link>
                )}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  )
}
