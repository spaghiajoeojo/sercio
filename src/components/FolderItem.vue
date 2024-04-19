<script setup>
import { BaseDirectory, basename } from "@tauri-apps/api/path";
import { ref } from "@vue/reactivity";
import { resolveBaseDirectory } from "../services/scanner";
import Item from "../models/Item";

const props = defineProps({
  item: { type: Item, required: true },
});

const emit = defineEmits(['remove']);

const name = ref(null);

const loadName = async () => {
  if (isNaN(props.item)) {
    try {
      name.value = await basename(props.item);
    } catch {
      name.value = null;
    }
  } else {
    name.value = Object.entries(BaseDirectory).find(([k, num]) => num === props.item )[0]; 
  }
};

loadName();
</script>

<template>
  <div class="tile">
    <i class="pi pi-folder text-primary"></i>
    <div class="tile-content">
      <div class="tile-title">{{ item.name }}</div>
      <small class="tile-subtitle">{{ item.path }}</small>
    </div>
    <div class="tile-action">
        <Button text rounded severity="danger" type="button" icon="pi pi-trash" @click="emit('remove')"/>
    </div>
  </div>
</template>

<style>
.tile {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.4rem;
}

.tile:not(:last-child) {
  border-bottom: 1px solid var(--surface-border);
}

.tile-subtitle {
  color: var(--text-color-secondary);
}

.tile-content {
    flex-grow: 1;
}
</style>