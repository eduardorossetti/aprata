import CursoBD from '../repository/CursoRepository.js'

export default class Curso {
  #codigo
  #nome
  #sala
  #eixo
  #cargaHoras
  #status

  constructor(codigo, nome, sala, eixo, cargaHoras, status) {
    this.#codigo = codigo
    this.#nome = nome
    this.#sala = sala
    this.#eixo = eixo
    this.#cargaHoras = cargaHoras
    this.#status = status
  }

  get codigo() {
    return this.#codigo
  }

  get nome() {
    return this.#nome
  }

  set nome(novoNome) {
    this.#nome = novoNome
  }

  get sala() {
    return this.#sala
  }

  set sala(novoSala) {
    this.#sala = novoSala
  }

  get eixo() {
    return this.#eixo
  }

  set eixo(novoEixo) {
    this.#eixo = novoEixo
  }

  get cargaHoras() {
    return this.#cargaHoras
  }

  set cargaHoras(novocargaHoras) {
    this.#cargaHoras = novocargaHoras
  }

  get status() {
    return this.#status
  }

  set status(novoStatus) {
    this.#status = novoStatus
  }

  toJSON() {
    return {
      codigo: this.#codigo,
      nome: this.#nome,
      sala: this.#sala,
      eixo: this.#eixo,
      cargaHoras: this.#cargaHoras,
      status: this.#status,
    }
  }

  async gravar() {
    const cursoBD = new CursoBD()
    const lastInsertedId = await cursoBD.gravar(this)
    return lastInsertedId
  }

  async atualizar() {
    const cursoBD = new CursoBD()
    await cursoBD.atualizar(this)
  }

  async excluir() {
    const cursoBD = new CursoBD()
    await cursoBD.excluir(this)
  }

  async consultar() {
    const cursoBD = new CursoBD()
    const cursos = await cursoBD.consultar()
    return cursos
  }
}
