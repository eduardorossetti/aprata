import {
  Table,
  Form,
  Row,
  Col,
  InputGroup,
  Button,
  Container,
} from 'react-bootstrap'
import {
  AddButton,
  EditButton,
  DeleteButton,
  PrintButton,
  ExcelButton,
} from '../../components/Buttons/Index'
import Cabecalho2 from '../../components/HeaderBelow'
import { urlBase } from '../../utils/definitions'
import axios from '../../lib/api'
import { toast } from 'react-toastify'
import { useState } from 'react'
import CustomModal from '../../components/Modal/Index'

export default function TabelaCadastroAlunos({
  alunos,
  setAlunos,
  filtro,
  aoMudarFiltro,
  setOnEdit,
  setExibeTabela,
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [toDelete, setToDelete] = useState(null)
  const linhas = []

  const handleDelete = async (codigo) => {
    await axios
      .delete(`${urlBase}/alunos/${codigo}`)
      .then((response) => {
        const newArray = alunos.filter((aluno) => aluno.codigo !== codigo)
        setAlunos(newArray)
        toast.success(response.data.message)
      })
      .catch(({ response }) => toast.error(response.data.message))
    setOnEdit(null)
  }

  const handleEdit = (item) => {
    setOnEdit(item)
    setExibeTabela(false)
  }

  const confirmOnDelete = (codigo) => {
    const aluno = alunos.find((aluno) => aluno.codigo === codigo)
    setToDelete(aluno)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirmation = () => {
    if (toDelete) {
      handleDelete(toDelete.codigo)
      setShowDeleteModal(false)
      setToDelete(null)
    }
  }

  alunos.forEach((aluno, i) => {
    if (aluno.nome.toLowerCase().indexOf(filtro.toLowerCase()) === -1) {
      return
    }
    linhas.push(
      <LinhaAluno
        aluno={aluno}
        key={i}
        handleEdit={handleEdit}
        handleConfirm={confirmOnDelete}
      />,
    )
  })

  return (
    <div>
      <Cabecalho2 texto1={'Consulta'} texto2={'Alunos'} />
      <Container className="mt-3">
        <Row id="topo">
          <Col xs={12} md={6} lg={8} className="mb-3">
            <AddButton onclick={() => setExibeTabela(false)} />
          </Col>
          <Col xs={12} md={6} lg={4} className="mb-3">
            <InputGroup>
              <Form.Control
                type="text"
                value={filtro}
                placeholder="Pesquisar por nome..."
                onChange={(e) => aoMudarFiltro(e.target.value)}
              />
              <Button
                variant="outline-secondary"
                onClick={() => aoMudarFiltro('')}
              >
                Limpar
              </Button>
            </InputGroup>
          </Col>
        </Row>
        <Table bordered hover className="fs-6" id="tabelaAlunos">
          <thead>
            <tr>
              <th className="text-center">#</th>
              <th>Nome</th>
              <th>CPF</th>
              <th>RG</th>
              <th>Nascimento</th>
              <th>Status</th>
              <th className="text-center" id="acoes">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>{linhas}</tbody>
        </Table>
        <Row id="acoes">
          <Col className="d-flex justify-content-end">
            <PrintButton />
            <ExcelButton
              onClick={() => toast.success('Relatório xlsx gerado!')}
              tableId="tabelaAlunos"
              fileName="relatorioAluno"
            />
          </Col>
        </Row>
        <CustomModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirmation}
          title="Confirmação"
          body={`Confirma a exclusão do(a) aluno(a) ${toDelete?.nome}?`}
        />
      </Container>
    </div>
  )
}

function LinhaAluno({ aluno, handleEdit, handleConfirm }) {
  return (
    <tr>
      <td className="text-center">{aluno.codigo}</td>
      <td>{aluno.nome}</td>
      <td>{aluno.cpf}</td>
      <td>{aluno.rg}</td>
      <td>{new Date(aluno.dataNascimento).toLocaleDateString('pt-BR')}</td>
      <td>{aluno.status ? 'Ativo' : 'Inativo'}</td>
      <td id="acoes">
        <div className="d-flex justify-content-center">
          <EditButton onclick={() => handleEdit(aluno)} />
          <DeleteButton onclick={() => handleConfirm(aluno.codigo)} />
        </div>
      </td>
    </tr>
  )
}
