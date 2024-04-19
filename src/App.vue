<script setup lang="ts">
import TitleBar from './components/TitleBar.vue';
import {scanComputer} from "./services/scanner";
import Search from "./components/Search.vue";

scanComputer();

</script>

<template>
  <div class="app-wrapper">
    <Card class="card">
      <template #header>
        <TitleBar></TitleBar>
      </template>
      <template #content>
        <div class="app-content">
          <Search ref="search"/>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.app-wrapper {
  height: 100vh;
  overflow: hidden;
}

.app-content {
  height: calc(100vh - 80px);
}

.card {
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
  margin: 8px;
  overflow: hidden;
  height: calc(100% - 16px);
  width: calc(100% - 16px);
}
</style>
