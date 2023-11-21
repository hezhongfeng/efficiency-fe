import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import componentInit from './componentInit';

const app = createApp(App);

app.use(componentInit);
app.use(router);

app.mount('#app');
