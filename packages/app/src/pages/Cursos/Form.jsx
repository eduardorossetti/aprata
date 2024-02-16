import { Container, Col, Row, Button } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import Cabecalho2 from '../../components/HeaderBelow'
import { urlBase } from '../../utils/definitions'
import { toast } from 'react-toastify'
import axios from '../../lib/api'
import { FormikProvider, useFormik } from 'formik'
import * as Yup from 'yup'
import FormTextField from '../../components/Form/form-field'
import FormSelectField from '../../components/Form/form-select-field'
import CustomModal from '../../components/Modal/Index'
import HelpIcon from '../../components/Help/Index'

const schema = Yup.object().shape({
  nome: Yup.string().required('Nome do curso é obrigatório'),
  sala: Yup.string().required('Sala do curso é obrigatório'),
  eixo: Yup.string().required('Eixo formativo do curso é obrigatório'),
  cargaHoras: Yup.string().required('Carga de horas é obrigatório'),
  status: Yup.string().required('Status é obrigatório'),
})

const initialValues = {
  codigo: '',
  nome: '',
  sala: '',
  eixo: '',
  cargaHoras: '',
  status: '',
}

const options = {
  headers: { 'content-type': 'application/json' },
}

export default function FormCurso({
  onEdit,
  setExibeTabela,
  setOnEdit,
  cursos,
  setCursos,
}) {
  const [showModal, setShowModal] = useState(false)

  const handleSubmit = async (values) => {
    const updatedCursos = cursos
    if (onEdit) {
      await axios
        .put(`${urlBase}/cursos/`, JSON.stringify(values), options)
        .then((response) => {
          const index = updatedCursos.findIndex(
            (i) => i.codigo === onEdit.codigo,
          )
          updatedCursos[index] = values
          setCursos(updatedCursos)
          toast.success(response.data.message)
        })
        .catch(({ response }) => {
          toast.error(response.data.message)
        })
    } else {
      await axios
        .post(`${urlBase}/cursos/`, JSON.stringify(values), options)
        .then((response) => {
          formik.setFieldValue('codigo', response.data.id)
          values.codigo = response.data.id
          updatedCursos.push(values)
          setCursos(updatedCursos)
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
    // enableReinitialize: false,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: handleSubmit,
  })

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

  useEffect(() => {
    if (onEdit) {
      for (const key in onEdit) {
        formik.setFieldValue(key, onEdit[key])
      }
    }
    // eslint-disable-next-line
  }, [onEdit]);

  return (
    <div>
      <Cabecalho2 texto1={'Cadastro'} texto2={'Curso'} />
      <Container
        className="my-4 p-3 overflow-auto"
        style={{ maxHeight: '75vh' }}
      >
        <FormikProvider value={formik}>
          <Row>
            <Col sm={2} md={2} lg={2} className="mb-3">
              <FormTextField
                controlId="formCurso.codigo"
                label="Código"
                name="codigo"
                value={formik.values.codigo}
                isDisabled={true}
              />
            </Col>
          </Row>

          <Row>
            <Col className="mb-3">
              <FormTextField
                controlId="formCurso.nome"
                label="Nome"
                name="nome"
                placeholder="Informe o nome do curso"
                value={formik.values.nome}
                required
              />
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mb-3">
              <FormTextField
                controlId="formCurso.sala"
                label="Sala"
                name="sala"
                placeholder="Informe a sala do curso"
                value={formik.values.sala}
                required
              />
            </Col>
            <Col md={6} className="mb-3">
              <FormSelectField
                controlId="formCurso.status"
                label={
                  <>
                    Status
                    <HelpIcon text="Antes da inativação, confira se ele não está vinculado a alguma turma!" />
                  </>
                }
                name="status"
                className="mb-3"
                required
              >
                <option value="">Selecione o status do curso</option>
                <option value="1">Ativo</option>
                <option value="0">Inativo</option>
              </FormSelectField>
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-3">
              <FormTextField
                controlId="formCurso.eixo"
                label="Eixo"
                name="eixo"
                placeholder="Informe o eixo formativo do curso"
                value={formik.values.eixo}
                required
              />
            </Col>
            <Col md={6} className="mb-3">
              <FormTextField
                controlId="formCurso.cargaHoras"
                label="Carga horária"
                name="cargaHoras"
                placeholder="Informe a carga horária do curso"
                value={formik.values.cargaHoras}
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
