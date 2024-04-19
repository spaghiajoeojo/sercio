<script setup lang="ts">
import { exit } from "@tauri-apps/api/process";
import { appWindow } from '@tauri-apps/api/window'
import { ref } from "vue";
import FolderSelectionModal from "./FolderSelectionModal.vue";

const menu = ref();
const items = ref([
  {
    label: 'Add folder',
    icon: 'pi pi-folder-plus',
    command: () => {
      modalVisible.value = true;
    }
  },
  {
    label: 'Force scan',
    icon: 'pi pi-refresh'
  }
]);

const toggle = (event: Event) => {
  menu.value.toggle(event);
};

const modalVisible = ref(false);
</script>

<template>
  <Toolbar v-draggable class="toolbar">
    <template #start>
      <FolderSelectionModal v-model:visible="modalVisible"/>
      <Button v-draggable:disable text rounded type="button" icon="pi pi-bars" @click="toggle" aria-haspopup="true"
        aria-controls="overlay_menu" />
      <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
    </template>
    <template #end>
      <Button v-draggable:disable text rounded type="button" icon="pi pi-minus" @click="appWindow.minimize()"
        aria-haspopup="true" aria-controls="overlay_menu" />
      <Button v-draggable:disable text rounded type="button" icon="pi pi-times" @click="exit()" aria-haspopup="true"
        aria-controls="overlay_menu" />
    </template>
  </Toolbar>
</template>

<style scoped>
.toolbar {
  background-color: var(--highlight-bg);
  border-radius: 12px 12px 0 0;
  padding: 0;
  max-height: 40px;
}
</style>
