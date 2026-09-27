import { createRouter, createWebHistory } from 'vue-router'

import Login from '../pages/Login.vue'
import Drawing from '../pages/Drawing.vue'
import Admin from '../pages/Admin.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
        path: '/',
        redirect: '/login',
        },
        {
        path: '/login',
        component: Login,
        },
        {
        path: '/drawing',
        component: Drawing,
        },
        {
        path: '/admin',
        component: Admin,
        },
    ],
})

export default router