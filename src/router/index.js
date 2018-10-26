import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children:[
                {
                    path: '/customerAdmin',
                    name:'customerAdmin',
                    component: resolve => require(['../page/customer/CustomerAdmin.vue'], resolve)
                },
            ]
        },
        {
            path: '/login',
            name:'login',
            component: resolve => require(['../page/account/Login.vue'], resolve)
        },
        {
            path: '/adminLogin',
            name:'adminLogin',
            component: resolve => require(['../page/account/Login.vue'], resolve)
        },
        {
            path: '/shopLogin',
            name:'shopLogin',
            component: resolve => require(['../page/account/Login.vue'], resolve)
        },
        {
            path: '/userLogin',
            name:'userLogin',
            component: resolve => require(['../page/account/Login.vue'], resolve)
        },
    ]
})
