import { useState, useEffect } from 'react'
import Form from './Form'
import List from './List'
import { urlBase } from '../../utils/definitions'
import axios from '../../lib/api'
import { toast } from 'react-toastify'

export default function TelaCadastroCursos() {
  const [exibeTabela, setExibeTabela] = useState(true)
  const [onEdit, setOnEdit] = useState(null)
  const [cursos, setCursos] = useState([])
  const [filtro, setFiltro] = useState('')

  const getCursos = async () => {
    try {
      const res = await axios.get(urlBase + '/cursos')
      if (Array.isArray(res.data)) {
        setCursos(res.data)
      }
    } catch ({ response }) {
      toast.error(`Não foi possível obter cursos: ${response.data.message}`)
    }
  }

  useEffect(() => {
    getCursos()
  }, [setCursos])

  return exibeTabela ? (
    <List
      cursos={cursos}
      setCursos={setCursos}
      setOnEdit={setOnEdit}
      filtro={filtro}
      aoMudarFiltro={setFiltro}
      setExibeTabela={setExibeTabela}
    />
  ) : (
    <Form
      onEdit={onEdit}
      setOnEdit={setOnEdit}
      cursos={cursos}
      setCursos={setCursos}
      setExibeTabela={setExibeTabela}
    />
  )
}
