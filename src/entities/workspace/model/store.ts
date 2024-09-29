import { defineStore } from "pinia";
import { WorkspaceApi } from "../api/workspaceApi";
import { Role, Workspace, WorkspaceProfile } from "../type/workspace";
import { useToast } from "primevue/usetoast";
import axios, { AxiosResponse } from "axios";

export const useWorkspaceStore = defineStore("workspace", () => {
  const toast = useToast();

  const handleError = (error: unknown) => {
    if (axios.isAxiosError(error) && error.response) {
      const errorMap: Record<number, { summary: string; detail: string }> = {
        403: {
          summary: "Bad Request",
          detail: error.response.data?.detail || "Invalid request",
        },
        404: { summary: "Not Found", detail: error.message },
        500: {
          summary: "Server Error",
          detail: "Something went wrong. Please try again later.",
        },
      };

      const { summary, detail } = errorMap[error.response.status] || {
        summary: "Error",
        detail: error.message,
      };

      toast.add({ severity: "error", summary, detail, life: 3000 });
    } else {
      console.error("Unexpected error:", error);
      toast.add({
        severity: "error",
        summary: "Unexpected Error",
        detail: "Something went wrong. Please contact support.",
        life: 3000,
      });
    }
  };

  const handleRequest = async <T>(request: Promise<T>): Promise<T | null> => {
    try {
      return await request;
    } catch (error: unknown) {
      handleError(error);
      return null;
    }
  };

  const processResponse = <T>(
    response: AxiosResponse<T> | null,
    defaultValue: T
  ): T => {
    return response?.data || defaultValue;
  };

  const getWorkspaces = async (): Promise<Workspace[]> => {
    const response = await handleRequest(WorkspaceApi.loadWorkspaces());
    return processResponse(response, []);
  };

  const createInvite = async (
    workspaceId: number,
    useLimit: number
  ): Promise<any> => {
    return (
      await handleRequest(WorkspaceApi.createInvite(workspaceId, useLimit))
    )?.data;
  };

  const getInviteInfo = async (token: string): Promise<any> => {
    return (await handleRequest(WorkspaceApi.inviteInfo(token)))?.data;
  };

  const kickFromWorkspace = async (data: {
    userId: number;
    workspaceId: number;
  }) => {
    await handleRequest(WorkspaceApi.kick(data.workspaceId, data.userId));
  };

  const createWorkspace = async (data: {
    name: string;
    params: { CustomSystem: boolean };
  }): Promise<void> => {
    await handleRequest(WorkspaceApi.create(data));
  };

  const getWorkspaceMembers = async (
    id: number
  ): Promise<WorkspaceProfile[]> => {
    const response = await handleRequest(WorkspaceApi.members(id));
    return processResponse(response, []);
  };

  const getRoles = async (): Promise<Role[]> => {
    const response = await handleRequest(WorkspaceApi.roles());
    return processResponse(response, []);
  };

  const getWorkspace = async (id: number): Promise<Workspace | undefined> => {
    const response = await handleRequest(WorkspaceApi.loadWorkspace(id));
    return response?.data;
  };

  const changeRoleWorkspace = async (
    id: number,
    data: { userId: number; roleId: number }
  ) => {
    await handleRequest(WorkspaceApi.changeRole(id, data));
  };

  const selectWorkspace = async (id: number): Promise<void> => {
    await handleRequest(WorkspaceApi.select(id));
  };

  return {
    getWorkspaces,
    selectWorkspace,
    createWorkspace,
    kickFromWorkspace,
    getWorkspace,
    getWorkspaceMembers,
    getRoles,
    changeRoleWorkspace,
    createInvite,
    getInviteInfo,
  };
});
