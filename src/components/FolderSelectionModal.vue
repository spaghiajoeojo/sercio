<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getFolders } from '../services/config';
import { resolveBaseDirectory } from '../services/scanner';
import FolderItem from './FolderItem.vue';
import Item from '../models/Item';

const visible = defineModel({
  default: false
});

const items = ref<Item[]>([])

const loadItems = async () => {
  const folders = await getFolders();
  const promises = folders.map(resolveBaseDirectory);
  items.value = await Promise.all(promises);
}

onMounted(() => {
  loadItems();
})

</script>

<template>
  <Dialog v-model:visible="visible" modal header="Folders selected" :style="{ 'min-width': '400px' }">
    <template #default>
      <div class="actions">
        <Button severity="secondary" outlined label="Reset"/>
        <Button icon="pi pi-plus" label="Add folder"/>
      </div>
      <DataView :value="items" :data-key="'folders'">
        <template #list="slotProps">
          <FolderItem v-for="(item, index) in slotProps.items" :key="index" :item></FolderItem>
        </template>
      </DataView>
    </template>
    <template #footer>
      <div class="save-button">
        <Button>Save</Button>
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
.save-button {
  margin: 0.4rem;
}

.actions {
  display: flex;
  justify-content: space-between;
}
</style>
