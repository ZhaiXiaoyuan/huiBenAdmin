import Vue from 'vue';
import App from './App';
import router from './router';
import vueResource from 'vue-resource';
import vueCookie from 'vue-cookie'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";

import api from './utils/api'
import tools from './utils/tools'
import './utils/filters'
import components from './components'

Vue.use(ElementUI, { size: 'small' });

/*---安装第三方插件---*/
Vue.use(vueResource);
Vue.use(vueCookie);

/*---安装自定义插件---*/
Vue.use(api);
Vue.use(tools);
Vue.use(components);

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    if(to.meta.permission){
        const role = localStorage.getItem('ms_username');
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin' ? next() : next('/login');
    }else{
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if(navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor'){
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        }else{
            next();
        }
    }
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
