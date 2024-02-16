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
import { ExcelButton, PrintButton } from '../../components/Buttons/Index'
import { formatDate } from '../../utils/format'

export default function TelaConsultaFaltas() {
  const [turmas, setTurmas] = useState([])
  const [registrosFalta, setRegistrosFaltas] = useState([])
  const [filtro, setFiltro] = useState('')
  const [selectedFaltas, setSelectedFaltas] = useState([])
  const [selectedTurmas, setSelectedTurmas] = useState('')
  const [selectAll, setSelectAll] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const toggleSelectRegistros = (codigoFalta) => {
    const updatedSelectedRegistros = [...selectedFaltas]
    if (updatedSelectedRegistros.includes(codigoFalta)) {
      updatedSelectedRegistros.splice(
        updatedSelectedRegistros.indexOf(codigoFalta),
        1,
      )
    } else {
      updatedSelectedRegistros.push(codigoFalta)
    }
    setSelectedFaltas(updatedSelectedRegistros)
  }

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedFaltas([])
    } else {
      const allFaltasCodes = registrosFalta.map((falta) => falta.codigo)
      setSelectedFaltas(allFaltasCodes)
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

  const getRegistroFaltas = async () => {
    if (!selectedTurmas) {
      setRegistrosFaltas([])
      return
    }
    try {
      const res = await axios.get(`${urlBase}/turmas/faltas/${selectedTurmas}`)
      if (Array.isArray(res.data)) {
        setRegistrosFaltas(res.data)
      }
    } catch ({ response }) {
      toast.error(
        `Não foi possível obter registro de faltas: ${response.data.message}`,
      )
    }
  }

  const handleDelete = async () => {
    try {
      const data = {
        faltas: selectedFaltas.map((codigoFalta) => ({
          codigo: codigoFalta,
        })),
      }
      const response = await axios.delete(
        `${urlBase}/turmas/faltas/${selectedTurmas}`,
        {
          data,
        },
      )
      if (response.status === 200) {
        const updatedRegistroFaltas = registrosFalta.filter(
          (falta) => !selectedFaltas.includes(falta.codigo),
        )
        setRegistrosFaltas(updatedRegistroFaltas)
        setSelectedFaltas([])
        toast.success('Registros de faltas removidas com sucesso!')
      } else {
        toast.error('Erro ao remover registros de faltas')
      }
    } catch (error) {
      toast.error('Ocorreu um erro ao tentar remover as faltas')
      console.error('Erro ao remover faltas:', error)
    }
    setShowModal(false)
  }

  const linhas = []

  useEffect(() => {
    getTurmas()
  }, [])

  useEffect(() => {
    if (selectedTurmas !== '') {
      getRegistroFaltas()
    } else {
      setRegistrosFaltas([])
    }
    // eslint-disable-next-line
  }, [selectedTurmas]);

  registrosFalta.forEach((falta) => {
    if (falta.aluno.nome.toLowerCase().indexOf(filtro.toLowerCase()) === -1) {
      return
    }
    linhas.push(
      <tr
        key={falta.codigo}
        onClick={() => toggleSelectRegistros(falta.codigo)}
      >
        <td className="text-center" id="acoes">
          <Form.Check
            type="checkbox"
            checked={selectedFaltas.includes(falta.codigo)}
            onChange={() => toggleSelectRegistros(falta.codigo)}
          />
        </td>
        <td>{falta.aluno.nome}</td>
        <td>{falta.aluno.cpf}</td>
        <td>{falta.aluno.rg}</td>
        <td>{falta.curso}</td>
        <td>{formatDate(falta.dataFalta)}</td>
      </tr>,
    )
  })

  return (
    <>
      <Cabecalho2
        texto1={'Controle de Frequência'}
        texto2={'Consulta e Remoção de Faltas'}
      />
      <Container className="mt-3">
        <Row className="justify-content-between" id="topo">
          <Col xs={12} md={6} lg={4} className="mb-3">
            <Form.Group controlId="selectTurma">
              <Form.Select
                as="select"
                value={selectedTurmas}
                onChange={(e) => {
                  setSelectedTurmas(e.target.value)
                  setSelectedFaltas([])
                  setRegistrosFaltas([])
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
                  placeholder="Pesquisar por aluno..."
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
        <Table bordered hover responsive="sm" id="tabelaFaltas">
          <thead>
            <tr>
              <th className="text-center" id="acoes">
                <Form.Check
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                  title="Selecionar todos"
                />
              </th>
              <th>Nome</th>
              <th>CPF</th>
              <th>RG</th>
              <th>Curso</th>
              <th>Data da Falta</th>
            </tr>
          </thead>
          <tbody>{linhas}</tbody>
        </Table>
        <Row id="acoes">
          <Col className="d-flex justify-content-start">
            <PrintButton />
            <ExcelButton
              onClick={() => toast.success('Relatório xlsx gerado!')}
              tableId="tabelaFaltas"
              fileName="relatorioFaltas"
            />
          </Col>
          <Col className="d-flex justify-content-end">
            <Button
              variant="danger"
              onClick={() => {
                setShowModal(true)
              }}
              disabled={selectedFaltas.length === 0 || selectedTurmas === ''}
            >
              Remover Falta(s)
            </Button>
          </Col>
        </Row>
      </Container>
      <CustomModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={handleDelete}
        title="Confirmação"
        body="Confirma a remoção da falta do aluno?"
      />
    </>
  )
}
