import { createApp } from 'vue';
import './styles.css';
import App from './App.vue';
import { usePrimeVue } from './prime-vue';

const app = createApp(App);

usePrimeVue(app);
app.mount('#app');
