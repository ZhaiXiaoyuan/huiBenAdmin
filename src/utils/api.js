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
    let basicUrl=false&&process.env.NODE_ENV=='development'?'http://zyu-server.wicp.net:19356/yecai':'http://zyu-server.wicp.net:12412/';
/*      let basicUrl=false&&process.env.NODE_ENV=='development'?'http://api.yeahcai.com/yecai':'https://api.linqi.tech:34631';*/

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
        //获取用户基本信息
        getUserDetail:function (params) {
            let options={...sessionInfo(),
                api:'xyzh.user/user/getUserInfo',
                apiParams:params
            }
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl,
                params: {data:JSON.stringify(options)}
            });
        },
        //获取用户宝贝信息
        getUserBabyList:function (params) {
            let options={...sessionInfo(),
                api:'xyzh.user/user/getUserBabyList',
                apiParams:params
            }
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl,
                params: {data:JSON.stringify(options)}
            });
        },
        //获取用户备注
        getUserRemarkList:function (params) {
            let options={...sessionInfo(),
                api:'xyzh.user/user/getUserRemarkList',
                apiParams:params
            }
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl,
                params: {data:JSON.stringify(options)}
            });
        },
        //添加备注
        addUserRemark:function (params) {
            let options={...sessionInfo(),
                api:'xyzh.user/user/addUserRemark',
                apiParams:params
            }
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl,
                params: {data:JSON.stringify(options)}
            });
        },
        //更新用户备注
        updateUserRemark:function (params) {
            let options={...sessionInfo(),
                api:'xyzh.user/user/updateUserRemark',
                apiParams:params
            }
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl,
                params: {data:JSON.stringify(options)}
            });
        },
        //删除用户备注
        removeUserRemark:function (params) {
            let options={...sessionInfo(),
                api:'xyzh.user/user/removeUserRemark',
                apiParams:params
            }
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl,
                params: {data:JSON.stringify(options)}
            });
        },
        //获取用户借阅订单信息
        getUserBorrowOrderList:function (params) {
            let options={...sessionInfo(),
                api:'xyzh.trade/borrowOrder/getUserBorrowOrder',
                apiParams:params
            }
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl,
                params: {data:JSON.stringify(options)}
            });
        },
        //运营管理员最终结算
        finishBorrowOrder:function (params) {
            let options={...sessionInfo(),
                api:'xyzh.trade/borrowOrder/finishBorrowOrder',
                apiParams:params
            }
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl,
                params: {data:JSON.stringify(options)}
            });
        },
        //获取某个借阅订单信息
        getBorrowOrder:function (params) {
            let options={...sessionInfo(),
                api:'xyzh.trade/borrowOrder/getBorrowOrder',
                apiParams:params
            }
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl,
                params: {data:JSON.stringify(options)}
            });
        },
        //管理员账号登录
        login:function (params) {
            let options={...sessionInfo(),
                api:'xyzh.system/admin/login',
                apiParams:params
            }
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl,
                params: {data:JSON.stringify(options)}
            });
        },
        //获取banner分页列表
        getBannerList:function (params) {
            let options={...sessionInfo(),
                api:'xyzh.system/banner/getBannerInfo',
                apiParams:params
            }
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl,
                params: {data:JSON.stringify(options)}
            });
        },
        //新增banner行
        addBanner:function (params) {
            let options={...sessionInfo(),
                api:'xyzh.system//banner/addBanner',
                apiParams:params
            }
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl,
                params: {data:JSON.stringify(options)}
            });
        },
        //编辑banner信息
        updateBanner:function (params) {
            let options={...sessionInfo(),
                api:'xyzh.system/banner/updateBannerInfo',
                apiParams:params
            }
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl,
                params: {data:JSON.stringify(options)}
            });
        },
        //banner上移下移
        swapBannerSort:function (params) {
            let options={...sessionInfo(),
                api:'xyzh.system/banner/swapBannerSort',
                apiParams:params
            }
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl,
                params: {data:JSON.stringify(options)}
            });
        },
        //移除banner
        removeBanner:function (params) {
            let options={...sessionInfo(),
                api:'xyzh.system/banner/removeBanner',
                apiParams:params
            }
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl,
                params: {data:JSON.stringify(options)}
            });
        },
        //获取推荐书单列表
        getBookListList:function (params) {
            let options={...sessionInfo(),
                api:'xyzh.book/recommendBookList/getRecommendBookList',
                apiParams:params
            }
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl,
                params: {data:JSON.stringify(options)}
            });
        },
        //创建推荐书单
        addBookList:function (params,file) {
            let options={...sessionInfo(),
                api:'xyzh.book/recommendBookList/addRecommendBookList',
                apiParams:params
            }
            let allParams=new FormData();
            if(file){
                allParams.append('coverPicFile',file);
            }
            allParams.append('data',JSON.stringify(options));
            console.log('allParams:',allParams);
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl,
                params: allParams
            });
        },
        //更新推荐书单
        updateBookList:function (params) {
            let options={...sessionInfo(),
                api:'xyzh.book/recommendBookList/updateRecommendBookList',
                apiParams:params
            }
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl,
                params: {data:JSON.stringify(options)}
            });
        },
        //删除推荐书单
        deleteBookList:function (params) {
            let options={...sessionInfo(),
                api:'xyzh.book/recommendBookList/delRecommendBookList',
                apiParams:params
            }
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl,
                params: {data:JSON.stringify(options)}
            });
        },
        //获取sku列表
        getGoodsList:function (params) {
            let options={...sessionInfo(),
                api:'xyzh.book/book/getBookSkuList',
                apiParams:params
            }
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl,
                params: {data:JSON.stringify(options)}
            });
        },
        //获取标签列表
        getLabelList:function (params) {
            let options={...sessionInfo(),
                api:'xyzh.book/label/getLabelList',
                apiParams:params
            }
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl,
                params: {data:JSON.stringify(options)}
            });
        },
        //添加新的sku
        addGoods:function (params,file) {
            let options={...sessionInfo(),
                api:'xyzh.book/book/addBookSku',
                apiParams:params
            }
            let allParams=new FormData();
            if(file){
                allParams.append('coverPicFile',file);
            }
            allParams.append('data',JSON.stringify(options));
            console.log('allParams:',allParams);
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl,
                params: allParams
            });
        },
        //获取平台建议列表
        getAdviceList:function (params) {
            let options={...sessionInfo(),
                api:'xyzh.suggestion/suggestion/getSuggestionInfo',
                apiParams:params
            }
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl,
                params: {data:JSON.stringify(options)}
            });
        },
        //管理员批量审核平台建议
        adminAuditInBatch:function (params) {
            let options={...sessionInfo(),
                api:'xyzh.suggestion/suggestion/adminAuditInBatch',
                apiParams:params
            }
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl,
                params: {data:JSON.stringify(options)}
            });
        },
        //管理员批量审核平台建议
        adminAuditInBatch:function (params) {
            let options={...sessionInfo(),
                api:'xyzh.suggestion/suggestion/adminAuditInBatch',
                apiParams:params
            }
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl,
                params: {data:JSON.stringify(options)}
            });
        },
        //设置sku状态
        setGoodsStatus:function (params) {
            let options={...sessionInfo(),
                api:'xyzh.book/book/setBookSkuState',
                apiParams:params
            }
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl,
                params: {data:JSON.stringify(options)}
            });
        },
        //更新现有sku信息
        updateGoods:function (params,file) {
            let options={...sessionInfo(),
                api:'xyzh.book/book/updateBookSkuBaseInfo',
                apiParams:params
            }
            let allParams=new FormData();
            if(file){
                allParams.append('coverPicFile',file);
            }
            allParams.append('data',JSON.stringify(options));
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl,
                params: allParams
            });
        },
        updateGoods:function (params,file) {
            let options={...sessionInfo(),
                api:'xyzh.book/book/updateBookSkuBaseInfo',
                apiParams:params
            }
            let allParams=new FormData();
            if(file){
                allParams.append('coverPicFile',file);
            }
            allParams.append('data',JSON.stringify(options));
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl,
                params: allParams
            });
        },
        //删除某个sku
        deleteGoods:function (params,file) {
            let options={...sessionInfo(),
                api:'xyzh.book/book/delBookSku',
                apiParams:params
            }
            let allParams=new FormData();
            if(file){
                allParams.append('coverPicFile',file);
            }
            allParams.append('data',JSON.stringify(options));
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl,
                params: allParams
            });
        },
    }
  },

}
