import { createRouter, createWebHashHistory } from 'vue-router'

// views
import General from '@/views/CKPTSelect.vue'
import CKPTs from '@/views/CKPTs.vue'

const routes = [
    {
        path: '/',
        name: 'General',
        component: General
    },
    {
        path: '/CKPTs',
        name: 'CKPTs',
        component: CKPTs
    }
]


export default createRouter({
    history: createWebHashHistory(),
    routes
})
