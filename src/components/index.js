/**
 * Created by Designer on 2018/1/23.
 */

import Distpicker from './Distpicker';
import OperationFeedback from './OperationFeedback';
import ViewPicModal from './ViewPicModal';
import GenCode from './GenCode';


/*全局组件注册配置*/
export default {
  install:function(Vue){
    /*标签调度方式*/
    Vue.component('v-distpicker',Distpicker);
    Vue.component('OperationFeedback',OperationFeedback);
    Vue.component('ViewPicModal',ViewPicModal);
    Vue.component('GenCode',GenCode);

    /*方法调度方式*/
    let OperationFeedbackConstructor = Vue.extend(OperationFeedback);
    let ViewPicModalConstructor = Vue.extend(ViewPicModal);
    const functionObject={
        /**
         * 操作提示
         * @param options object
         */
        operationFeedback:function (options) {
            options={...{
                parent:'app',//添加提示框的容器,该容器的position属性值须是'relative'
                parentPosition:'relative',//父元素属性值须是'relative'或者fixed
                tipsPosition:'fixed',//添加提示框的position属性值须是'absolute'或者fixed
                type:'operating',//提示类型，operating:正在处理,complete:处理完成,warn:错误警告,tips:提示
                text:'正在处理',//要提示的文本,
                delayForDelete:3000,//提示框消失延时,
                mask:false//是否显示蒙版
            },...options};
            if(options.parent=='app'){
                options.parentPosition='static';
            }
            //
            let parentEle=document.getElementById(options.parent);
            //
            let instance=new OperationFeedbackConstructor({
                data:{...options}
            });
            instance.$mount();
            parentEle.appendChild(instance.$el);
            //设置参数
            function setOptions(obj) {
                Object.assign(instance,obj);
            }
            return{
                setOptions:setOptions
            }
        },
        /**
         * 查看照片弹窗
         * @param options
         */
        viewPicModal:function (options) {
            options={...{
               imgUrl:null,
            },...options};
            //
            let parentEle=document.getElementById('app');
            //
            let instance=new ViewPicModalConstructor({});
            instance.options=options;
            instance.$mount();
            parentEle.appendChild(instance.$el);
        },
    }
    /**/
    Object.assign(Vue,functionObject);
    Object.assign(Vue.prototype,functionObject);
  }
};
