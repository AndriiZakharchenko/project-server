import { UserDTOType } from '../types';

export default class UserDTO {
  id;

  email;

  role;

  is_activated;

  constructor({
    id, email, role, is_activated,
  }: UserDTOType) {
    this.id = id;
    this.email = email;
    this.role = role;
    this.is_activated = is_activated;
  }
}
