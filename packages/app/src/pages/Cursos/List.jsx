import { useState } from 'react'
import {
  Table,
  Form,
  Button,
  Col,
  InputGroup,
  Row,
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

export default function TabelaCadastroCursos({
  cursos,
  setCursos,
  filtro,
  aoMudarFiltro,
  setOnEdit,
  setExibeTabela,
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [toDelete, setToDelete] = useState(null)

  const handleDelete = async (codigo) => {
    await axios
      .delete(`${urlBase}/cursos/${codigo}`)
      .then((response) => {
        const newArray = cursos.filter((curso) => curso.codigo !== codigo)

        setCursos(newArray)
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
    const curso = cursos.find((curso) => curso.codigo === codigo)
    setToDelete(curso)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirmation = () => {
    if (toDelete) {
      handleDelete(toDelete.codigo)
      setShowDeleteModal(false)
      setToDelete(null)
    }
  }

  const linhas = []

  cursos.forEach((curso, i) => {
    if (curso.nome.toLowerCase().indexOf(filtro.toLowerCase()) === -1) {
      return
    }
    linhas.push(
      <LinhaCurso
        curso={curso}
        key={i}
        handleEdit={handleEdit}
        handleConfirm={confirmOnDelete}
      />,
    )
  })

  return (
    <div>
      <Cabecalho2 texto1={'Consulta'} texto2={'Cursos'} />
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
        <Table bordered hover className="fs-6" id="tabelaCursos">
          <thead>
            <tr>
              <th className="text-center">#</th>
              <th>Nome</th>
              <th>Sala</th>
              <th>Eixo</th>
              <th>Carga horária</th>
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
              tableId="tabelaCursos"
              fileName="relatorioCursos"
            />
          </Col>
        </Row>
      </Container>

      <CustomModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirmation}
        title="Confirmação"
        body={`Confirma a exclusão do curso ${toDelete?.nome}?`}
      />
    </div>
  )
}

function LinhaCurso({ curso, handleEdit, handleConfirm }) {
  return (
    <tr>
      <td className="text-center">{curso.codigo}</td>
      <td>{curso.nome}</td>
      <td>{curso.sala}</td>
      <td>{curso.eixo}</td>
      <td>{curso.cargaHoras}</td>
      <td>{curso.status ? 'Ativo' : 'Inativo'}</td>
      <td id="acoes">
        <div className="d-flex justify-content-center">
          <EditButton onclick={() => handleEdit(curso)} />
          <DeleteButton onclick={() => handleConfirm(curso.codigo)} />
        </div>
      </td>
    </tr>
  )
}
