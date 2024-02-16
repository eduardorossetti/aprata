import conectar from '../database/mysql/index.js'
import Aluno from '../models/Aluno.js'
import PessoaInfo from '../models/Pessoa.js'
import RelatorioAprendiz from '../models/RelatorioAprendiz.js'

export default class AlunoBD {
  async gravar(aluno) {
    if (aluno instanceof Aluno) {
      const conexao = await conectar()
      let conn = null
      let lastInsertedId = null

      try {
        conn = await conexao.getConnection()
        await conn.beginTransaction()

        const [responsePessoa] = await conn.query(
          `INSERT INTO pessoa_info (telefone, email, endereco,
            bairro, cidade, cep, uf) VALUES (?,?,?,?,?,?,?)`,
          [
            aluno.info.telefone,
            aluno.info.email,
            aluno.info.endereco,
            aluno.info.bairro,
            aluno.info.cidade,
            aluno.info.cep,
            aluno.info.uf,
          ],
        )

        const [responseAluno] = await conn.query(
          `INSERT INTO aluno (nome, rg, cpf, nome_mae, data_nascimento, escola,
            serie, periodo, status, pessoa_info_codigo) VALUES (?,?,?,?,?,?,?,?,?,?)`,
          [
            aluno.nome,
            aluno.rg,
            aluno.cpf,
            aluno.nomeMae,
            aluno.dataNascimento,
            aluno.escola,
            aluno.serie,
            aluno.periodo,
            aluno.status,
            responsePessoa.insertId,
          ],
        )
        await conn.commit()

        lastInsertedId = responseAluno.insertId
      } catch (error) {
        if (conn) await conn.rollback()
        throw error
      } finally {
        if (conn) conn.release()
      }

      return lastInsertedId
    }
  }

