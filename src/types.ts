import { User } from './model';

export enum OrganizationType {
  School = 'school',
  Office = 'office',
  Others = 'others',
}

export enum RoleType {
  Leader = 'leader',
  Admin = 'admin',
  User = 'user',
}

export interface UserParam {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
  role: RoleType;
}

export interface CurrentUser {
  currentUser: User;
}

export interface OrganizationParam {
  organizationName: string;
  organizationType: OrganizationType;
  organizationLocation: string;
  organizationPassword: string;
  leaderFirstName: string;
  leaderLastName: string;
  leaderNumber: string;
  leaderPassword: string;
}
