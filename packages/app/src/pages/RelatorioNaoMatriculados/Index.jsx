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

export default function TelaRelatorioNaoMatriculados() {
  const [alunos, setAlunos] = useState([])
  const [filtro, setFiltro] = useState('')

  useEffect(() => {
    const getAlunosNaoMatriculados = async () => {
      try {
        const res = await axios.get(
          urlBase + '/alunos/matricula/nao-matriculados',
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

  const linhas = []

  alunos.forEach((aluno, i) => {
    if (aluno.nome.toLowerCase().indexOf(filtro.toLowerCase()) === -1) {
      return
    }
    linhas.push(
      <tr key={i}>
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
      <Cabecalho2 texto1={'Relatório'} texto2={'Alunos Não Matriculados'} />
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
        <Table bordered hover responsive="sm" id="tabelaAlunosNaoMatriculados">
          <thead>
            <tr>
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

        <Row id="acoes">
          <Col className="d-flex justify-content-end">
            <PrintButton />
            <ExcelButton
              onClick={() => toast.success('Relatório xlsx gerado!')}
              tableId="tabelaAlunosNaoMatriculados"
              fileName="relatorioAlunosNaoMatriculados"
            />
          </Col>
        </Row>
      </Container>
    </>
  )
}
