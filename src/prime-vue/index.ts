import { App } from 'vue';
import PrimeVue from 'primevue/config';

export const usePrimeVue = (app: App) => {
  app.use(PrimeVue);
};
