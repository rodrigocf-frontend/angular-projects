import { Database } from '../../../../database.types';

type TbGymUserDataType = Database['public']['Tables']['tb_gym_users']['Row'];

export type GymUserDTO = Omit<TbGymUserDataType, 'id' | 'created_at'>;
