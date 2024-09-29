import { Profile } from "../../auth/type/auth";

export interface Role {
  id: number;
  name: string;
}
export interface Workspace {
  id: number;
  name: string;
  description: "string";
  creator: Profile;
}
export interface WorkspaceProfile {
  id: number;
  profile: Profile;
  workspace: Workspace;
  role: Role;
  active: boolean;
}
