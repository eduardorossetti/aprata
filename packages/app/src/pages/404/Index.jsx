import { Button, Container } from 'react-bootstrap'
import error from '../../img/error.jpg'
import { Link } from 'react-router-dom'

function Pagina404() {
  return (
    <Container className="text-center">
      <img
        src={error}
        alt="Erro 404"
        style={{ width: '25rem', height: 'auto' }}
      />
      <h1 style={{ color: 'grey' }}>Página Não Encontrada</h1>
      <h2 style={{ color: 'grey' }}>
        A página que você está procurando não pôde ser encontrada
      </h2>
      <Button className="mt-4">
        <Link to="/">Voltar a página inicial</Link>
      </Button>
    </Container>
  )
}

export default Pagina404
