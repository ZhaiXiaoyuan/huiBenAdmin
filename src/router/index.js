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
                {
                    path: '/orderAdmin',
                    name:'orderAdmin',
                    component: resolve => require(['../page/order/OrderAdmin.vue'], resolve)
                },
                {
                    path: '/bannerAdmin',
                    name:'bannerAdmin',
                    component: resolve => require(['../page/banner/BannerAdmin.vue'], resolve)
                },
                {
                    path: '/bookListAdmin',
                    name:'bookListAdmin',
                    component: resolve => require(['../page/book/BookListAdmin.vue'], resolve)
                },
                {
                    path: '/goodsAdmin',
                    name:'goodsAdmin',
                    component: resolve => require(['../page/book/GoodsAdmin.vue'], resolve)
                },
                {
                    path: '/adviceAdmin',
                    name:'adviceAdmin',
                    component: resolve => require(['../page/wish/AdviceAdmin.vue'], resolve)
                },
                {
                    path: '/cardAdmin',
                    name:'cardAdmin',
                    component: resolve => require(['../page/card/CardAdmin.vue'], resolve)
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
