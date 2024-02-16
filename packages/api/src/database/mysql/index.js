import mysql from 'mysql2/promise'

export default async function conectar() {
  if (global.conexao && global.conexao.state !== 'disconnected') {
    return global.conexao
  }

  const conn = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'aprata',
    dateStrings: 'date',
  })

  global.conexao = conn
  return conn
}
