import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import './styles/footer.css'

function Rodape() {
  return (
    <footer className="rodape fw-light py-3" id="rodape">
      <Container>
        <Row>
          <Col xs={12} className="text-center">
            © 2023 APACHESYS - Todos os direitos reservados
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Rodape
