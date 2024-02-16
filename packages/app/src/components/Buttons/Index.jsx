/* global XLSX */
import { Button } from 'react-bootstrap'
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineFileAdd,
  AiOutlinePrinter,
  AiOutlineFileExcel,
} from 'react-icons/ai'

const AddButton = ({ onclick }) => {
  return (
    <Button
      className="d-flex align-items-center justify-content-around"
      onClick={onclick}
    >
      <AiOutlineFileAdd size={20} className="me-2" /> Novo
    </Button>
  )
}

const EditButton = ({ onclick }) => {
  return (
    <Button
      variant="outline-secondary"
      className="d-flex p-1 me-1"
      onClick={onclick}
      title="Editar"
    >
      <AiOutlineEdit size={16} />
    </Button>
  )
}

const DeleteButton = ({ onclick }) => {
  return (
    <Button
      variant="outline-danger"
      className="d-flex p-1 m-0"
      onClick={onclick}
      title="Excluir"
    >
      <AiOutlineDelete size={16} />
    </Button>
  )
}

const PrintButton = () => {
  const imprimir = () => {
    window.print()
  }

  return (
    <Button className="d-flex p-2 me-2" onClick={imprimir} title="Imprimir">
      <AiOutlinePrinter size={22} className="me-2" /> Imprimir
    </Button>
  )
}

const ExcelButton = ({ onClick, tableId, fileName }) => {
  const exportToExcel = () => {
    // Clona a tabela para evitar alterações indesejadas no original
    const tableClone = document.getElementById(tableId).cloneNode(true)

    // Remove a coluna "Ações" da tabela clonada (se necessário)
    const actionsColumn = tableClone.querySelector('th#acoes, td#acoes')
    if (actionsColumn) {
      actionsColumn.parentNode.removeChild(actionsColumn)
    }

    // Cria o workbook a partir da tabela clonada
    const workbook = XLSX.utils.table_to_book(tableClone)

    // Exporta para o arquivo (inicia o download)
    XLSX.writeFile(workbook, `${fileName}.xlsx`)
  }

  return (
    <Button
      variant="success"
      className="d-flex p-2 m-0"
      onClick={() => {
        exportToExcel()
        onClick() // Chama a função onClick passada como propriedade
      }}
      title={`Exportar para Excel (${fileName}.xlsx)`}
    >
      <AiOutlineFileExcel size={22} className="me-2" /> CSV
    </Button>
  )
}

export { AddButton, EditButton, DeleteButton, PrintButton, ExcelButton }
