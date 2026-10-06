import { GymExercise } from './gym-exercise.entity';

export class GymWorkout {
  constructor(
    public id: string,
    public name: string,
    public userId: string,
    public personalTrainerId: string,
    public exercicios: GymExercise[],
  ) {}
}
