import styled from 'styled-components'

const Icon = styled.div`
  border: 1px solid #ced4da;
  border-radius: 7.5px;
  width: 85px;
  height: 85px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* margin: 5px; */
  background-color: #e9ecef;
  &:hover {
    cursor: pointer;
  }
  &:active {
    margin-left: 2px;
    margin-top: 2px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    text-align: center;
  }
  li:first-child {
    font-size: 2rem;
    color: #0d6efd;
  }
  li:last-child {
    color: #0d6efd;
    font-weight: light;
  }
`

const HomePageIcon = ({ name, icon }) => {
  return (
    <Icon>
      <ul>
        <li>
          <i className={icon}></i>
        </li>
        <li>{name}</li>
      </ul>
    </Icon>
  )
}

export default HomePageIcon
