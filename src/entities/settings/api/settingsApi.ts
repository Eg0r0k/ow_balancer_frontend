import { AxiosResponse } from "axios";

import { Config } from "../../../shared/constants/type";
import { instance } from "../../../shared/api/instance/instance";

export const SettingsApi = {
  async load(): Promise<AxiosResponse<Config>> {
    return instance.get<Config>("/settings/");
  },
  async save(args: Config): Promise<AxiosResponse<Config>> {
    return instance.post<Config>("/settings/", args);
  },
  async default(): Promise<AxiosResponse<Config>> {
    return instance.get<Config>("/settings/default");
  },
};
