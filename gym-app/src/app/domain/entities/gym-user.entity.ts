export type GymUserType = 'gymMember' | 'personalTrainer';

type GymUserParams = {
  name: string;
  email: string;
  type: GymUserType;
  cpf: string;
  id?: string;
  personalTrainerId?: string;
};

export class GymUser {
  private readonly id?: string;
  private readonly name: string;
  private readonly cpf: string;
  private readonly email: string;
  private readonly type: GymUserType;
  private readonly personalTrainerId?: string;

  constructor({ cpf, email, name, type, id, personalTrainerId }: GymUserParams) {
    this.id = id;
    this.name = name;
    this.cpf = cpf;
    this.email = email;
    this.type = type;
    this.personalTrainerId = personalTrainerId;
  }

  isPersonalTrainer() {
    return this.type === 'personalTrainer';
  }

  get CPF() {
    return this.cpf;
  }

  get Name() {
    return this.name;
  }

  get Type() {
    return this.type;
  }

  get Email() {
    return this.email;
  }
}
