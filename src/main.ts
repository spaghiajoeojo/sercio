import { createApp } from 'vue';
import './styles.css';
import 'vue-tauri-draggable/style.css';
import 'primeicons/primeicons.css'
import App from './App.vue';
import { usePrimeVue } from './prime-vue';
import vueTauriDraggable from 'vue-tauri-draggable';

const app = createApp(App);

usePrimeVue(app);
app.use(vueTauriDraggable)
app.mount('#app');
