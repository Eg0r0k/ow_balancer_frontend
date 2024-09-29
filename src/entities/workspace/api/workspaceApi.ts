import { AxiosResponse } from "axios";
import { Role, Workspace, WorkspaceProfile } from "../type/workspace";
import { instance } from "../../../shared/api/instance/instance";

const workspaceUrl = (workspaceId: number, endpoint: string = "") => {
  return `/workspace/${workspaceId}${endpoint}`;
};

const postWorkspaceAction = <T>(
  workspaceId: number,
  endpoint: string,
  data: T
) => {
  return instance.post(workspaceUrl(workspaceId, endpoint), data);
};

export const WorkspaceApi = {
  async loadWorkspace(workspaceId: number): Promise<AxiosResponse<Workspace>> {
    return instance.get(workspaceUrl(workspaceId));
  },

  async loadWorkspaces(): Promise<AxiosResponse<Workspace[]>> {
    return instance.get("/workspace/");
  },

  async createInvite(
    workspaceId: number,
    useLimit: number
  ): Promise<AxiosResponse<any>> {
    return postWorkspaceAction(workspaceId, "/invite", { use_limit: useLimit });
  },

  async inviteInfo(token: string): Promise<AxiosResponse<any>> {
    return instance.get(`/invite/${token}`);
  },

  async create(data: {
    name: string;
    params: { CustomSystem: boolean };
  }): Promise<AxiosResponse<Workspace>> {
    return instance.post("/workspace/", data);
  },

  async roles(): Promise<AxiosResponse<Role[]>> {
    return instance.get("/workspace/roles");
  },

  async select(workspaceId: number): Promise<AxiosResponse<void>> {
    return postWorkspaceAction(workspaceId, "/select", {});
  },

  async changeRole(
    workspaceId: number,
    data: { userId: number; roleId: number }
  ): Promise<AxiosResponse<void>> {
    return postWorkspaceAction(workspaceId, "/change_role", {
      workspace_profile_id: data.userId,
      role_id: data.roleId,
    });
  },

  async kick(
    workspaceId: number,
    userId: number
  ): Promise<AxiosResponse<void>> {
    return postWorkspaceAction(workspaceId, "/kick", {
      workspace_profile_id: userId,
    });
  },

  async leave(workspaceId: number): Promise<AxiosResponse<void>> {
    return instance.post(workspaceUrl(workspaceId, "/leave"));
  },

  async members(
    workspaceId: number
  ): Promise<AxiosResponse<WorkspaceProfile[]>> {
    return instance.get(workspaceUrl(workspaceId, "/members"));
  },
};
