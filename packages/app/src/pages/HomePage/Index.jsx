import { Card, Row, Container, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faClipboard,
  faList,
  faFilePen,
  faBuilding,
  faUserPlus,
  faGraduationCap,
} from '@fortawesome/free-solid-svg-icons'
import Logo from '../../img/aprata.png'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../contexts/auth'

const roles = {
  Administrativo: ['Administrativo'],
  Professor: ['Professor', 'Administrativo'],
  Orientador: ['Orientador', 'Administrativo'],
}

const checkRoles = (user, accessRole) =>
  user.roles.findIndex((role) => accessRole.includes(role)) !== -1

export default function Home() {
  const { user } = useContext(AuthContext)

  return (
    <Container className="mt-3">
      <div className="d-flex justify-content-center align-center">
        <img src={Logo} alt="logo" className="img-fluid" />
      </div>

      <Row className="mt-3 justify-content-center align-center">
        {checkRoles(user, roles.Administrativo) && (
          <Col className="p-2 col-md-2 col-sm-6">
            <Link to="/cadastro/alunos">
              <Card className="bg-light">
                <Card.Body className="text-center">
                  <h5>Alunos</h5>
                  <FontAwesomeIcon icon={faGraduationCap} size="2x" />
                </Card.Body>
              </Card>
            </Link>
          </Col>
        )}
        {checkRoles(user, roles.Administrativo) && (
          <Col className="p-2 col-md-2 col-sm-6">
            <Link to="/matricula-aluno">
              <Card className="bg-light">
                <Card.Body className="text-center">
                  <h5>Matrículas</h5>
                  <FontAwesomeIcon icon={faFilePen} size="2x" />
                </Card.Body>
              </Card>
            </Link>
          </Col>
        )}
        {checkRoles(user, roles.Administrativo) && (
          <Col className="p-2 col-md-2 col-sm-6">
            <Link to="/vincular/alunos-empresas">
              <Card className="bg-light">
                <Card.Body className="text-center">
                  <h5>Empresas</h5>
                  <FontAwesomeIcon icon={faBuilding} size="2x" />
                </Card.Body>
              </Card>
            </Link>
          </Col>
        )}
        {checkRoles(user, roles.Orientador) && (
          <Col className="p-2 col-md-2 col-sm-6">
            <Link to="/relatorio-aprendiz">
              <Card className="bg-light">
                <Card.Body className="text-center">
                  <h5>Aprendiz</h5>
                  <FontAwesomeIcon icon={faClipboard} size="2x" />
                </Card.Body>
              </Card>
            </Link>
          </Col>
        )}
        {checkRoles(user, roles.Administrativo) && (
          <Col className="p-2 col-md-2 col-sm-6">
            <Link to="/inserir-alunos-turmas">
              <Card className="bg-light">
                <Card.Body className="text-center">
                  <h5>Turmas</h5>
                  <FontAwesomeIcon icon={faUserPlus} size="2x" />
                </Card.Body>
              </Card>
            </Link>
          </Col>
        )}
        {checkRoles(user, roles.Professor) && (
          <Col className="p-2 col-md-2 col-sm-6">
            <Link to="/frequencia">
              <Card className="bg-light">
                <Card.Body className="text-center">
                  <h5>Frequências</h5>
                  <FontAwesomeIcon icon={faList} size="2x" />
                </Card.Body>
              </Card>
            </Link>
          </Col>
        )}
      </Row>
    </Container>
  )
}
