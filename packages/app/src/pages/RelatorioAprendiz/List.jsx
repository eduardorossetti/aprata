import React, { useEffect, useState } from 'react'
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Table,
} from 'react-bootstrap'
import { toast } from 'react-toastify'
import {
  AddButton,
  DeleteButton,
  EditButton,
  ExcelButton,
  PrintButton,
} from '../../components/Buttons/Index'
import Cabecalho2 from '../../components/HeaderBelow'
import CustomModal from '../../components/Modal/Index'
import SearchBar from '../../components/SearchBar/Index'
import '../../components/styles/reports.css'
import axios from '../../lib/api'
import { urlBase } from '../../utils/definitions'
import { formatDate } from '../../utils/format'

function RelatorioRow({ relatorio, onEdit, onDelete }) {
  return (
    <tr>
      <td>
        <div className="report-content">
          <div className="small-text">
            <b>Aprendiz - {relatorio.aluno.nome}</b>
            <p>Título - {relatorio.titulo}</p>
          </div>
          {relatorio.conteudo}
          <div className="small-text">
            <p>Data do Relatório - {formatDate(relatorio.dataRelatorio)}</p>
            <td id="acoes">
              <div className="d-flex justify-content-center">
                <EditButton onclick={() => onEdit(relatorio)} />
                <DeleteButton onclick={() => onDelete(relatorio.codigo)} />
              </div>
            </td>
          </div>
        </div>
      </td>
    </tr>
  )
}

export default function RelatorioAprendizTable({
  relatorios,
  alunos,
  setRelatorios,
  setOnEdit,
  setExibeTabela,
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [toDelete, setToDelete] = useState(null)
  const [searchBarValue, setSearchBarValue] = useState('')
  const [searchBarDate, setSearchBarDate] = useState('')
  const [filteredReports, setFilteredReports] = useState(relatorios)
  const [selectedStudent, setSelectedStudent] = useState(null)

  const handleDelete = async (codigo) => {
    try {
      const response = await axios.delete(
        `${urlBase}/alunos/relatorio/${codigo}`,
      )
      const updatedReports = relatorios.filter(
        (report) => report.codigo !== codigo,
      )
      setRelatorios(updatedReports)
      toast.success(response.data.message)
    } catch (error) {
      toast.error(error.response.data.message || 'Erro ao excluir relatório')
    } finally {
      setShowDeleteModal(false)
      setToDelete(null)
    }
  }

  const handleEdit = (report) => {
    setOnEdit(report)
    setExibeTabela(false)
  }

  const confirmDelete = (codigo) => {
    const student = relatorios.find((student) => student.codigo === codigo)
    setToDelete(student)
    setShowDeleteModal(true)
  }

  const handleStudentSelection = (codigo) => {
    setSearchBarValue(codigo)
    const selected = alunos.find((student) => student.codigo === codigo)
    setSelectedStudent(selected)
  }

  const renderStudentInfo = (student) => {
    if (!student) return null

    return (
      <div className="info-aluno-table-container mt-4">
        <Table striped bordered hover size="sm" className="info-aluno-table">
          <tbody>
            <tr>
              <td>
                <b>Nome:</b> {student.nome}
              </td>
              <td>
                <b>CPF:</b> {student.cpf}
              </td>
              <td>
                <b>RG:</b> {student.rg}
              </td>
            </tr>
            <tr>
              <td>
                <b>Telefone:</b> {student.info.telefone}
              </td>
              <td>
                <b>Email:</b> {student.info.email}
              </td>
              <td>
                <b>Nascimento:</b> {formatDate(student.dataNascimento)}
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    )
  }

  useEffect(() => {
    let updatedList = relatorios

    if (searchBarValue) {
      updatedList = updatedList.filter(
        (report) => report.aluno.codigo === searchBarValue,
      )
    }

    if (searchBarDate) {
      updatedList = updatedList.filter(
        (report) => report.dataRelatorio === searchBarDate,
      )
    }

    setFilteredReports(updatedList)
  }, [relatorios, searchBarValue, searchBarDate])

  return (
    <div>
      <Cabecalho2 texto1={'Consulta'} texto2={'Relatórios dos Aprendizes'} />
      <Container className="overflow-auto">
        <Row id="topo">
          <Col className="mt-4">
            <AddButton onclick={() => setExibeTabela(false)} />
          </Col>
          <Col md={3}>
            <SearchBar
              controlId="formRelatorio.aluno"
              name="aluno"
              data={alunos}
              keyField={'codigo'}
              searchField={'nome'}
              setValue={handleStudentSelection}
            />
          </Col>
          <Col md={3} className="mt-4">
            <InputGroup>
              <Form.Control
                type="date"
                value={searchBarDate}
                placeholder="Pesquisar por data..."
                onChange={(e) => setSearchBarDate(e.target.value)}
              />
              <Button
                variant="outline-secondary"
                onClick={() => setSearchBarDate('')}
              >
                Limpar
              </Button>
            </InputGroup>
          </Col>
        </Row>
        {renderStudentInfo(selectedStudent)}
        <Table bordered hover className="fs-6 mt-4" id="tabelaAprendiz">
          <tbody>
            {filteredReports.map((report) => (
              <RelatorioRow
                relatorio={report}
                key={report.codigo}
                handleEdit={handleEdit}
                handleConfirm={confirmDelete}
              />
            ))}
          </tbody>
        </Table>
        <Row id="acoes">
          <Col className="d-flex justify-content-end">
            <PrintButton />
            <ExcelButton
              onClick={() => toast.success('Relatório xlsx gerado!')}
              tableId="tabelaAprendiz"
              fileName="relatorioAprendiz"
            />
          </Col>
        </Row>
      </Container>
      <CustomModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={() => handleDelete(toDelete.codigo)}
        title="Confirmação"
        body={`Confirma a exclusão do relatório ${toDelete?.nome}?`}
      />
    </div>
  )
}
