export default class RelatorioAprendiz {
  #codigo
  #dataRelatorio
  #titulo
  #conteudo
  #aluno

  constructor(codigo, dataRelatorio, titulo, conteudo, aluno) {
    this.#codigo = codigo
    this.#dataRelatorio = dataRelatorio
    this.#titulo = titulo
    this.#conteudo = conteudo
    this.#aluno = aluno
  }

  get codigo() {
    return this.#codigo
  }

  set codigo(codigo) {
    this.#codigo = codigo
  }

  get dataRelatorio() {
    return this.#dataRelatorio
  }

  set dataRelatorio(dataRelatorio) {
    this.#dataRelatorio = dataRelatorio
  }

  get titulo() {
    return this.#titulo
  }

  set titulo(titulo) {
    this.#titulo = titulo
  }

  get conteudo() {
    return this.#conteudo
  }

  set conteudo(conteudo) {
    this.#conteudo = conteudo
  }

  get aluno() {
    return this.#aluno
  }

  set aluno(aluno) {
    this.#aluno = aluno
  }

  toJSON() {
    return {
      codigo: this.#codigo,
      dataRelatorio: this.#dataRelatorio,
      titulo: this.#titulo,
      conteudo: this.#conteudo,
      aluno: this.#aluno,
    }
  }
}
