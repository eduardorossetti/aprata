import { useState, useEffect } from 'react'
import Form from './Form'
import List from './List'
import { urlBase } from '../../utils/definitions'
import axios from '../../lib/api'
import { toast } from 'react-toastify'

export default function TelaCadastroAlunos() {
  const [exibeTabela, setExibeTabela] = useState(true)
  const [onEdit, setOnEdit] = useState(null)
  const [alunos, setAlunos] = useState([])
  const [filtro, setFiltro] = useState('')

  const getAlunos = async () => {
    try {
      const res = await axios.get(urlBase + '/alunos')
      if (Array.isArray(res.data)) {
        setAlunos(res.data)
      }
    } catch ({ response }) {
      toast.error(`Não foi possível obter alunos: ${response.data.message}`)
    }
  }

  useEffect(() => {
    getAlunos()
  }, [setAlunos])

  return exibeTabela ? (
    <List
      alunos={alunos}
      setAlunos={setAlunos}
      setOnEdit={setOnEdit}
      filtro={filtro}
      aoMudarFiltro={setFiltro}
      setExibeTabela={setExibeTabela}
    />
  ) : (
    <Form
      onEdit={onEdit}
      setOnEdit={setOnEdit}
      alunos={alunos}
      setAlunos={setAlunos}
      setExibeTabela={setExibeTabela}
    />
  )
}
