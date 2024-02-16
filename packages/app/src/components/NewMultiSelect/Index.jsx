import { Field, FieldArray } from 'formik'
import { useEffect, useRef, useState } from 'react'
import { Form, Row, Col, Button, InputGroup } from 'react-bootstrap'
import { BiSearch } from 'react-icons/bi'
import useOutsideAlerter from '../useOutsideAlerter'
import '../styles/multiselect.css'
import { AiOutlineClose, AiOutlineUsergroupAdd } from 'react-icons/ai'

// function useOutsideAlerter(ref, inputRef, setShow, setSearch) {
//   useEffect(() => {
//     /**
//      * Alert if clicked on outside of element
//      */
//     function handleClickOutside(event) {
//       if (
//         ref.current &&
//         !ref.current.contains(event.target) &&
//         !inputRef.current.contains(event.target)
//       ) {
//         setShow(false);
//         setSearch("");
//       }
//     }
//     // Bind the event listener
//     document.addEventListener("click", handleClickOutside);
//     return () => {
//       // Unbind the event listener on clean up
//       document.removeEventListener("click", handleClickOutside);
//     };
//   }, [ref, inputRef, setShow, setSearch]);
// }

const NewMultiSelect = ({
  name,
  formRef,
  lista,
  controlId,
  label,
  required,
}) => {
  const [newValue, setNewValue] = useState({ codigo: '', nome: '' })
  const [show, setShow] = useState(false)
  const [search, setSearch] = useState('')
  const [list, setList] = useState(lista)
  const wrapperRef = useRef(null)
  const inputRef = useRef(null)

  // Aciona um evento de click fora do componente
  useOutsideAlerter(wrapperRef, inputRef, setShow, setSearch)

  useEffect(() => {
    if (lista.length >= 1) {
      setList(
        lista.filter((item) => {
          return item.nome.toLowerCase().includes(search.toLowerCase())
        }),
      )
    }
  }, [lista, search])

  return (
    <>
      <Field name={name}>
        {({ field, form }) => {
          const isValid = !form.errors[field.name]
          const isInvalid = form.touched[field.name] && !isValid

          return (
            <Form.Group controlId={controlId} className="multi-select">
              <Form.Label>
                {label}
                {required && <span style={{ color: 'red' }}>*</span>}
              </Form.Label>
              <Row>
                <Col>
                  <Form.Control
                    {...field}
                    ref={inputRef}
                    isValid={form.touched[field.name] && isValid}
                    isInvalid={isInvalid}
                    feedback={form.errors[field.name]}
                    type="text"
                    value={newValue.nome}
                    placeholder="-- Selecione um item --"
                    readOnly
                    onClick={() => setShow(true)}
                  />
                </Col>
                <Col xs="auto">
                  <Button
                    disabled={newValue.codigo === ''}
                    onClick={() => {
                      const newItem = [...form.values[name], newValue]
                      form.setFieldValue(name, newItem)
                      setNewValue({ codigo: '', nome: '' })
                      // setShow(!show);
                    }}
                  >
                    <AiOutlineUsergroupAdd size={20} />
                  </Button>
                </Col>
              </Row>

              {show && (
                <Col
                  className="search p-2 rounded"
                  xs={12}
                  md="auto"
                  ref={wrapperRef}
                >
                  {/* Input de pesquisa */}
                  <InputGroup className="p-1">
                    <InputGroup.Text>
                      <BiSearch />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </InputGroup>
                  <div className="search-result">
                    <ul>
                      {list.map((item1, i) => {
                        const exists = form.values[name].some(
                          (item2) => item2.codigo === item1.codigo,
                        )
                        return (
                          <li
                            className={`search-result-item ${
                              exists ? 'disabled' : ''
                            }`}
                            key={i}
                            onClick={() => {
                              if (!exists) {
                                setNewValue({
                                  codigo: item1.codigo,
                                  nome: item1.nome,
                                })
                                setSearch('')
                                setShow(!show)
                              }
                            }}
                          >
                            {item1.nome}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </Col>
              )}
              <Form.Control.Feedback
                type="invalid"
                className={isInvalid ? 'd-block' : 'd-none'}
              >
                {form.errors[field.name]}
              </Form.Control.Feedback>
            </Form.Group>
          )
        }}
      </Field>

      <FieldArray
        name={name}
        render={(arrayHelpers) => (
          <div>
            <div>
              {formRef.values[name].map(({ nome }, index) => (
                <span
                  key={index}
                  className="border rounded d-inline-flex align-items-center px-2 m-1"
                >
                  {nome}
                  <AiOutlineClose
                    size={15}
                    title="Excluir"
                    className="ms-1 delete-icon"
                    onClick={() => {
                      arrayHelpers.remove(index)
                    }}
                  />
                </span>
              ))}
            </div>
          </div>
        )}
      />
    </>
  )
}

export default NewMultiSelect
