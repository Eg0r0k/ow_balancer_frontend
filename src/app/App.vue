<template>
  <Transition name="fade" mode="out-in">
    <div class=" bg-cover flex flex-col w-full min-w-[350px] min-h-screen mx-auto box-border">
      <Header />
      <main class="grid flex-1 px-2">
        <router-view v-slot="{ Component, route }">
          <transition name="fade" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </main>
      <footer>

      </footer>
      <Toast position="bottom-right" />
      <ConfirmDialog></ConfirmDialog>
    </div>

  </Transition>
</template>
<script setup lang="ts">
import Toast from 'primevue/toast';
import { Header } from '../widgets/header';
import ConfirmDialog from 'primevue/confirmdialog';


</script>
<style scoped lang="css">
.fade-enter-active,
.fade-leave-active {
  transition: all 0.125s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
