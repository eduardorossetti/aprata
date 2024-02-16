import React, { useState, useEffect } from 'react'
import {
  Table,
  Form,
  Button,
  InputGroup,
  Col,
  Row,
  Container,
} from 'react-bootstrap'
import Cabecalho2 from '../../components/HeaderBelow'
import { urlBase } from '../../utils/definitions'
import axios from '../../lib/api'
import { toast } from 'react-toastify'
import CustomModal from '../../components/Modal/Index'

export default function TelaInserirAlunosTurmas() {
  const [turmas, setTurmas] = useState([])
  const [alunosNaoInscritos, setAlunosNaoInscritos] = useState([])
  const [filtro, setFiltro] = useState('')
  const [selectedAlunos, setSelectedAlunos] = useState([])
  const [selectedTurma, setSelectedTurma] = useState('')
  const [selectAll, setSelectAll] = useState(false)
  const [showModal, setShowModal] = useState(false)

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
      const allAlunoCodes = alunosNaoInscritos.map((aluno) => aluno.codigo)
      setSelectedAlunos(allAlunoCodes)
    }
    setSelectAll(!selectAll)
  }

  const getTurmas = async () => {
    try {
      const res = await axios.get(urlBase + '/turmas')
      if (Array.isArray(res.data)) {
        setTurmas(res.data)
      }
    } catch ({ response }) {
      toast.error(`Não foi possível obter turmas: ${response.data.message}`)
    }
  }

  const getAlunosNaoInscritos = async () => {
    try {
      const res = await axios.get(
        urlBase + `/turmas/inscricoes/${selectedTurma}/nao-inscritos`,
      )
      if (Array.isArray(res.data)) {
        setAlunosNaoInscritos(res.data)
      }
    } catch ({ response }) {
      toast.error(`Não foi possível obter turmas: ${response.data.message}`)
    }
  }

  const linhas = []

  useEffect(() => {
    getTurmas()
  }, [])

  useEffect(() => {
    if (selectedTurma !== '') {
      getAlunosNaoInscritos()
    } else {
      setAlunosNaoInscritos([])
    }
    // eslint-disable-next-line
  }, [selectedTurma]);

  alunosNaoInscritos.forEach((aluno) => {
    if (aluno.nome.toLowerCase().indexOf(filtro.toLowerCase()) === -1) {
      return
    }
    linhas.push(
      <tr key={aluno.codigo} onClick={() => toggleSelectAluno(aluno.codigo)}>
        <td className="text-center">
          <Form.Check
            type="checkbox"
            checked={selectedAlunos.includes(aluno.codigo)}
            onChange={() => toggleSelectAluno(aluno.codigo)}
          />
        </td>
        <td className="text-center">{aluno.codigo}</td>
        <td>{aluno.nome}</td>
        <td>{aluno.cpf}</td>
        <td>{aluno.rg}</td>
        <td>{aluno.info.telefone}</td>
        <td>{aluno.info.email}</td>
        <td>{new Date(aluno.dataMatricula).toLocaleDateString('pt-BR')}</td>
      </tr>,
    )
  })

  const handleSubmit = async () => {
    const dataInscricao = new Date().toISOString().slice(0, 10)
    const inscricoes = selectedAlunos.map((codigoAluno) => ({
      codigoAluno,
      dataInscricao,
      status: true,
    }))
    await axios
      .post(`${urlBase}/turmas/inscricoes/${selectedTurma}`, { inscricoes })
      .then(({ data }) => {
        toast.success(data.message)
        const alunosRestantes = alunosNaoInscritos.filter(
          (aluno) => !selectedAlunos.includes(aluno.codigo),
        )
        setAlunosNaoInscritos(alunosRestantes)
      })
      .catch((error) => {
        toast.error(error.message)
      })
    setShowModal(false)
  }

  return (
    <>
      <Cabecalho2 texto1={'Inserção'} texto2={'Inserir Alunos'} />
      <Container className="mt-3">
        <Row className="justify-content-between">
          <Col xs={12} md={6} lg={4} className="mb-3">
            <Form.Group controlId="selectTurma">
              <Form.Select
                as="select"
                value={selectedTurma}
                onChange={(e) => {
                  setSelectedTurma(e.target.value)
                  setSelectedAlunos([])
                }}
              >
                <option value="">Selecione uma turma</option>
                {turmas.map((turma) => (
                  <option key={turma.codigo} value={turma.codigo}>
                    Turma {turma.codigo} / {turma.anoLetivo}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col xs={12} md={6} lg={4} className="mb-3">
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
        <Table bordered hover responsive="sm">
          <thead>
            <tr>
              <th className="text-center">
                <Form.Check
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                  title="Selecionar todos"
                />
              </th>
              <th className="text-center">#</th>
              <th>Nome</th>
              <th>CPF</th>
              <th>RG</th>
              <th>Telefone</th>
              <th>@email</th>
              <th>Matrícula</th>
            </tr>
          </thead>
          <tbody>{linhas}</tbody>
        </Table>
        <Row>
          <Col className="d-flex justify-content-end">
            <Button
              variant="primary"
              onClick={() => {
                setShowModal(true)
              }}
              disabled={selectedAlunos.length === 0 || selectedTurma === ''}
            >
              Inserir aluno(s)
            </Button>
          </Col>
        </Row>
      </Container>
      <CustomModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={handleSubmit}
        title="Confirmação"
        body="Confirma a inserção do(s) aluno(s)?"
      />
    </>
  )
}
