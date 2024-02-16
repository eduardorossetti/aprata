import { useEffect, useRef, useState } from 'react'
import { BiSearch } from 'react-icons/bi'
import '../styles/searchbar.css'
import { Field } from 'formik'
import { Form, InputGroup, Col } from 'react-bootstrap'
import useOutsideAlerter from '../useOutsideAlerter'

const SearchBar = ({
  controlId,
  label,
  name,
  type,
  required,
  data,
  keyField,
  searchField,
  formRef,
  selected,
}) => {
  const [search, setSearch] = useState('')
  const [list, setList] = useState(data)
  const [show, setShow] = useState(false)
  const [inputText, setInputText] = useState('')
  const wrapperRef = useRef(null)
  const inputRef = useRef(null)

  // Aciona um evento de click fora do componente
  useOutsideAlerter(wrapperRef, inputRef, setShow, setSearch)

  useEffect(() => {
    if (selected) {
      setInputText(selected[searchField])
    }
  }, [selected, searchField])

  // Sempre que o valor da pesquisa for alterado
  // A lista será filtrada
  useEffect(() => {
    if (data.length >= 1) {
      setList(
        data.filter((item) => {
          return item[searchField].toLowerCase().includes(search.toLowerCase())
        }),
      )
    }
  }, [data, searchField, search])

  return (
    <>
      <Field name={name}>
        {({ field, form }) => {
          const isValid = !form.errors[field.name]
          const isInvalid = form.touched[field.name] && !isValid
          return (
            <div>
              <Form.Control {...field} disabled hidden />
              <Form.Group controlId={controlId} className="select">
                <Form.Label>
                  {label}
                  {required && <span style={{ color: 'red' }}>*</span>}
                </Form.Label>
                <Form.Control
                  ref={inputRef}
                  className="searchbar"
                  // {...field}
                  type={type}
                  isValid={form.touched[field.name] && isValid}
                  isInvalid={isInvalid}
                  feedback={form.errors[field.name]}
                  onClick={() => setShow(!show)}
                  placeholder={'-- Selecione um item --'}
                  value={inputText || ''}
                  readOnly
                />

                {/* Box de busca e seleção */}
                {show && (
                  <SearchList
                    wrapperRef={wrapperRef}
                    search={search}
                    setSearch={setSearch}
                    list={list}
                    keyField={keyField}
                    searchField={searchField}
                    formRef={formRef}
                    name={name}
                    setInputText={setInputText}
                    setShow={setShow}
                  />
                )}
                <Form.Control.Feedback type="invalid">
                  {form.errors[field.name]}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
          )
        }}
      </Field>
    </>
  )
}

SearchBar.defaultProps = {
  type: 'text',
}

const SearchList = ({
  wrapperRef,
  search,
  setSearch,
  list,
  keyField,
  searchField,
  formRef,
  name,
  setInputText,
  setShow,
}) => {
  return (
    <Col
      xs={5}
      // md="auto"
      className="search p-2 rounded"
      ref={wrapperRef}
    >
      {/* Input de pesquisa */}
      <InputGroup className="p-1">
        <InputGroup.Text>
          <BiSearch />
        </InputGroup.Text>
        <Form.Control
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>
      {/* Lista de resultados da busca */}
      <div className="search-result">
        <ul>
          {list.map((item, i) => {
            return (
              <li
                key={i}
                onClick={() => {
                  setInputText(item[searchField])
                  formRef.setFieldValue(name, item[keyField])
                  setShow(false)
                }}
              >
                {item[keyField] + ' - ' + item[searchField]}
              </li>
            )
          })}
        </ul>
      </div>
    </Col>
  )
}

export default SearchBar
