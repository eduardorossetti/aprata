import { useContext } from 'react'
import { AuthContext } from '../contexts/auth'
import Menu from './Menu'
import { Container, Row, Col, Dropdown } from 'react-bootstrap'

export default function Cabecalho1() {
  const { logout, user } = useContext(AuthContext)

  const handleLogout = () => {
    logout()
  }

  return (
    <Container
      fluid
      className="text-white"
      style={{ backgroundColor: '#00adee' }}
      id="cabecalho"
    >
      <Row className="d-flex justify-content-between align-items-center flex-nowrap">
        <Col xs="auto">
          <Menu />
        </Col>
        <Col xs="6" md="auto" className="fw-bold">
          SGi | APRATA
        </Col>
        <Col xs="auto">
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {user?.username}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleLogout}>Sair</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
    </Container>
  )
}
