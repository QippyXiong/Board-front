import { createRouter, createWebHashHistory } from 'vue-router'

// views
import General from '@/views/CKPTSelect.vue'
import CKPTs from '@/views/CKPTCompare.vue'

const routes = [
    {
        path: '/',
        name: 'General',
        component: General
    },
    {
        path: '/CKPTsCompare',
        name: 'CKPTsCompare',
        component: CKPTs
    }
]


export default createRouter({
    history: createWebHashHistory(),
    routes
})
