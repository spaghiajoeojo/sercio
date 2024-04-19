<script setup>
import { ref } from "vue";
import { searchByName } from "../services/database";
import Item from "./Item.vue";

const query = ref("");
let page = 0;
const results = ref([]);

const search = async () => {
  results.value = await searchByName(query.value, page);
  page += 1;
};
const onNewSearchRequest = () => {
  page = 0;
  search();
}

defineExpose({
  search,
});
</script>

<template>
  <div class="wrapper">
    <div class="search-bar">
      <InputGroup>
        <span class="logo"></span>
        <InputText placeholder="Search something..." @keypress.enter="onNewSearchRequest()" v-model="query" />
        <Button icon="pi pi-search" @click="search()" />
      </InputGroup>
    </div>
    <div class="results">
      <DataView :value="results" :data-key="'search-results'">
        <template #list="slotProps">
          <Item v-for="(item, index) in slotProps.items" :key="index" :item></Item>
        </template>
      </DataView>
    </div>
  </div>
</template>

<style scoped>
.logo {
  width: 3rem;
  min-width: 3rem;
  margin-right: 1rem;
  user-select: none;
  display: flex;
  background-image: url("../assets/app-icon.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  image-rendering: pixelated;
}

.wrapper {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: 100%;
  gap: 1rem
}

.results {
  flex-grow: 1;
  overflow-y: scroll;
}
</style>
