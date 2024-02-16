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
import { useState } from 'react'

export default function TabelaCadastroTurmas({
  turmas,
  setTurmas,
  filtro,
  aoMudarFiltro,
  setOnEdit,
  setExibeTabela,
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [toDelete, setToDelete] = useState(null)

  const handleDelete = async (codigo) => {
    try {
      const response = await axios.delete(`${urlBase}/turmas/${codigo}`)
      const newArray = turmas.filter((turma) => turma.codigo !== codigo)
      setTurmas(newArray)
      toast.success(response.data.message)
    } catch (error) {
      toast.error(error.response.data.message)
    }
    setOnEdit(null)
  }

  const handleEdit = (item) => {
    setOnEdit(item)
    setExibeTabela(false)
  }

  const confirmOnDelete = (codigo) => {
    const turma = turmas.find((turma) => turma.codigo === codigo)
    setToDelete(turma)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirmation = () => {
    if (toDelete) {
      handleDelete(toDelete.codigo)
      setShowDeleteModal(false)
      setToDelete(null)
    }
  }

  const linhas = turmas.map((turma, i) => (
    <LinhaTurma
      key={i}
      turma={turma}
      handleEdit={handleEdit}
      handleConfirm={confirmOnDelete}
    />
  ))

  return (
    <div>
      <Cabecalho2 texto1={'Consulta'} texto2={'Turmas'} />
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
        <Table bordered hover className="fs-6" id="tabelaTurmas">
          <thead>
            <tr>
              <th className="text-center">#</th>
              <th>Ano Letivo</th>
              <th>Período</th>
              <th>Professores</th>
              <th>Cursos</th>
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
              tableId="tabelaTurmas"
              fileName="relatorioTurmas"
            />
          </Col>
        </Row>
      </Container>
      <CustomModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirmation}
        title="Confirmação"
        body={`Confirma a exclusão da turma ${toDelete?.codigo}?`}
      />
    </div>
  )
}

function LinhaTurma({ turma, handleEdit, handleConfirm }) {
  const professores = turma.funcionarios
    .map((funcionarios) => funcionarios.nome)
    .join(' / ')
  const cursos = turma.cursos.map((cursos) => cursos.nome).join(' / ')

  return (
    <tr>
      <td className="text-center">{turma.codigo}</td>
      <td>{turma.anoLetivo}</td>
      <td>{turma.periodo}</td>
      <td>{professores}</td>
      <td>{cursos}</td>
      <td id="acoes">
        <div className="d-flex justify-content-center">
          <EditButton onclick={() => handleEdit(turma)} />
          <DeleteButton onclick={() => handleConfirm(turma.codigo)} />
        </div>
      </td>
    </tr>
  )
}
