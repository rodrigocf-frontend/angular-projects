import { Injectable } from '@angular/core';
import { GymUser } from '../../domain/entities/gym-user.entity';
import { GymUsersRepository } from '../../domain/repositories/gym-users.repository';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { GymUserMapper } from '../mappers/gym-user.mapper';
import {
  GymUserAlreadyExistsError,
  GymUserPersistenceError,
} from '../../domain/errors/gym-user.errors';

@Injectable()
export class SupabaseGymUsersRepositoryImpl extends GymUsersRepository {
  private supabase: SupabaseClient;

  constructor() {
    super();
    this.supabase = createClient(environment.supabaseUrl, environment.supabasePublishableKey);
  }

  override async create(gymUser: GymUser): Promise<void> {
    const newUserData = GymUserMapper.toEntity(gymUser);
    const { error } = await this.supabase.from('tb_gym_users').insert([newUserData]);
    if (!error) return;
    if (error.code === '23505') throw new GymUserAlreadyExistsError();
    throw new GymUserPersistenceError(error);
  }
}
