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

export default function TelaRelatorioAlunosEmpresas() {
  const [empresas, setEmpresas] = useState([])
  const [alunosVinculados, setAlunosVinculados] = useState([])
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

  const getAlunosVinculados = async () => {
    try {
      const res = await axios.get(
        urlBase + `/empresas/alunos/${selectedEmpresa}`,
      )
      if (Array.isArray(res.data)) {
        setAlunosVinculados(res.data)
      }
    } catch ({ response }) {
      toast.error(`Não foi possível obter alunos: ${response.data.message}`)
    }
  }

  useEffect(() => {
    getEmpresas()
  }, [])

  useEffect(() => {
    if (selectedEmpresa !== '') {
      getAlunosVinculados()
    } else {
      setAlunosVinculados([])
    }
    // eslint-disable-next-line
  }, [selectedEmpresa]);

  const linhas = []

  alunosVinculados.forEach((alunoVinculado) => {
    if (
      alunoVinculado.aluno.nome.toLowerCase().indexOf(filtro.toLowerCase()) ===
      -1
    ) {
      return
    }
    linhas.push(
      <tr key={alunoVinculado.codigo}>
        <td className="text-center">{alunoVinculado.aluno.codigo}</td>
        <td>{alunoVinculado.aluno.nome}</td>
        <td>{alunoVinculado.aluno.cpf}</td>
        <td>{alunoVinculado.aluno.rg}</td>
        <td>{alunoVinculado.aluno.info.telefone}</td>
        <td>{alunoVinculado.aluno.info.email}</td>
        <td>
          {new Date(alunoVinculado.aluno.dataMatricula).toLocaleDateString(
            'pt-BR',
          )}
        </td>
      </tr>,
    )
  })

  return (
    <>
      <Cabecalho2 texto1={'Relatório'} texto2={'Alunos / Empresas'} />
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
        <Table bordered hover responsive="sm" id="tabelaAlunosEmpresas">
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
              tableId="tabelaAlunosEmpresas"
              fileName="relatorioAlunosEmpresas"
            />
          </Col>
        </Row>
      </Container>
    </>
  )
}
