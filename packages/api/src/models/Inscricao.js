export default class Inscricao {
  #codigo
  #dataInscricao
  #status
  #aluno
  constructor(codigo, dataInscricao, status, aluno) {
    this.#codigo = codigo
    this.#dataInscricao = dataInscricao
    this.#status = status
    this.#aluno = aluno
  }

  get codigo() {
    return this.#codigo
  }

  set codigo(codigo) {
    this.#codigo = codigo
  }

  get aluno() {
    return this.#aluno
  }

  set aluno(aluno) {
    this.#aluno = aluno
  }

  get dataInscricao() {
    return this.#dataInscricao
  }

  set dataInscricao(dataInscricao) {
    this.#dataInscricao = dataInscricao
  }

  get status() {
    return this.#status
  }

  set status(status) {
    this.#status = status
  }

  toJSON() {
    return {
      codigo: this.#codigo,
      dataInscricao: this.#dataInscricao,
      status: this.#status,
      aluno: this.#aluno,
    }
  }
}
