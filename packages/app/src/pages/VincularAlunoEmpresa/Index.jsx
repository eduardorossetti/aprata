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

export default function TelaVincularAlunosEmpresas() {
  const [empresas, setEmpresas] = useState([])
  const [alunosNaoVinculados, setAlunosNaoVinculados] = useState([])
  const [filtro, setFiltro] = useState('')
  const [selectedAlunos, setSelectedAlunos] = useState([])
  const [selectedEmpresa, setSelectedEmpresa] = useState('')
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
      const allAlunoCodes = alunosNaoVinculados.map((aluno) => aluno.codigo)
      setSelectedAlunos(allAlunoCodes)
    }
    setSelectAll(!selectAll)
  }

  const getEmpresas = async () => {
    try {
      const res = await axios.get(urlBase + '/empresas')
      if (Array.isArray(res.data)) {
        setEmpresas(res.data)
      }
    } catch ({ response }) {
      toast.error(`Não foi possível obter empresas: ${response.data.message}`)
    }
  }

  const getAlunosNaoVinculados = async () => {
    try {
      const response = await axios.get(
        `${urlBase}/empresas/alunos/${selectedEmpresa}/nao-vinculados`,
      )
      if (Array.isArray(response.data)) {
        setAlunosNaoVinculados(response.data)
      }
    } catch (error) {
      toast.error('Não foi possível obter alunos não vinculados.')
    }
  }

  const handleSubmit = async () => {
    const dataVinculacao = new Date().toISOString().slice(0, 10)
    const vinculacoes = selectedAlunos.map((codigoAluno) => ({
      codigoAluno,
      dataVinculacao,
      status: true,
    }))
    await axios
      .post(`${urlBase}/empresas/alunos/${selectedEmpresa}`, { vinculacoes })
      .then(({ data }) => {
        toast.success(data.message)
        const alunosRestantes = alunosNaoVinculados.filter(
          (aluno) => !selectedAlunos.includes(aluno.codigo),
        )
        setAlunosNaoVinculados(alunosRestantes)
      })
      .catch((error) => {
        toast.error(error.message)
      })
    setShowModal(false)
  }

  const linhas = []

  useEffect(() => {
    getEmpresas()
  }, [])

  useEffect(() => {
    if (selectedEmpresa !== '') {
      getAlunosNaoVinculados()
    } else {
      setAlunosNaoVinculados([])
    }
    // eslint-disable-next-line
  }, [selectedEmpresa]);

  alunosNaoVinculados.forEach((aluno) => {
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

  return (
    <>
      <Cabecalho2 texto1={'Vinculação'} texto2={'Vincular Alunos à Empresa'} />
      <Container className="mt-3">
        <Row className="justify-content-between">
          <Col xs={12} md={6} lg={4} className="mb-3">
            <Form.Group controlId="selectEmpresa">
              <Form.Select
                as="select"
                value={selectedEmpresa}
                onChange={(e) => {
                  setSelectedEmpresa(e.target.value)
                  setSelectedAlunos([])
                }}
              >
                <option value="">Selecione uma empresa</option>
                {empresas.map((empresa) => (
                  <option key={empresa.codigo} value={empresa.codigo}>
                    {empresa.codigo}. {empresa.nome}
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
              <th>#</th>
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
              disabled={selectedAlunos.length === 0 || selectedEmpresa === ''}
            >
              Vincular Aluno(s)
            </Button>
          </Col>
        </Row>
      </Container>
      <CustomModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={handleSubmit}
        title="Confirmação"
        body="Confirma a vinculação do(s) aluno(s) à empresa?"
      />
    </>
  )
}
