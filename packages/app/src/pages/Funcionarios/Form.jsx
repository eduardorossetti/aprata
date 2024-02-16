import { Container, Col, Row, Button } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import Cabecalho2 from '../../components/HeaderBelow'
import { urlBase } from '../../utils/definitions'
import axios from '../../lib/api'
import { toast } from 'react-toastify'
import { FormikProvider, useFormik } from 'formik'
import * as Yup from 'yup'
import FormTextField from '../../components/Form/form-field'
import FormSelectField from '../../components/Form/form-select-field'
import MaskedFormTextField from '../../components/Form/masked-form-field'
import { emailRegex } from '../../utils/expressions'
import NewMultiSelect from '../../components/NewMultiSelect/Index'
import CustomModal from '../../components/Modal/Index'
import HelpIcon from '../../components/Help/Index'

const schema = Yup.object().shape({
  nome: Yup.string().required('Nome é obrigatório'),
  cpf: Yup.string().required('CPF é obrigatório'),
  dataNascimento: Yup.string().required('Data de nascimento é obrigatório'),
  status: Yup.string().required('Status é obrigatório'),
  nomeUsuario: Yup.string().required('Usuário é obrigatório'),
  senhaUsuario: Yup.string().required('Senha é obrigatório'),
  atribuicoes: Yup.array().min(1, 'Selecione, no mínimo, um cargo'),

  info_telefone: Yup.string().required('Telefone é obrigatório'),
  info_email: Yup.string()
    .required('E-mail é obrigatório')
    .matches(emailRegex, 'Endereço de email inválido'),
  info_endereco: Yup.string().required('Endereço é obrigatório'),
  info_bairro: Yup.string().required('Bairro é obrigatório'),
  info_cidade: Yup.string().required('Cidade é obrigatório'),
  info_cep: Yup.string().required('CEP é obrigatório'),
  info_uf: Yup.string().required('UF é obrigatório'),
})

const initialValues = {
  codigo: '',
  nome: '',
  cpf: '',
  dataNascimento: '',
  status: '',
  nomeUsuario: '',
  senhaUsuario: '',
  info_codigo: '',
  info_telefone: '',
  info_email: '',
  info_endereco: '',
  info_bairro: '',
  info_cidade: '',
  info_cep: '',
  info_uf: '',
  atribuicoes: [],
}

const options = {
  headers: { 'content-type': 'application/json' },
}

