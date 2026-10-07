export class GymUserAlreadyExistsError extends Error {
  constructor() {
    super('Usuário já existe.');
  }
}

export class GymUserPersistenceError extends Error {
  constructor(cause?: unknown) {
    super('Erro de persistência.', { cause });
  }
}
