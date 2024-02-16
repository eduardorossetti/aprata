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
  DeleteButton,
  EditButton,
  ExcelButton,
  PrintButton,
} from '../../components/Buttons/Index'
import Cabecalho2 from '../../components/HeaderBelow'
import { urlBase } from '../../utils/definitions'
import axios from '../../lib/api'
import { toast } from 'react-toastify'
import { useState } from 'react'
import CustomModal from '../../components/Modal/Index'

export default function TabelaCadastroFuncionarios({
  funcionarios,
  setFuncionarios,
  filtro,
  aoMudarFiltro,
  setOnEdit,
  setExibeTabela,
}) {
  const linhas = []

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [toDelete, setToDelete] = useState(null)

  const handleDelete = async (codigo) => {
    await axios
      .delete(`${urlBase}/funcionarios/${codigo}`)
      .then((response) => {
        const newArray = funcionarios.filter(
          (funcionario) => funcionario.codigo !== codigo,
        )

        setFuncionarios(newArray)
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
    const funcionario = funcionarios.find(
      (funcionario) => funcionario.codigo === codigo,
    )
    setToDelete(funcionario)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirmation = () => {
    if (toDelete) {
      handleDelete(toDelete.codigo)
      setShowDeleteModal(false)
      setToDelete(null)
    }
  }

  funcionarios.forEach((funcionario, i) => {
    if (funcionario.nome.toLowerCase().indexOf(filtro.toLowerCase()) === -1) {
      return
    }
    linhas.push(
      <LinhaFuncionario
        funcionario={funcionario}
        key={i}
        handleEdit={handleEdit}
        handleConfirm={confirmOnDelete}
      />,
    )
  })

  return (
    <div>
      <Cabecalho2 texto1={'Consulta'} texto2={'Funcionários'} />
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
        <Table bordered hover className="fs-6" id="tabelaFuncionarios">
          <thead>
            <tr>
              <th className="text-center">#</th>
              <th>Nome</th>
              <th>CPF</th>
              <th>Atribuições</th>
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
              tableId="tabelaFuncionarios"
              fileName="relatorioFuncionarios"
            />
          </Col>
        </Row>
      </Container>
      <CustomModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirmation}
        title="Confirmação"
        body={`Confirma a exclusão do(a) funcionário(a) ${toDelete?.nome}?`}
      />
    </div>
  )
}

function LinhaFuncionario({ funcionario, handleEdit, handleConfirm }) {
  const atribuicoes = funcionario.atribuicoes
    .map((atribuicao) => atribuicao.nome)
    .join(' / ')

  return (
    <tr>
      <td className="text-center">{funcionario.codigo}</td>
      <td>{funcionario.nome}</td>
      <td>{funcionario.cpf}</td>
      <td>{atribuicoes}</td>
      <td id="acoes">
        <div className="d-flex justify-content-center">
          <EditButton onclick={() => handleEdit(funcionario)} />
          <DeleteButton onclick={() => handleConfirm(funcionario.codigo)} />
        </div>
      </td>
    </tr>
  )
}
