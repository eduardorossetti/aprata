import Funcionario from '../models/Funcionario.js'
import PessoaInfo from '../models/Pessoa.js'
import Cargo from '../models/Cargo.js'
import conectar from '../database/mysql/index.js'
import bcrypt, { hash } from 'bcrypt'

export default class FuncionarioBD {
  async gravar(funcionario) {
    if (funcionario instanceof Funcionario) {
      const conexao = await conectar()
      let conn = null
      let lastInsertedId = null
      const currentDate = new Date()
      const formattedDate = currentDate.toISOString().slice(0, 10)

      try {
        conn = await conexao.getConnection()
        await conn.beginTransaction()

        const [responsePessoa] = await conn.query(
          `INSERT INTO pessoa_info (telefone, email, endereco,
            bairro, cidade, cep, uf) VALUES (?,?,?,?,?,?,?)`,
          [
            funcionario.info.telefone,
            funcionario.info.email,
            funcionario.info.endereco,
            funcionario.info.bairro,
            funcionario.info.cidade,
            funcionario.info.cep,
            funcionario.info.uf,
          ],
        )

        const senhaCripto = await hash(funcionario.senhaUsuario, 8)

        const [responseFuncionario] = await conn.query(
          `INSERT INTO funcionario (nome, cpf, data_nascimento,
            status, nome_usuario, senha_usuario, pessoa_info_codigo)
            VALUES (?,?,?,?,?,?,?)`,
          [
            funcionario.nome,
            funcionario.cpf,
            funcionario.dataNascimento,
            funcionario.status,
            funcionario.nomeUsuario,
            senhaCripto,
            responsePessoa.insertId,
          ],
        )

        for (const atribuicao of funcionario.atribuicoes) {
          await conn.query(
            `INSERT INTO atribuicao (funcionario_codigo, cargo_codigo, data_atribuicao) VALUES (?, ?, ?)`,
            [responseFuncionario.insertId, atribuicao.codigo, formattedDate],
          )
        }

        await conn.commit()

        lastInsertedId = responseFuncionario.insertId
      } catch (error) {
        if (conn) await conn.rollback()
        throw error
      } finally {
        if (conn) conn.release()
      }
      return lastInsertedId
    }
  }

  async atualizar(funcionario) {
    if (funcionario instanceof Funcionario) {
      const conexao = await conectar()
      let conn = null
      const currentDate = new Date()
      const formattedDate = currentDate.toISOString().slice(0, 10)

      try {
        conn = await conexao.getConnection()
        await conn.beginTransaction()

        await conn.query(
          `UPDATE pessoa_info SET telefone=?, email=?, endereco=?, bairro=?, cidade=?,
          cep=?, uf=? WHERE codigo=?`,
          [
            funcionario.info.telefone,
            funcionario.info.email,
            funcionario.info.endereco,
            funcionario.info.bairro,
            funcionario.info.cidade,
            funcionario.info.cep,
            funcionario.info.uf,
            funcionario.info.codigo,
          ],
        )

        await conn.query(
          `UPDATE funcionario SET nome=?, cpf=?, data_nascimento=?, status=?, nome_usuario=?, senha_usuario=? WHERE codigo=?`,
          [
            funcionario.nome,
            funcionario.cpf,
            funcionario.dataNascimento,
            funcionario.status,
            funcionario.nomeUsuario,
            funcionario.senhaUsuario,
            funcionario.codigo,
          ],
        )

        await conn.query(
          `DELETE FROM atribuicao WHERE funcionario_codigo=?`,
          funcionario.codigo,
        )

        for (const atribuicao of funcionario.atribuicoes) {
          await conn.query(
            `INSERT INTO atribuicao (funcionario_codigo, cargo_codigo, data_atribuicao) VALUES (?, ?, ?)`,
            [funcionario.codigo, atribuicao.codigo, formattedDate],
          )
        }

        await conn.commit()
      } catch (error) {
        if (conn) await conn.rollback()
        throw error
      } finally {
        if (conn) conn.release()
      }
    }
  }

