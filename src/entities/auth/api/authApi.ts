import { authInstance } from "../../../shared/api/api-instance/api.instance";
import { AuthData, LoginType, RegistrationType } from "../type/auth";
import { AxiosResponse } from "axios";
export const AuthApi = {
  async login(args: LoginType): Promise<AuthData> {
    const response = await authInstance.post<AuthData>("/auth/login", args);
    return response.data;
  },

  async signup(args: RegistrationType): Promise<AuthData> {
    const response = await authInstance.post<AuthData>(
      "/auth/registration",
      args
    );
    return response.data;
  },

  async logout(): Promise<AxiosResponse<void>> {
    return authInstance.post<any, AxiosResponse<any>>("/auth/logout");
  },
  async getUserData(): Promise<AuthData> {
    const response = await authInstance.get<AuthData>("/profile/");
    return response.data;
  },
  async getPremissions() {
    const responce = await authInstance.get<AuthData>("/profile/premissions");
    return responce.data;
  },
};
