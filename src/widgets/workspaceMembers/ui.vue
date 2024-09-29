<template>
    <div class="card rounded transition p-4">
        <h3 class="text-lg font-semibold mb-2">Members</h3>
        <VirtualScroller :items="workspaceMembers" :itemSize="50" style="height: calc(100% - 40px); ">
            <template v-slot:item="{ item: member }">
                <div :key="member.id"
                    class="p-2 transform transition duration-300 ease-in-out hover:-translate-y-1 min-h-[62px] hover:shadow-xl flex justify-between items-center">
                    <div class="flex items-center space-x-3">
                        <span>{{ member.profile.username }}</span>
                        <Tag class="h-6 ml-4" :value="member.role.name" />
                    </div>
                    <div v-if="
                        canManageRoles(member.role.name) &&
                        authStore.authData?.profile?.id !== member.profile.id
                    " class="flex items-center space-x-2">
                        <Dropdown :options="getAvailableRoles()" optionLabel="name" placeholder="Change Role"
                            class="w-40 text-white" @change="(e) => $emit('change-role', e.value, member)" />
                        <Button @click="$emit('show-kick-confirmation', member)" icon="pi pi-hammer" />
                    </div>
                </div>
            </template>
        </VirtualScroller>
    </div>
</template>

<script setup lang="ts">
import { Role, WorkspaceProfile } from '../../entities/workspace/type/workspace';
import { useAuthStore } from '../../entities/auth/model/store';
import VirtualScroller from 'primevue/virtualscroller';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Tag from 'primevue/tag';

const roleHierarchy = {
    Guest: 0,
    Customer: 1,
    Moderator: 2,
    Administrator: 3,
} as const;

interface Props {
    workspaceMembers: WorkspaceProfile[] | undefined;
    rolesItems: Role[]
}

const authStore = useAuthStore();
const emit = defineEmits<{
    (e: 'change-role', role: Role, member: WorkspaceProfile): void;
    (e: 'show-kick-confirmation', member: WorkspaceProfile): void;
}>();

const props = defineProps<Props>();

const getRoleLevel = (roleName: string | undefined): number => {
    return roleName && roleName in roleHierarchy
        ? roleHierarchy[roleName as keyof typeof roleHierarchy]
        : roleHierarchy.Guest;
};

const canManageRoles = (userRole: keyof typeof roleHierarchy): boolean => {
    const currentRoleLevel = roleHierarchy[userRole];
    const userRoleLevel = getRoleLevel(authStore.authData?.workspace_profile?.role.name);
    return userRoleLevel > 1 && currentRoleLevel < userRoleLevel;
};

const getAvailableRoles = (): Role[] => {
    const userRoleLevel = getRoleLevel(authStore.authData?.workspace_profile?.role.name);
    return props.rolesItems.filter(
        (role) =>
            role.name in roleHierarchy &&
            roleHierarchy[role.name as keyof typeof roleHierarchy] < userRoleLevel
    );
};
</script>