export default class Vinculacao {
  #codigo
  #dataVinculacao
  #status
  #aluno

  constructor(codigo, dataVinculacao, status, aluno) {
    this.#codigo = codigo
    this.#dataVinculacao = dataVinculacao
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

  get dataVinculacao() {
    return this.#dataVinculacao
  }

  set dataVinculacao(dataVinculacao) {
    this.#dataVinculacao = dataVinculacao
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
      dataVinculacao: this.#dataVinculacao,
      status: this.#status,
      aluno: this.#aluno,
    }
  }
}
