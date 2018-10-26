<template>
    <div class="cm-page-content-min system-setting">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>修改密码</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="container-bd">
                <div style="width: 300px;margin: 50px auto 0px auto;">
                    <el-form label-width="40px">
                        <el-form-item label="账号">
                            <el-input v-model="account" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="密码">
                            <el-input v-model="pwd" type="password" placeholder="请输入密码"></el-input>
                        </el-form-item>
                        <el-form-item label="密码">
                            <el-input v-model="rePwd" type="password" placeholder="请再次输入密码"></el-input>
                        </el-form-item>
                    </el-form>
                    <div style="text-align: center;">
                        <el-button type="primary" style="text-align: center;" @click="save()">保存密码</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
    .system-setting{
        .container{
            min-height: 500px;
        }
    }
</style>
<script>
    import Vue from 'vue'
    export default {
        data() {
            return {
              account:'szYeahcai3870',
              pwd:'',
              rePwd:'',
            }
        },
        created(){
        },
        computed: {

        },
        methods: {
           save:function () {
               if(!this.pwd||this.pwd==''){
                   Vue.operationFeedback({type:'warn',text:'请输入密码'});
                   return;
               }
               if(this.pwd.length<6){
                   Vue.operationFeedback({type:'warn',text:'密码长度不能少于6个字符'});
                   return;
               }
               if(!this.rePwd||this.rePwd==''){
                   Vue.operationFeedback({type:'warn',text:'请再次输入密码'});
                   return;
               }
               if(this.pwd!=this.rePwd){
                   Vue.operationFeedback({type:'warn',text:'两次输入的密码不相等'});
                   return;
               }
               let params={
                   imeStamp:Vue.sessionInfo().timeStamp,
                   account:this.account,
                   newPassword:this.pwd
               }
               let fb=Vue.operationFeedback({text:'保存中...'});
               Vue.api.updateSuperManagerPassword(params).then((resp)=>{
                   if(resp.respCode=='00'){
                       fb.setOptions({type:'complete',text:'保存成功，稍后系统将退出账号，请您重新登录'});
                       setTimeout(()=>{
                           this.logout();
                       },3000)
                   }else{
                       fb.setOptions({type:'warn',text:'保存失败，'+resp.respMsg});
                   }
               })
           },
           logout:function () {
               Vue.cookie.set('account','');
               let loginPage=localStorage.getItem('loginPage');
               this.$router.push({name:loginPage?loginPage:'login'});
           }
        },
        mounted () {

        },
    }
</script>
