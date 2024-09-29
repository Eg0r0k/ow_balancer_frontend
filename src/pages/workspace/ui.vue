<template>
    <div>
        <div class="grid grid-cols-1 lg:grid-cols-6 gap-4 rounded h-[calc(100vh-84px)]">
            <Workspaces :items="workspace" :workspaceData="workspaceData" @workspace-selected="loadSelectWorkspace"
                @show-create-modal="showCreateModal = true" />
            <div class="lg:col-span-5 grid gap-4">
                <WorkspaceInfo :workspace-data="workspaceData" :workspace-data-loading="workspaceDataLoading" />
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[428px]">
                    <WorkspaceMembers :roles-items="rolesItems" :workspace-members="workspaceMembers"
                        @change-role="handleChangeRole" @show-kick-confirmation="showKickConfirmation" />
                    <WorkspaceInvites @open-invite="showInvites" />
                </div>
            </div>
        </div>
        <Dialog v-model:visible="showCreateInvite" header="Invite your friends" :modal="true" :closable="true"
            class="w-96">
            Invites: {{ inviteAmount }}
            <Slider v-model="inviteAmount" min="1" max="10" class="w-full  my-3" />
            <Button label="Create" icon="" class="w-full mb-3" @click="createInvite" />
            <div class="flex">

                <InputText class="w-full" :value="source" disabled />
                <Button label="Copy" icon="pi pi-copy" class="ml-2" @click="copy(source)" v-if="isSupported" />
            </div>
        </Dialog>
        <Dialog v-model:visible="showCreateModal" header="Create Workspace" :modal="true" :closable="false"
            class="w-96">
            <div class="xp-4">
                <InputText v-model="newWorkspaceName" type="text" placeholder="Enter workspace name"
                    class="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" />
                <div class="flex items-center mb-4">
                    <Checkbox v-model="customSystem" :binary="true" inputId="custom-system" class="mr-2" />
                    <label for="custom-system" class=" select-none">Use Custom System</label>
                </div>
                <div class="flex justify-end space-x-3">
                    <Button @click="showCreateModal = false" label="Cancel" severity="secondary" outlined />
                    <Button @click="createWorkspace" severity="success" label="Create" />
                </div>
            </div>
        </Dialog>
        <Dialog v-model:visible="showKickDialog" header="Confirm Kick" :modal="true" :closable="false" class="w-96">
            <div class="p-4">
                <p>Are you sure you want to kick <strong>{{ memberToKick?.profile.username }}</strong> from this
                    workspace?</p>
                <div class="flex justify-end space-x-3 mt-4">
                    <Button label="Cancel" @click="showKickDialog = false" severity="secondary" outlined />
                    <Button label="Kick" @click="kickMember" severity="danger" />
                </div>
            </div>
        </Dialog>
        <Dialog v-model:visible="showInviteNotification" :header="`Invite by ${test?.creator.workspace.creator.username}`"
            :modal="true" :closable="false">
            <p>You have been invited to join the workspace "{{ test?.creator.workspace.name }}".</p>
            <div class="flex justify-end space-x-3 mt-4">
                <Button label="Decline" @click="showInviteNotification = false" severity="secondary" outlined />
                <Button label="Accept" @click="acceptInvite" severity="success" />
            </div>
        </Dialog>
    </div>
</template>


<script setup lang="ts">
import { WorkspaceMembers } from '../../widgets/workspaceMembers';
import { onMounted, ref, watch } from 'vue';
import { useWorkspaceStore } from '../../entities/workspace/model/store';
import { Role, Workspace, WorkspaceProfile } from '../../entities/workspace/type/workspace';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import { useAuthStore } from '../../entities/auth/model/store';
import { useToast } from 'primevue/usetoast';
import { Workspaces } from '../../widgets/workspaces';
import { WorkspaceInfo } from '../../widgets/workspaceInfo';
import { WorkspaceInvites } from '../../widgets/workspaceInvtes';
import Slider from 'primevue/slider';
import { useClipboard } from '@vueuse/core';
import { router } from '../../app/routes';
onMounted(async () => {
    const currentWorkspaceId = authStore.authData?.workspace_profile?.workspace.id;


    const [workspaces, roles] = await Promise.all([
        workspaceStore.getWorkspaces(),
        workspaceStore.getRoles(),
    ]);

    workspace.value = workspaces;
    rolesItems.value = roles;

    if (currentWorkspaceId) {
        await loadWorkspace(currentWorkspaceId);
    } else {
        toast.add({
            severity: 'warn',
            summary: 'Workspace not found',
            detail: 'Try to select workspace. Or write in support.',
            life: 3000,
        });
    }
    const inviteString = router.currentRoute.value.params.inviteString as string | undefined;
    if (inviteString && authStore.isAuthenticated) {
        invitedWorkspaceName.value = inviteString;
        showInviteNotification.value = true;
        test.value = await workspaceStore.getInviteInfo(inviteString)
    }
});