export default function FormFuncionario({
  cargos,
  onEdit,
  setExibeTabela,
  setOnEdit,
  funcionarios,
  setFuncionarios,
}) {
  const [showModal, setShowModal] = useState(false)

  const handleSubmit = async (values) => {
    const updatedFuncionarios = funcionarios
    if (onEdit) {
      await axios
        .put(`${urlBase}/funcionarios/`, JSON.stringify(values), options)
        .then((response) => {
          const index = updatedFuncionarios.findIndex(
            (i) => i.codigo === onEdit.codigo,
          )
          updatedFuncionarios[index] = values
          setFuncionarios(updatedFuncionarios)
          toast.success(response.data.message)
        })
        .catch(({ response }) => {
          toast.error(response.data.message)
        })
    } else {
      await axios
        .post(`${urlBase}/funcionarios/`, JSON.stringify(values), options)
        .then((response) => {
          formik.setFieldValue('codigo', response.data.id)
          values.codigo = response.data.id
          updatedFuncionarios.push(values)
          setFuncionarios(updatedFuncionarios)
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
        if (key === 'info') {
          for (const key2 in onEdit.info) {
            formik.setFieldValue(`info_${key2}`, onEdit[key][key2])
          }
        } else {
          formik.setFieldValue(key, onEdit[key])
        }
      }
    }
    // eslint-disable-next-line
  }, [onEdit]);

  return (
    <div>
      <Cabecalho2 texto1={'Cadastro'} texto2={'Funcionario'} />
      <Container
        className="my-4 p-3 overflow-auto"
        style={{ maxHeight: '75vh' }}
      >
        <FormikProvider value={formik}>
          <Row>
            <Col sm={2} md={2} lg={2} className="mb-3">
              <FormTextField
                controlId="formFuncionario.codigo"
                label="Código"
                name="codigo"
                isDisabled={true}
              />
            </Col>
            <Col sm={2} md={2} lg={2} className="mb-3">
              <FormTextField
                controlId="formFuncionario.codigo_pessoa"
                name="info_codigo"
                isDisabled={true}
                type="hidden"
              />
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mb-3">
              <FormTextField
                controlId="formFuncionario.nome"
                label="Nome"
                name="nome"
                placeholder="Informe o nome do funcionário"
                required
              />
            </Col>

            <Col md={6} className="mb-3">
              <MaskedFormTextField
                controlId="formFuncionario.cpf"
                label="CPF"
                name="cpf"
                placeholder="Informe o CPF do funcionário"
                format="###.###.###-##"
                mask="_"
                required
              />
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mb-3">
              <FormTextField
                controlId="formFuncionario.dataNascimento"
                label="Data de Nascimento"
                name="dataNascimento"
                type="date"
                required
              />
            </Col>
            <Col md={6} className="mb-3">
              <FormSelectField
                controlId="formFuncionario.status"
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
                <option value="">Selecione o status do funcionário</option>
                <option value="1">Ativo</option>
                <option value="0">Inativo</option>
              </FormSelectField>
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mb-3">
              <NewMultiSelect
                controlId="formFuncionario.atribuicoes"
                name="atribuicoes"
                formRef={formik}
                lista={cargos}
                label="Cargos"
                required
              />
            </Col>

            <Col md={6} className="mb-3">
              <FormTextField
                controlId="formFuncionario.endereco"
                label="Endereço"
                name="info_endereco"
                placeholder="Informe o endereço do funcionário"
                required
              />
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-3">
              <FormTextField
                controlId="formFuncionario.bairro"
                label="Bairro"
                name="info_bairro"
                placeholder="Informe o bairro do funcionário"
                required
              />
            </Col>

            <Col md={6} className="mb-3">
              <FormTextField
                controlId="formFuncionario.cidade"
                label="Cidade"
                name="info_cidade"
                placeholder="Informe o cidade do funcionário"
                required
              />
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-3">
              <FormSelectField
                controlId="formFuncionario.uf"
                label="UF"
                name="info_uf"
                className="mb-3"
                required
              >
                <option value="">Selecione</option>
                <option value="AC">Acre</option>
                <option value="AL">Alagoas</option>
                <option value="AP">Amapá</option>
                <option value="AM">Amazonas</option>
                <option value="BA">Bahia</option>
                <option value="CE">Ceará</option>
                <option value="DF">Distrito Federal</option>
                <option value="ES">Espírito Santo</option>
                <option value="GO">Goiás</option>
                <option value="MA">Maranhão</option>
                <option value="MT">Mato Grosso</option>
                <option value="MS">Mato Grosso do Sul</option>
                <option value="MG">Minas Gerais</option>
                <option value="PA">Pará</option>
                <option value="PB">Paraíba</option>
                <option value="PR">Paraná</option>
                <option value="PE">Pernambuco</option>
                <option value="PI">Piauí</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="RN">Rio Grande do Norte</option>
                <option value="RS">Rio Grande do Sul</option>
                <option value="RO">Rondônia</option>
                <option value="RR">Roraima</option>
                <option value="SC">Santa Catarina</option>
                <option value="SP">São Paulo</option>
                <option value="SE">Sergipe</option>
                <option value="TO">Tocantins</option>
                <option value="EX">Estrangeiro</option>
              </FormSelectField>
            </Col>

            <Col md={6} className="mb-3">
              <MaskedFormTextField
                controlId="formFuncionario.cep"
                label="CEP"
                name="info_cep"
                placeholder="Informe a CEP do funcionário"
                format="#####-###"
                mask="_"
                required
              />
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-3">
              <MaskedFormTextField
                controlId="formFuncionario.telefone"
                label="Telefone"
                name="info_telefone"
                placeholder="Informe o telefone do funcionário"
                format="(##) #####-####"
                mask="_"
                required
              />
            </Col>
            <Col md={6} className="mb-3">
              <FormTextField
                controlId="formFuncionario.email"
                label="E-mail"
                name="info_email"
                placeholder="Informe o e-mail do funcionário"
                required
              />
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-3">
              <FormTextField
                controlId="formFuncionario.nomeUsuario"
                label="Usuário"
                name="nomeUsuario"
                placeholder="Informe um nome de usuário ao funcionário"
                required
              />
            </Col>

            <Col md={6} className="mb-3">
              <FormTextField
                controlId="formFuncionario.senhaUsuario"
                label="Senha"
                name="senhaUsuario"
                type="password"
                placeholder="Informe uma senha de usuário ao funcionário"
                required
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col></Col>
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
