import { useEffect, useState } from 'react'
import { Container, Col, Row, Button } from 'react-bootstrap'
import Cabecalho2 from '../../components/HeaderBelow'
import { urlBase } from '../../utils/definitions'
import SearchBar from '../../components/SearchBarWithFormik/Index'
import CustomModal from '../../components/Modal/Index'
import axios from '../../lib/api'
import { toast } from 'react-toastify'
import { FormikProvider, useFormik } from 'formik'
import * as Yup from 'yup'
import FormTextField from '../../components/Form/form-field'
import FormTextAreaField from '../../components/Form/form-textarea'

const schema = Yup.object().shape({
  aluno: Yup.number().required('Aluno é obrigatório'),
  dataRelatorio: Yup.string().required('Data é obrigatório'),
  conteudo: Yup.string().required('Relatório é obrigatório'),
  titulo: Yup.string().required('Título é obrigatório'),
})
const initialValues = {
  codigo: '',
  aluno: '',
  dataRelatorio: '',
  conteudo: '',
  titulo: '',
}

const options = {
  headers: { 'content-type': 'application/json' },
}

export default function FormRelatorioAprendiz({
  onEdit,
  setExibeTabela,
  setOnEdit,
  alunos,
}) {
  const [showModal, setShowModal] = useState(false)
  const [selectedAluno, setSelectedAluno] = useState(null)

  const handleSubmit = async (values) => {
    const data = {
      codigoRelatorio: values.codigo,
      dataRelatorio: values.dataRelatorio,
      conteudo: values.conteudo,
      titulo: values.titulo,
    }

    if (onEdit) {
      await axios
        .put(
          `${urlBase}/alunos/relatorio/${values.aluno}`,
          JSON.stringify(data),
          options,
        )
        .then((response) => {
          toast.success(response.data.message)
        })
        .catch(({ response }) => {
          toast.error(response.data.message)
        })
    } else {
      await axios
        .post(
          `${urlBase}/alunos/relatorio/${values.aluno}`,
          JSON.stringify(data),
          options,
        )
        .then((response) => {
          formik.setFieldValue('codigo', response.data.id)
          toast.success(response.data.message)
        })
        .catch(({ response }) => {
          toast.error(response.data.message)
        })
    }
    setShowModal(false)
  }
  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: handleSubmit,
  })

  useEffect(() => {
    if (onEdit) {
      for (const key in onEdit) {
        if (key === 'aluno') {
          const aluno = onEdit[key]
          formik.setFieldValue(key, aluno.codigo)
          setSelectedAluno(aluno)
        } else {
          formik.setFieldValue(key, onEdit[key])
        }
      }
    }
    // eslint-disable-next-line
  }, [onEdit])

  const handleBackButton = () => {
    if (onEdit) setOnEdit(null)
    setExibeTabela(true)
  }

  const handleSave = () => {
    setShowModal(true)
  }

  const handleConfirmSave = () => {
    setShowModal(false)
    formik.handleSubmit()
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  return (
    <div>
      <Cabecalho2 texto1={'Cadastro'} texto2={'Relatório do Aprendiz'} />
      <Container
        className="my-4 p-3 overflow-auto"
        style={{
          maxHeight: '75vh',
        }}
      >
        <FormikProvider value={formik}>
          <Row>
            <Col sm={3} md={3} lg={3} className="mb-3">
              <FormTextField
                controlId="formRelatorio.codigo"
                label="Código"
                name="codigo"
                value={formik.values.codigo}
                isDisabled={true}
              />
            </Col>
          </Row>
          <Row>
            <Col md={9} className="mb-3">
              <SearchBar
                controlId="formRelatorio.aluno"
                name="aluno"
                formRef={formik}
                data={alunos}
                label={'Alunos'}
                keyField={'codigo'}
                searchField={'nome'}
                selected={selectedAluno}
                required
              />
            </Col>
            <Col md={3} className="mb-3">
              <FormTextField
                controlId="formRelatorio.dataRelatorio"
                label="Data"
                name="dataRelatorio"
                value={formik.values.dataRelatorio}
                type="date"
                required
              />
            </Col>
          </Row>
          <Row>
            <Col md={12} className="mb-3">
              <FormTextField
                controlId="formRelatorio.titulo"
                label="Título"
                name="titulo"
                value={formik.values.titulo}
                type="text"
                required
              />
            </Col>
          </Row>
          <Row>
            <Col className="mb-3">
              <FormTextAreaField
                controlId="formRelatorio.conteudo"
                label="Conteúdo"
                name="conteudo"
                value={formik.values.conteudo}
                required
              />
            </Col>
          </Row>

          <Row>
            <Col className="d-flex justify-content-end">
              <Button
                variant="outline-secondary"
                size="md"
                type="button"
                className="me-2"
                onClick={handleBackButton}
              >
                Voltar
              </Button>
              <Button size="md" onClick={handleSave} type="submit">
                Salvar
              </Button>
            </Col>
          </Row>
        </FormikProvider>
      </Container>
      <CustomModal
        show={showModal}
        onHide={handleCloseModal}
        onConfirm={handleConfirmSave}
        title="Confirmação"
        body="Tem certeza que deseja salvar as informações?"
      />
    </div>
  )
}
