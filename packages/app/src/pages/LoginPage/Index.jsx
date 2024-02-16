// import { Link } from "react-router-dom";
import { Button, Container, Row, Col, Form, Card } from 'react-bootstrap'
import Logo from '../../img/aprata.png'
import 'react-toastify/dist/ReactToastify.css'
import { useContext, useRef } from 'react'
import { AuthContext } from '../../contexts/auth'
import * as Yup from 'yup'
import { Formik } from 'formik'
import FormTextField from '../../components/Form/form-field'

const schema = Yup.object().shape({
  usuario: Yup.string().required('Digite um nome de usuário'),
  senha: Yup.string().required('Digite uma senha'),
})

const initialValues = {
  usuario: '',
  senha: '',
}

// const options = {
//   headers: { "content-type": "application/json" },
// };

const LoginPage = () => {
  const formikRef = useRef()
  const { login } = useContext(AuthContext)

  const handleSubmit = async (values) => {
    login(values.usuario, values.senha) // integração com o contexto / api
  }

  return (
    <div>
      <Container>
        <Row className="vh-100 d-flex justify-content-center align-items-center">
          <Col md={7} lg={5} xs={12}>
            {/* <div className="border border-3 border-primary"></div> */}
            <div
              style={{
                height: '200px',
                backgroundImage: `url(${Logo})`,
                backgroundSize: '100%',
                backgroundRepeat: 'no-repeat',
                backgroundPositionX: 'center',
                backgroundPositionY: 'center',
              }}
            ></div>
            <Card className="shadow mt-5">
              <Card.Body>
                <div className="mb-3 mt-md-3">
                  {/* <h2 className="fw-bold mb-2 text-uppercase ">Brand</h2> */}
                  {/* <p className=" mb-4 text-center">
                    Acesse a sua conta
                  </p> */}
                  <div className="mb-3">
                    <Formik
                      innerRef={formikRef}
                      validationSchema={schema}
                      onSubmit={handleSubmit}
                      initialValues={initialValues}
                      validateOnBlur={false}
                      validateOnChange={false}
                    >
                      {({ handleSubmit, values }) => (
                        <Form noValidate onSubmit={handleSubmit}>
                          <Row className="mb-3">
                            <FormTextField
                              controlId="formLogin.usuario"
                              label="Nome de usuário"
                              name="usuario"
                              value={values.usuario}
                            />
                          </Row>
                          <Row className="mb-3">
                            <FormTextField
                              controlId="formLogin.senha"
                              label="Senha"
                              name="senha"
                              value={values.senha}
                              type="password"
                            />
                          </Row>
                          <Row>
                            <p className="small">
                              <a className="text-primary" href="#!">
                                Esqueceu a senha?
                              </a>
                            </p>
                          </Row>

                          <div className="d-grid">
                            <Button variant="primary" type="submit">
                              Entrar
                            </Button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                    {/* <div className="mt-3">
                      <p className="mb-0  text-center">
                        Don't have an account?{" "}
                        <a href="{''}" className="text-primary fw-bold">
                          Sign Up
                        </a>
                      </p>
                    </div> */}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default LoginPage
