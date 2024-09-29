<template>
    <div class="grid md:grid-cols-2 gap-6 grid-cols-1 p-4">
        <div class=" p-4 ">
            <h3 class="font-bold mb-4 text-2xl">General Settings</h3>
            <div class="flex flex-col gap-4 mb-4">
                <div v-for="category of categories" :key="category.key" class="flex items-center gap-3 justify-between">
                    <div>
                        <label :for="category.key" class="font-medium text-lg">{{
                            category.name
                            }}</label>
                        <i class="pi pi-info-circle ml-2" v-tooltip="{ value: category.desc }"></i>
                    </div>
                    <ToggleSwitch v-model="category.enabled" />
                </div>
            </div>
            <h3 class="font-bold mb-2 text-xl">Role amout settings</h3>
            <div class="flex gap-5">
                <InputGroup>
                    <InputGroupAddon>
                        <Tank />
                    </InputGroupAddon>
                    <InputText v-model="config.amount.tank" />
                </InputGroup>
                <InputGroup>
                    <InputGroupAddon>
                        <Damage />
                    </InputGroupAddon>
                    <InputText v-model="config.amount.damage" />

                </InputGroup>
                <InputGroup>
                    <InputGroupAddon>
                        <Support />
                    </InputGroupAddon>
                    <InputText v-model="config.amount.support" />

                </InputGroup>
            </div>
            <div class="mb-4">
                <h3 class="font-bold mb-2 text-xl">Teams</h3>
                <div v-for="(team, index) in config.team" :key="index" class="p-inputgroup mb-2">
                    <InputGroup>
                        <InputText v-model="team.name" :placeholder="'Team ' + (index + 1)" />
                        <InputGroupAddon>
                            <ColorPicker v-model="team.color" :key="resetKey" />
                        </InputGroupAddon>
                    </InputGroup>
                </div>
            </div>
            <div class="mb-4">
                <h3 class="font-bold mb-2 text-xl">Design</h3>
                <SelectButton v-model="selectedDesign" :options="designs" optionLabel="name" class="w-full md:w-auto" />
            </div>
        </div>
        <div class=" p-4 ">
            <h3 class="font-bold mb-4 text-2xl">Math Settings</h3>
            <div class="grid grid-cols-1 gap-4">
                <div v-for="(setting, index) in mathSettings" :key="index">
                    <div class="flex items-center justify-between mb-2">
                        <div>
                            <label :for="setting.key" class="font-medium text-lg">{{
                                setting.label
                                }}</label>
                            <i class="pi pi-info-circle ml-2" v-tooltip="{ value: setting.desc }"></i>
                        </div>
                        <InputText v-model.number="(config.math as any)[setting.key]" class="w-24 text-right" />
                    </div>
                    <Slider v-model.number="(config.math as any)[setting.key]" :min="setting.min" :max="setting.max"
                        :step="setting.step || 1" />
                </div>
            </div>
            <Button label="Reset to default" severity="danger" icon="pi pi-trash" @click="confirmReset()"
                class="mt-4 w-full" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import Slider from "primevue/slider";
import Button from "primevue/button";
import ColorPicker from "primevue/colorpicker";
import InputText from "primevue/inputtext";
import ToggleSwitch from "primevue/toggleswitch";
import SelectButton from "primevue/selectbutton";
import defaultConfig from "../../shared/constants/default-config";
import { useConfirm } from "primevue/useconfirm";
import { useSettingsStore } from "../../entities/settings/model/store";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import Tank from '../../shared/assets/icons/Tank.vue'
import Damage from '../../shared/assets/icons/Damage.vue'
import Support from '../../shared/assets/icons/Support.vue'
const confirm = useConfirm();
const resetKey = ref(0);
const settingsStore = useSettingsStore();
const config = computed(() => settingsStore.config);

const confirmReset = () => {
    confirm.require({
        message: "Do you want to reset all settings?",
        header: "Reset settings",
        icon: "pi pi-info-circle",
        rejectLabel: "Cancel",
        rejectProps: {
            label: "Cancel",
            severity: "secondary",
            outlined: true,
        },
        acceptProps: {
            label: "Reset",
            severity: "danger",
        },
        accept: () => {
            resetToDefault();
        },
        reject: () => { },
    });
};

const categories = ref([
    {
        name: "Custom Autochoice",
        key: "auto_custom",
        enabled: config.value.auto_custom,
        desc: "Automatically adds to the lobby the custom that was created by the author"
    },
    {
        name: "Extended Lobby",
        key: "extended_lobby",
        enabled: config.value.extended_lobby,
        desc: "Allows you to add more than two teams to a custom match lobby."
    },
    {
        name: "Extended Result",
        key: "expanded_result",
        enabled: config.value.expanded_result,
        desc: "Displays additional statistics on team balance."
    },
    {
        name: "Autoincrement",
        key: "auto_increment",
        enabled: config.value.auto_increment,
        desc: "Custom match rankings are updated based on the outcome of the game."
    },
]);

const designs = ref([
    { name: "Design 1", code: "D1" },
    { name: "Design 2", code: "D2" },
]);
const selectedDesign = ref(designs.value[0]);

interface Setting {
    key: string;
    label: string;
    min: number;
    max: number;
    step?: number;
    desc: string;
}
const mathSettings = ref<Setting[]>([
    { key: "balance_limit", label: "Balance Limit", min: 100, max: 10000, desc: "Limitation of the maximum balance score that can be obtained." },
    { key: "alpha", label: "Alpha", min: 0, max: 10, desc: "Сoefficient of comparison of average rating of A with average rating of team B." },
    { key: "beta", label: "Beta", min: 0, max: 10, desc: "Average role divergence coefficient." },
    { key: "gamma", label: "Gamma", min: 0, max: 100, desc: "Penalty for off-roles." },
    { key: "p", label: "P", min: 1, max: 10, desc: "Penalty for difference in rating between teams." },
    { key: "q", label: "Q", min: 1, max: 10, desc: "Penalty for difference in average rating within a team" },
    { key: "tank_weight", label: "T Weight", min: 0.1, max: 2, step: 0.1, desc: "Multiplier of a person's rating in certain roles." },
    { key: "damage_weight", label: "D Weight", min: 0.1, max: 2, step: 0.1, desc: "Multiplier of a person's rating in certain roles." },
    {
        key: "support_weight",
        label: "H Weight",
        min: 0.1,
        max: 2,
        step: 0.1, desc: "Multiplier of a person's rating in certain roles."
    },
]);

watch(categories, (newCategories) => {
    newCategories.forEach((category) => {
        (config.value as any)[category.key] = category.enabled;
    });
}, { deep: true });

watch(selectedDesign, (newDesign) => {
    //TODO Implement style change
});

const resetToDefault = () => {
    settingsStore.resetToDefault();
    selectedDesign.value = designs.value[0];
    categories.value.forEach((category) => {
        category.enabled = (defaultConfig as any)[category.key];
    });
    resetKey.value++;
};
</script>