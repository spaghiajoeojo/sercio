<script setup>
import { BaseDirectory, basename, dirname } from "@tauri-apps/api/path";
import { open } from "@tauri-apps/api/shell";
import { ref, watchEffect } from "vue";
import { resolveBaseDirectory } from "../services/scanner";
import Item from "../models/Item";
import { lookupType } from "../services/mime-types";

const props = defineProps({
  item: { type: Item, required: true },
});

const getIcon = (item) => {
  const type = lookupType(item.path);
  switch (type) {
    case 'image':
      return 'pi-image'
    case 'video':
      return 'pi-video'
    case 'audio':
      return 'pi-headphones'
    default:
      return 'pi-file'
  }
};

const icon = ref(null);
watchEffect(() => {
  icon.value = getIcon(props.item);
})

const openFile = async () => {
  console.log(props.item.path)
  await open(props.item.path);
};

const openFolder = async () => {
  await open(await dirname(props.item.path));
};

</script>

<template>
  <div class="tile">
    <i class="pi text-primary" :class="[icon]"></i>
    <div class="tile-content">
      <div class="tile-title">{{ item.name }}</div>
      <small class="tile-subtitle">{{ item.path }}</small>
    </div>
    <div class="tile-action">
      <Button text rounded type="button" icon="pi pi-folder-open" @click="openFolder()"/>
      <Button text rounded type="button" icon="pi pi-external-link" @click="openFile()" />
    </div>
  </div>
</template>

<style>
.tile {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.4rem;
  max-height: 54px;
}

.tile:not(:last-child) {
  border-bottom: 1px solid var(--surface-border);
}

.tile-subtitle {
  color: var(--text-color-secondary);
}

.tile-title, .tile-subtitle {
  display: inline-block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tile-content {
  flex-grow: 1;
  overflow: hidden;
}

.tile-action {
  flex-shrink: 0;
}

i {
  font-size: 1.5rem;
}
</style>