const loadSelectWorkspace = async (id: number): Promise<void> => {
    await loadWorkspace(id, true);
    await authStore.userData()
};

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
//Stores
const authStore = useAuthStore()
const workspaceStore = useWorkspaceStore();
const toast = useToast()
//Modals
const showCreateModal = ref(false);
const showCreateInvite = ref(false)
const showKickDialog = ref(false);

//Data
const rolesItems = ref<Role[]>([]);
const workspace = ref<Workspace[]>([]);
const workspaceData = ref<WorkspaceData | null>(null);
const workspaceMembers = ref<WorkspaceProfile[]>([]);
const inviteAmount = ref(1)
const test = ref()
const showInviteNotification = ref(false);
const invitedWorkspaceName = ref('');
const source = ref(`${import.meta.env.VITE_BASE_URL}/`)
//Modals data
const customSystem = ref(true);
const newWorkspaceName = ref('');
const memberToKick = ref<WorkspaceProfile | null>(null);

//Loading states
const workspaceDataLoading = ref(false);

const { copy, copied, isSupported } = useClipboard({ source })
const showKickConfirmation = (member: WorkspaceProfile) => {
    memberToKick.value = member;
    showKickDialog.value = true;
};
const showInvites = (): void => {
    showCreateInvite.value = !showCreateInvite.value
}

const kickMember = async () => {
    if (memberToKick.value) {
        try {
            await workspaceStore.kickFromWorkspace({
                userId: memberToKick.value.id,
                workspaceId: workspaceData.value!.id
            });
            workspaceMembers.value = await workspaceStore.getWorkspaceMembers(workspaceData.value!.id);
        } catch (error) {

        } finally {
            showKickDialog.value = false;
            memberToKick.value = null;
        }
    }
};

const createInvite = async (): Promise<void> => {
    const currentWorkspaceId = authStore.authData?.workspace_profile?.workspace.id;
    if (currentWorkspaceId) {
        const code = await workspaceStore.createInvite(currentWorkspaceId, inviteAmount.value);
        source.value = `${import.meta.env.VITE_BASE_URL}/${code.key}`;
    }
};
const acceptInvite = async () => {

    showInviteNotification.value = false;
};

const loadWorkspace = async (id: number, forceReload = false): Promise<void> => {
    if (!forceReload && workspaceData.value?.id === id) return;

    workspaceDataLoading.value = true;
    try {
        await workspaceStore.selectWorkspace(id);
        const workspace = await workspaceStore.getWorkspace(id);
        if (workspace) {
            workspaceData.value = workspace;
            workspaceMembers.value = await workspaceStore.getWorkspaceMembers(id);
        } else {
            workspaceData.value = null;
            workspaceMembers.value = [];
            toast.add({ severity: "error", summary: "Workspace not loaded", detail: "Error loading workspace", life: 3000 });
        }
    } catch (error) {
        toast.add({ severity: "error", summary: "Error", detail: "Failed to load workspace", life: 3000 });
    } finally {
        workspaceDataLoading.value = false;
    }
};
const createWorkspace = async (): Promise<void> => {
    if (newWorkspaceName.value.trim()) {
        await workspaceStore.createWorkspace({
            name: newWorkspaceName.value.trim(),
            params: {
                CustomSystem: customSystem.value
            }
        });
        workspace.value = await workspaceStore.getWorkspaces();

        showCreateModal.value = false;
        newWorkspaceName.value = '';
        customSystem.value = true;
    }
};

const loadWorkspaceMembers = async (workspaceId: number) => {
    workspaceMembers.value = await workspaceStore.getWorkspaceMembers(
        workspaceId
    );
};
const handleChangeRole = async (newRole: Role, member: WorkspaceProfile): Promise<void> => {
    if (workspaceData.value?.id) {
        await workspaceStore.changeRoleWorkspace(
            workspaceData.value.id,
            {
                userId: member.id,
                roleId: newRole.id
            }
        );
        await loadWorkspaceMembers(workspaceData.value.id);
    }
};
watch(copied, (newValue) => {
    if (newValue) {
        toast.add({ severity: 'success', summary: 'Copied', detail: 'Invite link copied to clipboard', life: 2000 });
    }
});

</script>
