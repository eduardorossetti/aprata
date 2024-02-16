import {
  Table,
  Form,
  Container,
  Row,
  Col,
  InputGroup,
  Button,
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
import CustomModal from '../../components/Modal/Index'
import { useState } from 'react'

export default function TabelaCadastroEmpresas({
  empresas,
  setEmpresas,
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
      .delete(`${urlBase}/empresas/${codigo}`)
      .then((response) => {
        const newArray = empresas.filter((empresa) => empresa.codigo !== codigo)

        setEmpresas(newArray)
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
    const empresa = empresas.find((empresa) => empresa.codigo === codigo)
    setToDelete(empresa)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirmation = () => {
    if (toDelete) {
      handleDelete(toDelete.codigo)
      setShowDeleteModal(false)
      setToDelete(null)
    }
  }

  empresas.forEach((empresa, i) => {
    if (empresa.nome.toLowerCase().indexOf(filtro.toLowerCase()) === -1) {
      return
    }
    linhas.push(
      <LinhaEmpresa
        empresa={empresa}
        key={i}
        handleEdit={handleEdit}
        handleConfirm={confirmOnDelete}
      />,
    )
  })

  return (
    <div>
      <Cabecalho2 texto1={'Consulta'} texto2={'Empresas'} />
      <Container className="mt-3 overflow-auto">
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
        <Table bordered hover className="fs-6" Id="tabelaEmpresas">
          <thead>
            <tr>
              <th className="text-center">#</th>
              <th>Razão Social</th>
              <th>CNPJ</th>
              <th>Proprietário</th>
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
              tableId="tabelaEmpresas"
              fileName="relatorioEmpresas"
            />
          </Col>
        </Row>
      </Container>
      <CustomModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirmation}
        title="Confirmação"
        body={`Confirma a exclusão da empresa ${toDelete?.nome}?`}
      />
    </div>
  )
}

function LinhaEmpresa({ empresa, handleEdit, handleConfirm }) {
  return (
    <tr>
      <td className="text-center">{empresa.codigo}</td>
      <td>{empresa.nome}</td>
      <td>{empresa.cnpj}</td>
      <td>{empresa.proprietario}</td>
      <td id="acoes">
        <div className="d-flex justify-content-center">
          <EditButton onclick={() => handleEdit(empresa)} />
          <DeleteButton onclick={() => handleConfirm(empresa.codigo)} />
        </div>
      </td>
    </tr>
  )
}
