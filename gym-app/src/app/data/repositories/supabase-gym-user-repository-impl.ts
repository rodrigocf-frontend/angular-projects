import { Injectable } from '@angular/core';
import { GymUser } from '../../domain/entities/gym-user.entity';
import { GymUsersRepository } from '../../domain/repositories/gym-users.repository';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { GymUserMapper } from '../mappers/gym-user.mapper';

@Injectable()
export class SupabaseGymUsersRepositoryImpl extends GymUsersRepository {
  private supabase: SupabaseClient;

  constructor() {
    super();
    this.supabase = createClient(environment.supabaseUrl, environment.supabasePublishableKey);
  }

  override async create(gymUser: GymUser): Promise<void> {
    const newUserData = GymUserMapper.toEntity(gymUser);

    const { data, error } = await this.supabase.from('tb_gym_users').insert([newUserData]).select();
  }
}
