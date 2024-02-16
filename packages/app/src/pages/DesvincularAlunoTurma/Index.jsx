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

export default function TelaDesvincularAlunosTurmas() {
  const [turmas, setTurmas] = useState([])
  const [alunosInscritos, setAlunosInscritos] = useState([])
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
      const allAlunoCodes = alunosInscritos.map((aluno) => aluno.codigo)
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

  const getAlunosInscritos = async () => {
    try {
      const res = await axios.get(
        `${urlBase}/turmas/inscricoes/${selectedTurma}`,
      )
      if (Array.isArray(res.data)) {
        setAlunosInscritos(res.data)
      }
    } catch ({ response }) {
      toast.error(`Não foi possível obter turmas: ${response.data.message}`)
    }
  }

  const handleDelete = async () => {
    try {
      const data = {
        inscricoes: selectedAlunos.map((codigo) => ({
          codigoInscricao: codigo,
        })),
      }
      const response = await axios.delete(
        `${urlBase}/turmas/inscricoes/${selectedTurma}`,
        { data },
      )
      if (response.status === 200) {
        const updatedAlunosInscritos = alunosInscritos.filter(
          (aluno) => !selectedAlunos.includes(aluno.codigo),
        )
        setAlunosInscritos(updatedAlunosInscritos)
        setSelectedAlunos([])
        toast.success('Inscrições removidas com sucesso!')
      } else {
        toast.error('Erro ao remover inscrições')
      }
    } catch (error) {
      toast.error('Ocorreu um erro ao tentar remover as inscrições')
      console.error('Erro ao remover inscrições:', error)
    }
    setShowModal(false)
  }

  const linhas = []

  useEffect(() => {
    getTurmas()
  }, [])

  useEffect(() => {
    if (selectedTurma !== '') {
      getAlunosInscritos()
    } else {
      setAlunosInscritos([])
    }
    // eslint-disable-next-line
  }, [selectedTurma]);

  alunosInscritos.forEach((alunoInscrito) => {
    if (
      alunoInscrito.aluno.nome.toLowerCase().indexOf(filtro.toLowerCase()) ===
      -1
    ) {
      return
    }
    linhas.push(
      <tr
        key={alunoInscrito.codigo}
        onClick={() => toggleSelectAluno(alunoInscrito.codigo)}
      >
        <td className="text-center">
          <Form.Check
            type="checkbox"
            checked={selectedAlunos.includes(alunoInscrito.codigo)}
            onChange={() => toggleSelectAluno(alunoInscrito.codigo)}
          />
        </td>
        <td className="text-center">{alunoInscrito.aluno.codigo}</td>
        <td>{alunoInscrito.aluno.nome}</td>
        <td>{alunoInscrito.aluno.cpf}</td>
        <td>{alunoInscrito.aluno.rg}</td>
        <td>{alunoInscrito.aluno.info.telefone}</td>
        <td>{alunoInscrito.aluno.info.email}</td>
        <td>
          {new Date(alunoInscrito.aluno.dataMatricula).toLocaleDateString(
            'pt-BR',
          )}
        </td>
      </tr>,
    )
  })

  return (
    <>
      <Cabecalho2
        texto1={'Desvinculação'}
        texto2={'Desvincular Alunos às Turmas'}
      />
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
              variant="danger"
              onClick={() => {
                setShowModal(true)
              }}
              disabled={selectedAlunos.length === 0 || selectedTurma === ''}
            >
              Desvincular aluno(s)
            </Button>
          </Col>
        </Row>
      </Container>
      <CustomModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={handleDelete}
        title="Confirmação"
        body="Confirma a desvinculação do(s) aluno(s)?"
      />
    </>
  )
}
