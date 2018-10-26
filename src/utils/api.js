/**
 * Created by Designer on 2017/12/21.
 */
import router from '../router'


export default {
  install: function (Vue, options) {


    Vue.http.options.emulateJSON = true;
    Vue.http.interceptors.push((request, next)  =>{

      next((response) => {
        //对于有作登录状态的接口你，未未登录时跳转到登录页
        if(response.status==401){
         /* router.push({name:''});*/
        }
        return response
      });

    });
    /*自定义ajax函数，自带的不好用*/
    Vue.http.ajax = async function (options) {
      if(options.method.toUpperCase() == 'GET'){
        let res = await Vue.http.get(options.url, {params: options.params});
        if(typeof res.body == 'string'){
          return JSON.parse(res.body);
        }else{
          return res.body;
        }
      }else if(options.method.toUpperCase() == 'POST'){
        let res = await Vue.http.post(options.url, options.params,);
        if(typeof res.body == 'string'){
          return JSON.parse(res.body);
        }else{
          return res.body;
        }
      }
    }

    /**/
    //临时测试
  /*  let basicUrl=false&&process.env.NODE_ENV=='development'?'http://zyu-server.wicp.net:19356/yecai':'http://api.yeahcai.com/yecai';*/
      let basicUrl=false&&process.env.NODE_ENV=='development'?'http://api.yeahcai.com/yecai':'https://api.linqi.tech:34631';

      function sessionInfo() {
          return{
              token:'',
              timeStamp:Date.parse(new Date())/1000,
              random:parseInt(Math.random()*1000000),
              signature:''
          }
      }
    Vue.api={
        //获取用户列表
      getUserList:function (params) {
          let options={...sessionInfo(),
              api:'xyzh.user/user/getUserList',
              apiParams:params
          }
        return Vue.http.ajax({
          method: 'post',
          url: basicUrl,
          params: {data:JSON.stringify(options)}
        });
      },
    }
  },

}
