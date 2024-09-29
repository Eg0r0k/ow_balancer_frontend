<template>
    <div class="card rounded transition p-4  min-h-[230px]">
        <div v-if="workspaceDataLoading" class="">
            <Skeleton class="mb-2"></Skeleton>
            <Skeleton width="10rem" class="mb-2"></Skeleton>
            <Skeleton width="5rem" class="mb-2"></Skeleton>
            <Skeleton height="1rem"></Skeleton>
        </div>
        <div v-else-if="workspaceData" class=" transition p-4 rounded ">
            <div class="flex justify-between items-center">
                <h2 class="text-lg font-semibold">Selected workspace: {{ workspaceData.name }}</h2>
                <span v-if="workspaceData.creator.id === authStore.authData?.profile?.id"
                    class="text-xs text-gray-500">(Owner)</span>
            </div>
            <p v-if="workspaceData.description" class="text-sm text-gray-600 mt-2">{{ workspaceData.description
                }}
            </p>
            <p v-else class="text-sm text-gray-600 mt-2">No description provided.</p>
        </div>
        <div v-else class="card transition p-4">
            <p class="text-gray-600">Select a workspace to view details.</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Skeleton from 'primevue/skeleton';
import { useAuthStore } from '../../entities/auth/model/store';
type WorkspaceData = {
    id: number;
    name: string;
    description: string;
    creator: {
        id: number;
        username: string;
        active: boolean;
    };
} | null;
interface Props {
    workspaceData: WorkspaceData
    workspaceDataLoading: boolean
}
const authStore = useAuthStore()
const props = defineProps<Props>()
</script>
