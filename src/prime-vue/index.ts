import { App } from 'vue';
import PrimeVue from 'primevue/config';
import Menu from 'primevue/menu';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Toolbar from 'primevue/toolbar';
import InputGroup from 'primevue/inputgroup';
import Dialog from 'primevue/dialog';
import DataView from 'primevue/dataview';
import ScrollPanel from 'primevue/scrollpanel';
import InputText from 'primevue/inputtext';

export const usePrimeVue = (app: App) => {
  app.use(PrimeVue);
  app.component(Menu.name, Menu);
  app.component(Button.name, Button);
  app.component(Card.name, Card);
  app.component(Toolbar.name, Toolbar);
  app.component(InputGroup.name, InputGroup);
  app.component(Dialog.name, Dialog);
  app.component(DataView.name, DataView);
  app.component(ScrollPanel.name, ScrollPanel);
  app.component(InputText.name, InputText);
};