  async atualizar(aluno) {
    if (aluno instanceof Aluno) {
      const conexao = await conectar()
      let conn = null

      try {
        conn = await conexao.getConnection()
        await conn.beginTransaction()

        await conn.query(
          `UPDATE pessoa_info SET telefone=?, email=?, endereco=?, bairro=?,
          cidade=?, cep=?, uf=? WHERE codigo=?`,
          [
            aluno.info.telefone,
            aluno.info.email,
            aluno.info.endereco,
            aluno.info.bairro,
            aluno.info.cidade,
            aluno.info.cep,
            aluno.info.uf,
            aluno.info.codigo,
          ],
        )

        await conn.query(
          `UPDATE aluno SET nome=?, rg=?, cpf=?, nome_mae=?, data_nascimento=?,
          escola=?, serie=?, periodo=?, status=? WHERE codigo=?`,
          [
            aluno.nome,
            aluno.rg,
            aluno.cpf,
            aluno.nomeMae,
            aluno.dataNascimento,
            aluno.escola,
            aluno.serie,
            aluno.periodo,
            aluno.status,
            aluno.codigo,
          ],
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

  async excluir(aluno) {
    if (aluno instanceof Aluno) {
      const conexao = await conectar()
      let conn = null

      try {
        conn = await conexao.getConnection()
        await conn.beginTransaction()

        const [response] = await conn.query(
          'SELECT pessoa_info_codigo FROM aluno WHERE codigo=?',
          aluno.codigo,
        )

        await conn.query(
          `DELETE FROM aluno WHERE pessoa_info_codigo=?`,
          aluno.codigo,
        )

        await conn.query(
          `DELETE FROM pessoa_info WHERE codigo=?`,
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
          a.codigo as codigo_aluno,
          a.nome,
          a.rg,
          a.cpf,
          a.nome_mae,
          a.data_nascimento,
          a.escola,
          a.serie,
          a.periodo,
          a.status,
          i.codigo as info_codigo,
          i.telefone,
          i.email,
          i.endereco,
          i.bairro,
          i.cidade,
          i.cep,
          i.uf
          FROM pessoa_info i
          JOIN aluno a ON i.codigo = a.pessoa_info_codigo
          GROUP BY a.codigo
          ORDER BY a.nome;`

    const [rows] = await conexao.query(sql)
    const alunos = []

    for (const row of rows) {
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

      const aluno = new Aluno(
        row.codigo_aluno,
        row.nome,
        row.rg,
        row.cpf,
        row.nome_mae,
        row.data_nascimento,
        row.escola,
        row.serie,
        row.periodo,
        row.status,
        info,
      )

      alunos.push(aluno)
    }
    return alunos
  }

  async matricular(aluno) {
    const conexao = await conectar()
    let conn = null
    const currentDate = new Date()
    const formattedDate = currentDate.toISOString().slice(0, 10)
    try {
      conn = await conexao.getConnection()

      for (const codigo of aluno.codigo) {
        await conn.query(`UPDATE aluno SET data_matricula=? WHERE codigo=?`, [
          formattedDate,
          codigo,
        ])
      }
    } catch (error) {
      throw new Error(`Erro ao matricular o aluno: ${error}`)
    } finally {
      if (conn) conn.release()
    }
  }

  async consultarNaoMatriculados() {
    try {
      const conexao = await conectar()
      const sql = `SELECT 
            a.codigo as codigo_aluno,
            a.nome,
            a.rg,
            a.cpf,
            a.nome_mae,
            a.data_nascimento,
            a.escola,
            a.serie,
            a.periodo,
            a.status,
            i.codigo as info_codigo,
            i.telefone,
            i.email,
            i.endereco,
            i.bairro,
            i.cidade,
            i.cep,
            i.uf
            FROM pessoa_info i
            JOIN aluno a ON i.codigo = a.pessoa_info_codigo
            WHERE a.data_matricula IS NULL AND a.status = '1'
            ORDER BY a.nome;`

      const [rows] = await conexao.query(sql)
      const alunosNaoMatriculados = []
      for (const row of rows) {
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

        const aluno = new Aluno(
          row.codigo_aluno,
          row.nome,
          row.rg,
          row.cpf,
          row.nome_mae,
          row.data_nascimento,
          row.escola,
          row.serie,
          row.periodo,
          row.status,
          info,
        )
        alunosNaoMatriculados.push(aluno)
      }
      return alunosNaoMatriculados
    } catch (error) {
      console.error('Ocorreu um erro:', error)
      throw error
    }
  }

  async consultarMatriculados() {
    try {
      const conexao = await conectar()
      const sql = `SELECT 
            a.codigo as codigo_aluno,
            a.nome,
            a.rg,
            a.cpf,
            a.nome_mae,
            a.data_nascimento,
            a.escola,
            a.serie,
            a.periodo,
            a.status,
            a.data_matricula,
            i.codigo as info_codigo,
            i.telefone,
            i.email,
            i.endereco,
            i.bairro,
            i.cidade,
            i.cep,
            i.uf
            FROM pessoa_info i
            JOIN aluno a ON i.codigo = a.pessoa_info_codigo
            WHERE a.data_matricula IS NOT NULL AND a.status = '1'
            ORDER BY a.nome;`

      const [rows] = await conexao.query(sql)
      const alunosNaoMatriculados = []
      for (const row of rows) {
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

        const aluno = new Aluno(
          row.codigo_aluno,
          row.nome,
          row.rg,
          row.cpf,
          row.nome_mae,
          row.data_nascimento,
          row.escola,
          row.serie,
          row.periodo,
          row.status,
          info,
          row.data_matricula,
        )
        alunosNaoMatriculados.push(aluno)
      }
      return alunosNaoMatriculados
    } catch (error) {
      console.error('Ocorreu um erro:', error)
      throw error
    }
  }

  async gravarRelatorio(aluno, relatorio) {
    if (aluno instanceof Aluno) {
      const conexao = await conectar()
      let conn = null
      let lastInsertedId = null

      try {
        conn = await conexao.getConnection()
        await conn.beginTransaction()
        const [responseFuncionario] = await conn.query(
          'select codigo from funcionario where nome_usuario = ?',
          [relatorio.codigoFuncionario],
        )
        const [responseRelatorio] = await conn.query(
          'INSERT INTO relatorio_aprendiz (funcionario_codigo, aluno_codigo, data_relatorio, conteudo, titulo) VALUES (?, ?, ?, ?, ?)',
          [
            responseFuncionario[0].codigo,
            aluno.codigo,
            relatorio.dataRelatorio,
            relatorio.conteudo,
            relatorio.titulo,
          ],
        )
        await conn.commit()

        lastInsertedId = responseRelatorio.insertId

        lastInsertedId = responseRelatorio.insertId
      } catch (error) {
        if (conn) await conn.rollback()
        throw error
      } finally {
        if (conn) conn.release()
      }

      return lastInsertedId
    }
  }

  async atualizarRelatorio(aluno, relatorio) {
    const conexao = await conectar()
    const sql =
      'UPDATE relatorio_aprendiz SET aluno_codigo=?, data_relatorio=?, conteudo=?, titulo=? WHERE codigo=?'
    await conexao.query(sql, [
      aluno.codigo,
      relatorio.dataRelatorio,
      relatorio.conteudo,
      relatorio.titulo,
      relatorio.codigoRelatorio,
    ])
  }

  async excluirRelatorio(codigoRelatorio) {
    const conexao = await conectar()
    const sql = 'DELETE FROM relatorio_aprendiz WHERE codigo=?'
    await conexao.query(sql, [codigoRelatorio])
  }

  async consultarRelatorios() {
    const conexao = await conectar()
    const sql = `
                 SELECT 
                      r.codigo "codigo_relatorio",
                      r.data_relatorio,
                      r.titulo "titulo_relatorio",
                      r.conteudo "relatorio",
                      a.codigo 'codigo_aluno',
                      a.nome,
                      a.rg,
                      a.cpf,
                      a.nome_mae,
                      a.data_nascimento,
                      a.escola,
                      a.serie,
                      a.periodo,
                      a.status,
                      a.data_matricula,
                      p.codigo 'codigo_pessoa',
                      p.telefone,
                      p.email,
                      p.endereco,
                      p.bairro,
                      p.cidade,
                      p.cep,
                      p.uf
                FROM relatorio_aprendiz r 
                JOIN aluno a ON r.aluno_codigo = a.codigo
                LEFT JOIN pessoa_info p ON a.pessoa_info_codigo = p.codigo
    `
    const [rows] = await conexao.query(sql)
    const relatorios = []
    for (const row of rows) {
      const info = new PessoaInfo(
        row.codigo_pessoa,
        row.telefone,
        row.email,
        row.endereco,
        row.bairro,
        row.cidade,
        row.cep,
        row.uf,
      )

      const aluno = new Aluno(
        row.codigo_aluno,
        row.nome,
        row.rg,
        row.cpf,
        row.nome_mae,
        row.data_nascimento,
        row.escola,
        row.serie,
        row.periodo,
        row.status,
        info,
        row.data_matricula,
      )

      const relatorio = new RelatorioAprendiz(
        row.codigo_relatorio,
        row.data_relatorio,
        row.titulo_relatorio,
        row.relatorio,
        aluno,
      )
      relatorios.push(relatorio)
    }

    return relatorios
  }
}
