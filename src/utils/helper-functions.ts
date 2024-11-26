import { User } from '../model';

export const dataToJson = (data: User) => {
  return data.toJSON();
};
