import { GymExercise } from '../../../../../src/app/domain/entities/gym-exercise.entity';
import { GymWorkout } from '../../../../../src/app/domain/entities/gym-workout.entity';

describe('GymWorkout', () => {
  const exercises: GymExercise[] = [
    { name: 'Bench press', series: 4, repetitions: 10, load: 60, rest: 90 },
    { name: 'Push up', series: 3, repetitions: 15 },
  ];

  it('should create a workout with the given data', () => {
    const workout = new GymWorkout('1', 'Chest day', 'user-1', 'trainer-1', exercises);

    expect(workout.id).toBe('1');
    expect(workout.name).toBe('Chest day');
    expect(workout.userId).toBe('user-1');
    expect(workout.personalTrainerId).toBe('trainer-1');
    expect(workout.exercicios).toEqual(exercises);
  });

  it('should keep exercises in the given order', () => {
    const workout = new GymWorkout('1', 'Chest day', 'user-1', 'trainer-1', exercises);

    expect(workout.exercicios.map((exercise) => exercise.name)).toEqual(['Bench press', 'Push up']);
  });

  it('should accept exercises without load and rest', () => {
    const workout = new GymWorkout('1', 'Chest day', 'user-1', 'trainer-1', exercises);

    expect(workout.exercicios[1].load).toBeUndefined();
    expect(workout.exercicios[1].rest).toBeUndefined();
  });

  it('should accept a workout without exercises', () => {
    const workout = new GymWorkout('1', 'Empty', 'user-1', 'trainer-1', []);

    expect(workout.exercicios).toEqual([]);
  });
});
