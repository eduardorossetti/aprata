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
import { ExcelButton, PrintButton } from '../../components/Buttons/Index'

export default function TelaRelatorioAlunosTurmas() {
  const [turmas, setTurmas] = useState([])
  const [alunosInscritos, setAlunosInscritos] = useState([])
  const [filtro, setFiltro] = useState('')
  const [selectedTurma, setSelectedTurma] = useState('')

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
        urlBase + `/turmas/inscricoes/${selectedTurma}`,
      )
      if (Array.isArray(res.data)) {
        setAlunosInscritos(res.data)
      }
    } catch ({ response }) {
      toast.error(`Não foi possível obter alunos: ${response.data.message}`)
    }
  }

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

  const linhas = []

  alunosInscritos.forEach((alunoInscrito) => {
    if (
      alunoInscrito.aluno.nome.toLowerCase().indexOf(filtro.toLowerCase()) ===
      -1
    ) {
      return
    }
    linhas.push(
      <tr key={alunoInscrito.codigo}>
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
      <Cabecalho2 texto1={'Relatório'} texto2={'Alunos / Turma'} />
      <Container className="mt-3">
        <Row className="justify-content-between">
          <Col xs={12} md={6} lg={4} className="mb-3">
            <Form.Group controlId="selectTurma">
              <Form.Select
                as="select"
                value={selectedTurma}
                onChange={(e) => {
                  setSelectedTurma(e.target.value)
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
          <Col xs={12} md={6} lg={4} className="mb-3" id="acoes">
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
        <Table bordered hover responsive="sm" id="tabelaAlunosTurmas">
          <thead>
            <tr>
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
        <Row id="acoes">
          <Col className="d-flex justify-content-end">
            <PrintButton />
            <ExcelButton
              onClick={() => toast.success('Relatório xlsx gerado!')}
              tableId="tabelaAlunosTurmas"
              fileName="relatorioAlunosTurmas"
            />
          </Col>
        </Row>
      </Container>
    </>
  )
}
