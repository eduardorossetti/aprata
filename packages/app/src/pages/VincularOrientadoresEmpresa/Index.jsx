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

export default function TelaVincularOrientadoresEmpresas() {
  const [empresas, setEmpresas] = useState([])
  const [orientadoresNaoVinculados, setOrientadoresNaoVinculados] = useState([])
  const [filtro, setFiltro] = useState('')
  const [selectedFuncionarios, setSelectedFuncionarios] = useState([])
  const [selectedEmpresa, setSelectedEmpresa] = useState('')
  const [selectAll, setSelectAll] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const toggleSelectFuncionarios = (codigo) => {
    const updatedSelectedFuncionarios = [...selectedFuncionarios]
    if (updatedSelectedFuncionarios.includes(codigo)) {
      updatedSelectedFuncionarios.splice(
        updatedSelectedFuncionarios.indexOf(codigo),
        1,
      )
    } else {
      updatedSelectedFuncionarios.push(codigo)
    }
    setSelectedFuncionarios(updatedSelectedFuncionarios)
  }

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedFuncionarios([])
    } else {
      const allFuncionariosCodes = orientadoresNaoVinculados.map(
        (funcionario) => funcionario.codigo,
      )
      setSelectedFuncionarios(allFuncionariosCodes)
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

  const getFuncionariosNaoVinculados = async () => {
    try {
      const response = await axios.get(
        `${urlBase}/empresas/orientadores/${selectedEmpresa}/nao-vinculados`,
      )
      if (Array.isArray(response.data)) {
        setOrientadoresNaoVinculados(response.data)
      }
    } catch (error) {
      toast.error('Não foi possível obter orientadores não vinculados.')
    }
  }

  const handleSubmit = async () => {
    const dataVinculacao = new Date().toISOString().slice(0, 10)
    const vinculacoes = selectedFuncionarios.map((codigoFuncionario) => ({
      codigoFuncionario,
      dataVinculacao,
      status: true,
    }))
    await axios
      .post(`${urlBase}/empresas/orientadores/${selectedEmpresa}`, {
        vinculacoes,
      })
      .then(({ data }) => {
        toast.success(data.message)
        const funcionariosRestantes = orientadoresNaoVinculados.filter(
          (funcionario) => !selectedFuncionarios.includes(funcionario.codigo),
        )
        setOrientadoresNaoVinculados(funcionariosRestantes)
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
      getFuncionariosNaoVinculados()
    } else {
      setOrientadoresNaoVinculados([])
    }
    // eslint-disable-next-line
  }, [selectedEmpresa]);

  orientadoresNaoVinculados.forEach((funcionario) => {
    if (funcionario.nome.toLowerCase().indexOf(filtro.toLowerCase()) === -1) {
      return
    }
    linhas.push(
      <tr
        key={funcionario.codigo}
        onClick={() => toggleSelectFuncionarios(funcionario.codigo)}
      >
        <td className="text-center">
          <Form.Check
            type="checkbox"
            checked={selectedFuncionarios.includes(funcionario.codigo)}
            onChange={() => toggleSelectFuncionarios(funcionario.codigo)}
          />
        </td>
        <td className="text-center">{funcionario.codigo}</td>
        <td>{funcionario.nome}</td>
        <td>{funcionario.cpf}</td>
        <td>{funcionario.info.telefone}</td>
        <td>{funcionario.info.email}</td>
        <td>{funcionario.nomeUsuario}</td>
      </tr>,
    )
  })

  return (
    <>
      <Cabecalho2
        texto1={'Vinculação'}
        texto2={'Vincular Orientadores à Empresa'}
      />
      <Container className="mt-3">
        <Row className="justify-content-between">
          <Col xs={12} md={6} lg={4} className="mb-3">
            <Form.Group controlId="selectEmpresa">
              <Form.Select
                as="select"
                value={selectedEmpresa}
                onChange={(e) => {
                  setSelectedEmpresa(e.target.value)
                  setSelectedFuncionarios([])
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
              <th>Telefone</th>
              <th>@email</th>
              <th>Usuário</th>
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
              disabled={
                selectedFuncionarios.length === 0 || selectedEmpresa === ''
              }
            >
              Vincular Orientador(es)
            </Button>
          </Col>
        </Row>
      </Container>
      <CustomModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={handleSubmit}
        title="Confirmação"
        body="Confirma a vinculação do(s) orientador(es) à empresa?"
      />
    </>
  )
}
