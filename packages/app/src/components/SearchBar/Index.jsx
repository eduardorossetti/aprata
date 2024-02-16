import { useEffect, useRef, useState } from 'react'
import { BiSearch } from 'react-icons/bi'
import { FaTimes } from 'react-icons/fa'
import '../styles/searchbar.css'
import { Form, InputGroup, Col, Button } from 'react-bootstrap'
import useOutsideAlerter from '../useOutsideAlerter'

const SearchBar = ({
  label,
  name,
  type,
  required,
  data,
  keyField,
  searchField,
  setValue,
}) => {
  const [search, setSearch] = useState('')
  const [list, setList] = useState(data)
  const [show, setShow] = useState(false)
  const [inputText, setInputText] = useState('')
  const wrapperRef = useRef(null)
  const inputRef = useRef(null)

  // Aciona um evento de click fora do componente
  useOutsideAlerter(wrapperRef, inputRef, setShow, setSearch)

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
    <div>
      <Form.Control disabled hidden />
      <Form.Group className="select">
        <Form.Label>
          {label}
          {required && <span style={{ color: 'red' }}>*</span>}
        </Form.Label>
        <Form.Control
          ref={inputRef}
          className="searchbar"
          // {...field}
          type={type}
          onClick={() => setShow(!show)}
          placeholder={'Selecione ' + [name]}
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
            name={name}
            setInputText={setInputText}
            setShow={setShow}
            setValue={setValue}
          />
        )}
      </Form.Group>
    </div>
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
  setInputText,
  setShow,
  setValue,
}) => {
  return (
    <Col
      xs={12}
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
        <Button
          variant="secondary"
          onClick={() => {
            setValue(null)
            setInputText('')
          }}
        >
          <FaTimes />
        </Button>
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
                  setShow(false)
                  setValue(item[keyField])
                }}
              >
                {keyField === searchField
                  ? item[keyField]
                  : item[keyField] + ' - ' + item[searchField]}
              </li>
            )
          })}
        </ul>
      </div>
    </Col>
  )
}

export default SearchBar
