<template>
    <div class="card rounded transition p-4">
        <h3 class="text-lg font-semibold mb-2">Invites</h3>
        <Button @click="$emit('open-invite')" label="invites" />
    </div>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
    (e: 'open-invite'): void
}>()

</script>

<style scoped></style>