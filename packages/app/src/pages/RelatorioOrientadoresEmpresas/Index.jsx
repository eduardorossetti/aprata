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

export default function TelaRelatorioOrientadoresEmpresas() {
  const [empresas, setEmpresas] = useState([])
  const [orientadoresVinculados, setOrientadoresVinculados] = useState([])
  const [filtro, setFiltro] = useState('')
  const [selectedEmpresa, setSelectedEmpresa] = useState('')

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

  const getOrientadoresVinculados = async () => {
    try {
      const res = await axios.get(
        urlBase + `/empresas/orientadores/${selectedEmpresa}`,
      )
      if (Array.isArray(res.data)) {
        setOrientadoresVinculados(res.data)
      }
    } catch ({ response }) {
      toast.error(
        `Não foi possível obter orientadores: ${response.data.message}`,
      )
    }
  }

  useEffect(() => {
    getEmpresas()
  }, [])

  useEffect(() => {
    if (selectedEmpresa !== '') {
      getOrientadoresVinculados()
    } else {
      setOrientadoresVinculados([])
    }
    // eslint-disable-next-line
  }, [selectedEmpresa]);

  const linhas = []

  orientadoresVinculados.forEach((funcionario) => {
    if (funcionario.nome.toLowerCase().indexOf(filtro.toLowerCase()) === -1) {
      return
    }
    linhas.push(
      <tr key={funcionario.codigo}>
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
      <Cabecalho2 texto1={'Relatório'} texto2={'Orientadores / Empresas'} />
      <Container className="mt-3">
        <Row className="justify-content-between">
          <Col xs={12} md={6} lg={4} className="mb-3">
            <Form.Group controlId="selectTurma">
              <Form.Select
                as="select"
                value={selectedEmpresa}
                onChange={(e) => {
                  setSelectedEmpresa(e.target.value)
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
              <InputGroup id="acoes">
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
        <Table bordered hover responsive="sm" id="tabelaOrientadoresEmpresas">
          <thead>
            <tr>
              <th className="text-center">#</th>
              <th>Nome</th>
              <th>CPF</th>
              <th>Telefone</th>
              <th>@email</th>
              <th>Usuário</th>
            </tr>
          </thead>
          <tbody>{linhas}</tbody>
        </Table>
        <Row id="acoes">
          <Col className="d-flex justify-content-end">
            <PrintButton />
            <ExcelButton
              onClick={() => toast.success('Relatório xlsx gerado!')}
              tableId="tabelaOrieentadosEmpresas"
              fileName="relatorioOrientadoresEmpresas"
            />
          </Col>
        </Row>
      </Container>
    </>
  )
}
