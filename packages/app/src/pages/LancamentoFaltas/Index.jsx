import React, { useEffect, useState } from 'react'
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Table,
} from 'react-bootstrap'
import { toast } from 'react-toastify'
import Cabecalho2 from '../../components/HeaderBelow'
import CustomModal from '../../components/Modal/Index'
import axios from '../../lib/api'
import { urlBase } from '../../utils/definitions'

export default function TelaLancamentoFaltas() {
  const [turmas, setTurmas] = useState([])
  const [alunos, setAlunos] = useState([])
  const [cursos, setCursos] = useState([])
  const [filtro, setFiltro] = useState('')
  const [selectedAlunos, setSelectedAlunos] = useState([])
  const [selectedTurma, setSelectedTurma] = useState('')
  const [selectedCurso, setSelectedCurso] = useState('')
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10),
  )
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
      const allAlunoCodes = alunos.map((registros) => registros.aluno.codigo)
      setSelectedAlunos(allAlunoCodes)
    }
    setSelectAll(!selectAll) // Alternar o estado de selectAll
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

  const getAlunos = async () => {
    try {
      const res = await axios.get(
        urlBase + `/turmas/inscricoes/${selectedTurma}`,
      )
      if (Array.isArray(res.data)) {
        setAlunos(res.data)
      }
    } catch ({ response }) {
      toast.error(`Não foi possível obter alunos: ${response.data.message}`)
    }
  }

  const getCursos = async () => {
    try {
      const res = await axios.get(urlBase + `/turmas/cursos/${selectedTurma}`)
      if (Array.isArray(res.data)) {
        setCursos(res.data)
      }
    } catch ({ response }) {
      toast.error(`Não foi possível obter cursos: ${response.data.message}`)
    }
  }

  const linhas = []

  useEffect(() => {
    getTurmas()
  }, [])

  useEffect(() => {
    if (selectedTurma !== '') {
      getCursos()
      setSelectedCurso('') // Resetar a seleção do curso
    } else {
      setCursos([])
    }
    setAlunos([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTurma])

  useEffect(() => {
    if (selectedTurma !== '' && selectedCurso !== '') {
      getAlunos()
    } else {
      setAlunos([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCurso, selectedTurma])

  alunos.forEach((inscritos) => {
    if (
      inscritos.aluno.nome.toLowerCase().indexOf(filtro.toLowerCase()) === -1
    ) {
      return
    }
    linhas.push(
      <tr
        key={inscritos.aluno.codigo}
        onClick={() => toggleSelectAluno(inscritos.aluno.codigo)}
      >
        <td className="text-center">
          <Form.Check
            type="checkbox"
            checked={selectedAlunos.includes(inscritos.aluno.codigo)}
            onChange={() => toggleSelectAluno(inscritos.aluno.codigo)}
          />
        </td>
        <td className="text-center">{inscritos.aluno.codigo}</td>
        <td>{inscritos.aluno.cpf}</td>
        <td>{inscritos.aluno.nome}</td>
        <td>{inscritos.aluno.rg}</td>
        <td>{inscritos.aluno.info.telefone}</td>
      </tr>,
    )
  })

  const handleSubmit = async () => {
    const dataFalta = selectedDate
    const curso = selectedCurso
    const frequencias = selectedAlunos.map((codigoAluno) => ({
      codigoAluno,
      dataFalta,
      curso,
    }))
    await axios
      .post(`${urlBase}/turmas/frequencias/${selectedTurma}`, { frequencias })
      .then(({ data }) => {
        toast.success(data.message)
        const alunosRestantes = alunos.filter(
          (aluno) => !selectedAlunos.includes(aluno.codigo),
        )
        setAlunos(alunosRestantes)
      })
      .catch((error) => {
        toast.error(error.message)
      })
    setShowModal(false)
  }

  return (
    <>
      <Cabecalho2
        texto1={'Controle de Frequência'}
        texto2={'Lançamento de Faltas'}
      />
      <Container className="mt-3">
        <Row className="justify-content-between">
          <Col md={3} className="mb-3">
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
          <Col md={3} className="mb-3">
            <Form.Group controlId="selectCurso">
              <Form.Select
                as="select"
                value={selectedCurso}
                onChange={(e) => {
                  setSelectedCurso(e.target.value)
                  setSelectedAlunos([])
                }}
              >
                <option value="">Selecione um curso</option>
                {cursos.map((curso) => (
                  <option key={curso.codigo} value={curso.codigo}>
                    {curso.nome}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={2} className="mb-3">
            <Form.Group controlId="selectDate">
              <Form.Control
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4} className="mb-3">
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
            </tr>
          </thead>
          <tbody>{linhas}</tbody>
        </Table>
        <Row>
          <Col className="d-flex justify-content-end">
            <Button
              variant="danger"
              onClick={() => {
                setShowModal(true)
              }}
              disabled={
                selectedAlunos.length === 0 ||
                selectedTurma === '' ||
                selectedCurso === ''
              }
            >
              Confirmar falta(s)
            </Button>
          </Col>
        </Row>
      </Container>
      <CustomModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={handleSubmit}
        title="Confirmação"
        body="Confirma o lançamento de falta do(s) aluno(s)?"
      />
    </>
  )
}
