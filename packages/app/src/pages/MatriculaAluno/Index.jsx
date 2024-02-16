import React, { useState, useEffect } from 'react'
import {
  Table,
  Form,
  Button,
  InputGroup,
  Col,
  Row,
  Alert,
  Container,
} from 'react-bootstrap'
import Cabecalho2 from '../../components/HeaderBelow'
import { urlBase } from '../../utils/definitions'
import axios from '../../lib/api'
import { toast } from 'react-toastify'
import CustomModal from '../../components/Modal/Index'

export default function TelaMatriculaAlunos() {
  const [alunos, setAlunos] = useState([])
  const [filtro, setFiltro] = useState('')
  const [selectedAlunos, setSelectedAlunos] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [showMatriculaModal, setShowMatriculaModal] = useState(false)

  const toggleSelectAluno = (codigo) => {
    const updatedSelectedAlunos = [...selectedAlunos]
    if (updatedSelectedAlunos.includes(codigo)) {
      updatedSelectedAlunos.splice(updatedSelectedAlunos.indexOf(codigo), 1)
    } else {
      updatedSelectedAlunos.push(codigo)
    }
    setSelectedAlunos(updatedSelectedAlunos)
  }

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedAlunos([])
    } else {
      const allAlunoCodes = alunos.map((aluno) => aluno.codigo)
      setSelectedAlunos(allAlunoCodes)
    }
    setSelectAll(!selectAll)
  }

  const handleMatricularAluno = async () => {
    try {
      const response = await axios.put(`${urlBase}/alunos/matricula`, {
        codigo: selectedAlunos,
      })
      if (response.data.status) {
        toast.success('Aluno(s) matriculado(s) com sucesso!')

        const alunosRestantes = alunos.filter(
          (aluno) => !selectedAlunos.includes(aluno.codigo),
        )
        setAlunos(alunosRestantes)
      } else {
        toast.error('Falha ao matricular aluno(s)!')
      }
    } catch (error) {
      toast.error('Erro ao matricular aluno(s)!')
    } finally {
      setShowMatriculaModal(false)
    }
  }

  const linhas = []

  useEffect(() => {
    const getAlunosNaoMatriculados = async () => {
      try {
        const res = await axios.get(
          `${urlBase}/alunos/matricula/nao-matriculados`,
        )
        if (Array.isArray(res.data)) {
          setAlunos(res.data)
        }
      } catch ({ response }) {
        toast.error(`Não foi possível obter alunos: ${response.data.message}`)
      }
    }
    getAlunosNaoMatriculados()
  }, [])

  alunos.forEach((aluno, i) => {
    if (aluno.nome.toLowerCase().indexOf(filtro.toLowerCase()) === -1) {
      return
    }
    linhas.push(
      <tr key={i}>
        <td>
          <Form.Check
            type="checkbox"
            checked={selectedAlunos.includes(aluno.codigo)}
            onChange={() => toggleSelectAluno(aluno.codigo)}
          />
        </td>
        <td>{aluno.codigo}</td>
        <td>{aluno.nome}</td>
        <td>{aluno.cpf}</td>
        <td>{aluno.rg}</td>
        <td>{aluno.info.telefone}</td>
        <td>{aluno.info.email}</td>
        <td>{new Date(aluno.dataNascimento).toLocaleDateString('pt-BR')}</td>
      </tr>,
    )
  })

  return (
    <>
      <Cabecalho2 texto1={'Matrícula'} texto2={'Matrícula de Alunos'} />
      <Container className="mt-3">
        <Row className="mb-3">
          <Col xs={12} md={6} className="offset-md-6">
            <Form>
              <InputGroup>
                <Form.Control
                  type="text"
                  value={filtro}
                  placeholder="Pesquisar por nome..."
                  onChange={(e) => setFiltro(e.target.value)}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setFiltro('')}
                >
                  Limpar
                </Button>
              </InputGroup>
            </Form>
          </Col>
        </Row>
        <Table hover responsive="sm">
          <thead>
            <tr>
              <th>
                <Form.Check
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>#</th>
              <th>Nome</th>
              <th>CPF</th>
              <th>RG</th>
              <th>Telefone</th>
              <th>@email</th>
              <th>Nascimento</th>
            </tr>
          </thead>
          <tbody>{linhas}</tbody>
        </Table>
        <div className="text-center mt-3">
          <Alert variant="info">
            Certifique-se de que os documentos <b>Termo de Compromisso</b> e{' '}
            <b>Composição Familiar</b> foram entregues antes de confirmar a
            matrícula do aluno!
          </Alert>
        </div>
        <Row>
          <Col className="d-flex justify-content-end">
            <Button
              variant="primary"
              onClick={() => setShowMatriculaModal(true)}
              disabled={selectedAlunos.length === 0}
            >
              Matricular
            </Button>
          </Col>
        </Row>
      </Container>
      <CustomModal
        show={showMatriculaModal}
        onHide={() => setShowMatriculaModal(false)}
        onConfirm={handleMatricularAluno}
        title="Confirmação"
        body="Confirma a matrícula do(s) aluno(s)?"
      />
    </>
  )
}
