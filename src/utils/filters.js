/**
 * Created by Administrator on 2016/9/28 0028.
 */

/**
 * vue所需要的filter都放在这里
 * 在js里面可以这样直接调用：Vue.filter('getLocalISOString')(new Date())
 * */
import Vue from 'vue'

/*格式化时间*/
Vue.filter('formatDate',function(date,fmt){
  if(typeof date !=Date){
    date=new Date(date);
  }
  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
});

/*格式化金额*/
Vue.filter('moneyFormat',function(str){
    return (str/100).toFixed(2);
});

/*订单状态*/
Vue.filter('orderStatus',function(str){
    str+='';
    let result='';
    switch (str){
        //"waitPay","waitSent","waitReach","borrowing", "waitReturn","waitInventory","waitSettlement","finish","cancel"
        //待付款，待发货，待收货，借阅中，待归还，待入库，待结算，已结算，取消
        case 'waitPay':
            result='待付款';
            break;
        case 'waitSent':
            result='待发货';
            break;
        case 'waitReach':
            result='待收货';
            break;
        case 'borrowing':
            result='借阅中';
            break;
        case 'waitReturn':
            result='待归还';
            break;
        case 'waitInventory':
            result='待入库';
            break;
        case 'waitSettlement':
            result='待结算';
            break;
        case 'finish':
            result='已结算';
            break;
        case 'cancel':
            result='已取消';
            break;
    }
    return result;
});

/*值空时显示字符*/
Vue.filter('empty',function(str){
    return str?str:'-';
});
