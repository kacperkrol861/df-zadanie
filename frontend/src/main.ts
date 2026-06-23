import { createApp } from 'vue'
import App from './App.vue'

import { createPinia } from 'pinia'
import router from './router'

import { createVuestic } from 'vuestic-ui'
import 'vuestic-ui/styles/essential.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(createVuestic())

app.mount('#app')