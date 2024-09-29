import { WorkspaceProfile } from "../../workspace/type/workspace";

export interface RegistrationType {
  username: string;
  password: string;
  password_again: string;
}

export interface LoginType {
  username: string;
  password: string;
  remember_me: boolean;
}
export interface Profile {
  id: number;
  username: string;
  active: boolean;
}
export interface AuthData {
  auth: boolean;
  profile: Profile | null;
  workspace_profile: WorkspaceProfile | null;
}
