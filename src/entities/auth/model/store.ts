import { defineStore } from "pinia";
import { AuthApi } from "../api/authApi";
import { AuthData, LoginType, RegistrationType } from "../type/auth";
import { computed, ref } from "vue";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import axios from "axios";



export const useAuthStore = defineStore("auth", () => {
  const authData = ref<AuthData | null>(null);

  const isAuthenticated = computed(() => Boolean(authData.value?.auth));

  const router = useRouter();
  const toast = useToast();

  const handleRequest = async <T>(request: Promise<T>): Promise<T | null> => {
    try {
      const responce = await request;
      return responce;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        switch (error.response.status) {
          case 400:
            toast.add({
              severity: "error",
              summary: "Bad Request",
              detail: error.response.data.detail,
              life: 3000,
            });
            break;
          case 403: {
            toast.add({
              severity: "error",
              summary: "No Premission",
              detail: "Please check your premission",
              life: 3000,
            });
            break;
          }
          case 404: {
            toast.add({
              severity: "error",
              summary: "Not found",
              detail: error.message,
              life: 3000,
            });
            break;
          }
          case 500: {
            toast.add({
              severity: "error",
              summary: "Server Error",
              detail: "Something went wrong. Please try again later.",
              life: 3000,
            });
            break;
          }
          default: {
            toast.add({
              severity: "error",
              summary: "Error",
              detail: error.message,
              life: 3000,
            });
          }
        }
      } else {
        console.log("Unexpected error occupated:", error);
        toast.add({
          severity: "error",
          summary: "Unexpected Error",
          detail: "Something went wrong. Please напишите диме в ЛС.",
          life: 3000,
        });
      }
      return null;
    }
  };

  const authSignup = async (args: RegistrationType): Promise<boolean> => {
    const response = await handleRequest(AuthApi.signup(args));

    if (response) {
      authData.value = response;
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "Registration successful!",
        life: 3000,
      });
      await router.push("/login");
      return true;
    }
    return false;
  };
  const authSignout = async (): Promise<void> => {
    const response = await handleRequest(AuthApi.logout());
    if (response) {
      authData.value = null;
      document.cookie = "token=; Max-Age=0; path=/;";
      toast.add({
        severity: "success",
        summary: "Logged out",
        detail: "You have been logged out successfully.",
        life: 3000,
      });
      await router.push("/login");
    }
  };
  const userData = async () => {
    const response = await handleRequest(AuthApi.getUserData());
    if (response) {
      authData.value = response;
    }
  };
  const getUsername = (): string | null => {
    return authData.value?.profile?.username || null;
  };
  const getWorkspace = (): string | null => {
    return authData.value?.workspace_profile?.workspace.name || null;
  };

  const authLogin = async (args: LoginType): Promise<boolean> => {
    const response = await handleRequest(AuthApi.login(args));

    if (response) {
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "Login successful!",
        life: 3000,
      });
      await userData();

      await router.push("/workspace");
      return true;
    }
    return false;
  };

  return {
    authSignup,
    authLogin,
    getWorkspace,
    authSignout,
    userData,
    isAuthenticated,
    authData,

    getUsername,
  };
});
