export default class Frequencia {
  #codigo
  #turma
  #aluno
  #curso
  #dataFalta

  constructor(codigo, turma, aluno, curso, dataFalta) {
    this.#codigo = codigo
    this.#turma = turma
    this.#aluno = aluno
    this.#curso = curso
    this.#dataFalta = dataFalta
  }

  get codigo() {
    return this.#codigo
  }

  get turma() {
    return this.#turma
  }

  set turma(turma) {
    this.#turma = turma
  }

  get aluno() {
    return this.#aluno
  }

  set aluno(aluno) {
    this.#aluno = aluno
  }

  get curso() {
    return this.#curso
  }

  set curso(curso) {
    this.#curso = curso
  }

  get dataFalta() {
    return this.#dataFalta
  }

  set dataFalta(dataFalta) {
    this.#dataFalta = dataFalta
  }

  toJSON() {
    return {
      codigo: this.#codigo,
      turma: this.#turma,
      aluno: this.#aluno,
      curso: this.#curso,
      dataFalta: this.#dataFalta,
    }
  }
}
