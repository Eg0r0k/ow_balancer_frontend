import { useStorage, watchDebounced } from "@vueuse/core";
import { defineStore } from "pinia";
import { ref, unref, watch } from "vue";
import { Config } from "../../../shared/constants/type";
import { SettingsApi } from "../api/settingsApi";
import defaultConfig from "../../../shared/constants/default-config";
import { isObjectDiffrent } from "../../../shared/lib/objects";

export const useSettingsStore = defineStore("settings", () => {
  const config = ref<Config>(Object.assign({}, defaultConfig));
  const localConfig = useStorage("config", defaultConfig);

  const loadSettings = async () => {
    try {
      if (Object.keys(localConfig.value).length !== 0) {
        config.value = localConfig.value;
      }

      const response = await SettingsApi.load();

      if (response && isObjectDiffrent(response.data, config.value)) {
        config.value = response.data;
        localConfig.value = response.data;
      }
    } catch (error) {
      console.error("Ошибка загрузки настроек:", error);
    }
  };
  const saveSettings = async () => {
    await SettingsApi.save(unref(config));
  };
  (async () => {
    await loadSettings();
  })();
  watchDebounced(
    config,
    () => {
      saveSettings();
    },
    { deep: true, debounce: 500 }
  );
  const resetToDefault = async () => {
    const response = await SettingsApi.default();
    if (response) {
      config.value = response.data;
    } else {
      config.value = JSON.parse(JSON.stringify(defaultConfig));
      localConfig.value = JSON.parse(JSON.stringify(defaultConfig));
    }
  };

  return { config, loadSettings, saveSettings, resetToDefault };
});
