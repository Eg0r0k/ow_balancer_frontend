<template>
    <div class="lg:col-span-1 p-4 card rounded-lg transition">
        <h2 class="text-lg text-center font-semibold mb-4">Workspaces</h2>
        <Button @click="emit('show-create-modal')" class="w-full mb-4" size="small" label="Create Workspace"
            icon="pi pi-plus" />
        <div class="hidden lg:block">
            <VirtualScroller :items="items" :itemSize="20" style="height:75vh" class="custom-scroller">
                <template v-slot:item="{ item }">
                    <div @click="selectWorkspace(item.id)" :key="item.id"
                        :class="{ 'border-l-2 border-primary-400 border-opacity-100 cursor-default': workspaceData?.id === item.id, 'hover:bg-surface-500 ': workspaceData?.id !== item.id }"
                        class="p-3 cursor-pointer relative flex items-end justify-between  border-l-2 border-primary-400 border-opacity-0 transition  ">
                        <span class="select-none">{{ item.name }}</span>
                        <div class="flex items-center">
                            <small class="text-surface-300">{{ item.creator.username }}</small>
                        </div>
                    </div>
                </template>
            </VirtualScroller>
        </div>

        <div class="lg:hidden block">
            <Dropdown v-model="selectedWorkspace" :options="items" optionLabel="name" placeholder="Select a Workspace"
                class="w-full mb-4" @change="selectWorkspace(selectedWorkspace?.id || 0)" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { Workspace } from '../../entities/workspace/type/workspace';
import VirtualScroller from 'primevue/virtualscroller';
import Dropdown from 'primevue/dropdown';

const emit = defineEmits(['workspace-selected', 'show-create-modal']);
const selectWorkspace = (workspaceId: number) => {
    emit('workspace-selected', workspaceId);
};

const props = defineProps<{
    items: Workspace[],
    workspaceData: any
}>()
const selectedWorkspace = ref<Workspace | null>(null);
</script>

<style scoped>
.custom-scroller::-webkit-scrollbar {
    background-color: transparent;
    width: 4px;
}

.custom-scroller:hover::-webkit-scrollbar-thumb {
    width: 8px;
    @apply bg-surface-300;
    border-radius: 10px;
}

.custom-scroller::-webkit-scrollbar-track {
    background-color: transparent;
}

.custom-scroller::-webkit-scrollbar-thumb {
    background-color: transparent;
}
</style>