import { createRouter, createWebHashHistory } from 'vue-router'
import SignIn from '../pages/SignIn.vue'
import Todos from '../pages/Todos.vue'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: SignIn },
    { path: '/todos', component: Todos },
  ],
})
