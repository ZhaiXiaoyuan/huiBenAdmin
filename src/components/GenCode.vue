<template>
  <div class="gen-code" :class="{'cm-disabled':time<60||!phone}" @click="genCode()">
    {{time==60?'获取验证码':time+'S'}}
  </div>
</template>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" rel="stylesheet/less">
  .gen-code{
    position: absolute;
    width: 100px;
    height: 44px;
    line-height: 44px;
    background: #409EFF;
    font-size: 0.12px;
    color: #fff;
    text-align: center;
    top:0px;
    bottom:0px;
    right: 0px;
    margin: auto;
    cursor: pointer;
    border-radius: 4px;
  }
</style>
<script>
  import Vue from 'vue'
  export default {
    components: {

    },
    props:{
      type:{
        type:String,
        default:'register',
      },
      phone:{
        type:String,
      },
      identifyCode:{
         type:String,
      },
      url:{
        type:String,
      },
      options:{
          type:Object,
      }
    },
    data: function () {
      return {
        time:60,
        isRequesting:false,
      }
    },
    computed: {},
    watch: {

    },
    methods: {
      genCode:function () {
        let that=this;
          let code=document.getElementsByClassName('code-value')[0].value;
          if(!this.identifyCode){
              this.operationFeedback({type:'warn',text:'请出入图片验证码'});
              return;
          }
          if(this.identifyCode!=code){
              this.operationFeedback({type:'warn',text:'图片验证码错误'});
              return;
          }
        if(!regex.phone.test(this.phone)){
          this.operationFeedback({type:'warn',text:regex.phoneAlert})
          return;
        }
        if(this.isRequesting||this.time<60){
          return;
        }
        this.isRequesting=true;
        let params={
          ...Vue.tools.sessionInfo(),
            telephoneNums:this.phone,
            phoneNums:this.phone
        }
        let fb=this.operationFeedback({text:'发送中...'});
        Vue.api.genPhoneCode(params,this.url).then(function (resp) {
          that.isRequesting=false;
          if(resp.respCode=='00'){
            let data=JSON.parse(resp.respMsg);
              that.options.ok&&that.options.ok(data);
            fb.setOptions({type:'complete','text':'发送成功'});
            var interval=setInterval(function () {
              if(that.time==0){
                that.time=60;
                clearInterval(interval);
              }else{
                that.time--;
              }
            },1000);
          }else{
            fb.setOptions({type:'warn','text':resp.respMsg});
          }
        });
      }
    },
    created: function () {

    },
    mounted: function () {
      /*修改父dom的position*/
      this.$el.parentNode.style.position='relative';
    }
  };
</script>
