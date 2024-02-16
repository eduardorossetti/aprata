import { useState } from 'react'
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
import CustomModal from '../../components/Modal/Index'

export default function TabelaCadastroCargos({
  cargos,
  setCargos,
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
      .delete(`${urlBase}/cargos/${codigo}`)
      .then((response) => {
        const newArray = cargos.filter((cargo) => cargo.codigo !== codigo)

        setCargos(newArray)
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
    const cargo = cargos.find((cargo) => cargo.codigo === codigo)
    setToDelete(cargo)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirmation = () => {
    if (toDelete) {
      handleDelete(toDelete.codigo)
      setShowDeleteModal(false)
      setToDelete(null)
    }
  }

  cargos.forEach((cargo, i) => {
    if (cargo.nome.toLowerCase().indexOf(filtro.toLowerCase()) === -1) {
      return
    }
    linhas.push(
      <LinhaCargo
        cargo={cargo}
        key={i}
        handleEdit={handleEdit}
        handleConfirm={confirmOnDelete}
      />,
    )
  })

  return (
    <div>
      <Cabecalho2 texto1={'Consulta'} texto2={'Cargos'} />
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

        <Table bordered hover className="fs-6" Id="tabelaCargos">
          <thead>
            <tr>
              <th className="text-center">#</th>
              <th>Nome</th>
              <th>Descrição</th>
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
              tableId="tabelaCargos"
              fileName="relatorioCargos"
            />
          </Col>
        </Row>
      </Container>

      <CustomModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirmation}
        title="Confirmação"
        body={`Confirma a exclusão do cargo ${toDelete?.nome}?`}
      />
    </div>
  )
}

function LinhaCargo({ cargo, handleEdit, handleConfirm }) {
  return (
    <tr>
      <td className="text-center">{cargo.codigo}</td>
      <td>{cargo.nome}</td>
      <td>{cargo.descricao}</td>
      <td id="acoes">
        <div className="d-flex justify-content-center">
          <EditButton onclick={() => handleEdit(cargo)} />
          <DeleteButton onclick={() => handleConfirm(cargo.codigo)} />
        </div>
      </td>
    </tr>
  )
}
