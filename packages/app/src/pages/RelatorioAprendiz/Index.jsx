import { useEffect, useState } from 'react'
import Form from './Form'
import List from './List'
import { urlBase } from '../../utils/definitions.js'
import axios from '../../lib/api'
import { toast } from 'react-toastify'

export default function TelaRelatorioAprendiz() {
  const [exibeTabela, setExibeTabela] = useState(true)
  const [onEdit, setOnEdit] = useState(null)
  const [relatorios, setRelatorios] = useState([])
  const [alunos, setAlunos] = useState([])
  const [filtro, setFiltro] = useState('')

  const getRelatorios = async () => {
    try {
      const res = await axios.get(`${urlBase}/alunos/relatorio/`)
      if (Array.isArray(res.data)) {
        setRelatorios(res.data)
      }
    } catch ({ response }) {
      toast.error(`Não foi possível obter relatorios: ${response.data.message}`)
    }
  }

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
    if (exibeTabela) {
      getAlunos()
      getRelatorios()
    }
    // eslint-disable-next-line
  }, [exibeTabela])

  return exibeTabela ? (
    <List
      onEdit={onEdit}
      alunos={alunos}
      relatorios={relatorios}
      setRelatorios={setRelatorios}
      setOnEdit={setOnEdit}
      filtro={filtro}
      aoMudarFiltro={setFiltro}
      setExibeTabela={setExibeTabela}
    />
  ) : (
    <Form
      onEdit={onEdit}
      setExibeTabela={setExibeTabela}
      setOnEdit={setOnEdit}
      relatorios={relatorios}
      alunos={alunos}
      setRelatorios={setRelatorios}
    />
  )
}