  async excluir(funcionario) {
    if (funcionario instanceof Funcionario) {
      const conexao = await conectar()
      let conn = null

      try {
        conn = await conexao.getConnection()
        await conn.beginTransaction()

        const [response] = await conn.query(
          'SELECT pessoa_info_codigo FROM funcionario WHERE codigo=?',
          funcionario.codigo,
        )

        await conn.query('DELETE FROM atribuicao WHERE funcionario_codigo=?', [
          funcionario.codigo,
        ])

        await conn.query(
          'DELETE FROM funcionario WHERE codigo=?',
          funcionario.codigo,
        )

        await conn.query(
          'DELETE FROM pessoa_info WHERE codigo=?',
          response[0].pessoa_info_codigo,
        )

        await conn.commit()
      } catch (error) {
        if (conn) await conn.rollback()
        throw error
      } finally {
        if (conn) conn.release()
      }
    }
  }

  async consultar() {
    const conexao = await conectar()

    const sql = `SELECT 
                f.codigo 'codigo_funcionario',
                f.nome,
                f.cpf,
                f.data_nascimento,
                f.status,
                f.nome_usuario,
                f.senha_usuario,
                i.codigo 'info_codigo',
                i.telefone,
                i.email,
                i.endereco,
                i.bairro,
                i.cidade,
                i.cep,
                i.uf,
                CONCAT('[',
                        GROUP_CONCAT(DISTINCT JSON_OBJECT('codigo', c.codigo, 'nome', c.nome)),
                        ']') AS atribuicoes
                FROM
                pessoa_info i
                        JOIN     
                    funcionario f ON i.codigo = f.pessoa_info_codigo
                        LEFT JOIN
                    atribuicao a ON f.codigo = a.funcionario_codigo
                        LEFT JOIN
                    cargo c ON a.cargo_codigo = c.codigo
                GROUP BY f.codigo
                ORDER BY f.nome`

    const [rows] = await conexao.query(sql)
    const funcionarios = []

    for (const row of rows) {
      const atribuicoes = []

      for (const item of JSON.parse(row.atribuicoes)) {
        const cargo = new Cargo(item.codigo, item.nome)
        atribuicoes.push(cargo)
      }

      const info = new PessoaInfo(
        row.info_codigo,
        row.telefone,
        row.email,
        row.endereco,
        row.bairro,
        row.cidade,
        row.cep,
        row.uf,
      )

      const funcionario = new Funcionario(
        row.codigo_funcionario,
        row.nome,
        row.cpf,
        row.data_nascimento,
        row.status,
        row.nome_usuario,
        row.senha_usuario,
        info,
        atribuicoes,
      )
      funcionarios.push(funcionario)
    }
    return funcionarios
  }

  async consultarProfessores() {
    const conexao = await conectar()

    const sql = `SELECT f.* FROM funcionario f
                  JOIN atribuicao a ON f.codigo = a.funcionario_codigo
                  JOIN cargo c ON a.cargo_codigo = c.codigo
                WHERE c.nome = "PROFESSOR"`

    const [rows] = await conexao.query(sql)
    const funcionarios = []

    for (const row of rows) {
      const funcionario = new Funcionario(row.codigo, row.nome)
      funcionarios.push(funcionario)
    }
    return funcionarios
  }

  async consultarOrientadores() {
    const conexao = await conectar()

    const sql = `SELECT f.* FROM funcionario f
                  JOIN atribuicao a ON f.codigo = a.funcionario_codigo
                  JOIN cargo c ON a.cargo_codigo = c.codigo
                WHERE c.nome = "ORIENTADOR"`

    const [rows] = await conexao.query(sql)
    const funcionarios = []

    for (const row of rows) {
      const funcionario = new Funcionario(row.codigo, row.nome)
      funcionarios.push(funcionario)
    }
    return funcionarios
  }

  async autenticar(usuario, senha) {
    const conexao = await conectar()

    const sql = `SELECT nome_usuario, senha_usuario FROM funcionario WHERE nome_usuario = ?`
    const params = [usuario]
    const [rows] = await conexao.query(sql, params)

    if (rows && rows.length === 1) {
      const senhaUsuario = rows[0].senha_usuario

      const senhaValida = await bcrypt.compare(senha, senhaUsuario)

      if (senhaValida) {
        const sqlRoles = `SELECT car.nome as cargo
                              FROM funcionario fun
                              INNER JOIN atribuicao atr ON atr.funcionario_codigo = fun.codigo
                              INNER JOIN cargo car ON car.codigo = atr.cargo_codigo
                              WHERE fun.nome_usuario = ?`

        const [rolesRows] = await conexao.query(sqlRoles, [usuario])

        const user = {
          username: usuario,
          roles: rolesRows.map((row) => row.cargo),
        }
        return user
      }
    }
    return false
  }
}
