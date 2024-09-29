<template>
    <header class=" p-2 flex flex-row ">
        <Toolbar class="w-full" style="padding:5px 10px">
            <template #start>
                <nav class="flex flex-row">
                    <Button label="Workspace" link to="/workspace" as="router-link" />
                    <Button label="Balancer" link to="/balancer" as="router-link" />
                    <Button label="Statistic" link to="/statistic" as="router-link" />
                </nav>
            </template>
            <template #end>
                <div class="flex flex-row gap-4 items-center">

                    <template v-if="authStore.isAuthenticated">
                        <div @click="toggleMenu" class="relative flex items-center cursor-pointer gap-2">

                            <span class="font-semibold">{{ username }}</span>

                            <Avatar icon="pi pi-user" />

                            <Menu ref="menu" :model="items" popup />

                        </div>
                    </template>
                    <template v-else>
                        <Button label="Login" link as="router-link" to="/login" iconPos="right" icon="pi pi-sign-in" />
                    </template>
                    <Button class="max-w-8 max-h-8" :icon="isDarkTheme ? 'pi pi-moon' : 'pi pi-sun'" size="small"
                        aria-label="Toggle Theme" @click="toggleDarkMode" />
                </div>
            </template>

        </Toolbar>

    </header>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import Button from 'primevue/button';
import Menu from 'primevue/menu';
import { useAuthStore } from '../../entities/auth/model/store';
import Toolbar from 'primevue/toolbar';
import { router } from '../../app/routes';
import Avatar from 'primevue/avatar';
const authStore = useAuthStore();

const username = computed(() => authStore.getUsername());
const workspace = computed(() => authStore.getWorkspace())
const menu = ref(null);
const items = ref([
    {
        label: workspace,
    },
    {
        separator: true,
    },
    {
        label: 'Profile',
        icon: 'pi pi-user',
        command: () => {

            // router.push('/profile');
        },
    },

    {
        label: "Guide",
        icon: 'pi pi-book',
        command: () => {
            window.open("https://github.com/dmelackov/OWBalancer/blob/master/README.md", "_blank");

        }
    },
    {
        label: 'Settings',
        icon: 'pi pi-cog',
        command: () => {
            router.push('/settings');
        },
    },
    {
        separator: true,
    },
    {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: async () => {
            await authStore.authSignout();
        },
    },
]);

const toggleMenu = (event: Event) => {
    if (menu.value) {
        menu.value.toggle(event);
    }
};

const isDarkTheme = ref(false);
const toggleDarkMode = () => {
    const element = document.querySelector('html');
    if (element) {
        element.classList.toggle('p-dark');
        isDarkTheme.value = element.classList.contains('p-dark');
        localStorage.setItem('theme', isDarkTheme.value ? 'dark' : 'light');
    }
};



onMounted(async () => {
    await authStore.userData();
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        const element = document.querySelector('html');
        if (element) {
            element.classList.add('p-dark');
            isDarkTheme.value = true;
        }
    }
});
</script>