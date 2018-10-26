<template>
    <div class="login-wrap">
        <div class="ms-title">
            <span v-if="pageName=='login'">夜彩平台超级管理员</span>
            <span v-if="pageName=='adminLogin'">
                夜彩平台管理员
            </span>
            <span v-if="pageName=='shopLogin'">
                夜彩-商户后台
            </span>
            <span v-if="pageName=='userLogin'">
                夜彩-用户后台
            </span>
        </div>
        <div class="ms-login" v-if="pageName=='login'||pageName=='adminLogin'">
           <!-- <el-radio-group v-model="accountType" style="margin-bottom: 20px;" v-if="pageName=='adminLogin'">
                <el-radio label="marketManager">市场管理员</el-radio>
                <el-radio label="accountantManager">财务管理员</el-radio>
            </el-radio-group>-->
            <el-form :model="ruleForm"  ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="账号"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码" v-model="ruleForm.password" @keyup.enter.native="submitForm()"></el-input>
                </el-form-item>
                <el-form-item prop="identifyCode" id="identify-code" style="position:relative;">
                    <el-input type="password" placeholder="验证码" v-model="ruleForm.identifyCode" @keyup.enter.native="submitForm()" style="padding-right: 100px;"></el-input>
                    <identify style="position:absolute;top:0px;bottom: 0px;right: 0px;margin: auto;"></identify>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" size="large" @click="submitForm()">登&nbsp;录</el-button>
                </div>

            </el-form>
        </div>
        <div class="ms-login" v-if="pageName=='userLogin'">
            <el-form :model="ruleForm"  ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="phone">
                    <el-input v-model="ruleForm.phone" placeholder="手机号"></el-input>
                </el-form-item>
                <el-form-item prop="identifyCode" id="identify-code" style="position:relative;">
                    <el-input type="text" placeholder="图片验证码" v-model="ruleForm.identifyCode" @keyup.enter.native="submitForm()" style="padding-right: 100px;"></el-input>
                    <identify style="position:absolute;top:0px;bottom: 0px;right: 0px;margin: auto;"></identify>
                </el-form-item>
                <el-form-item prop="phoneCode" id="identify-code" style="position:relative;">
                    <el-input type="text" placeholder="手机验证码验证码" v-model="ruleForm.phoneCode" @keyup.enter.native="submitForm()" style="padding-right: 100px;"></el-input>
                    <gen-code :phone="ruleForm.phone" :identifyCode="ruleForm.identifyCode" :url="genCodeUrl" :options="{ok:genCodeData}"></gen-code>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" size="large" @click="submitForm()">登&nbsp;录</el-button>
                </div>

            </el-form>
        </div>
        <vFooter class="login-page-footer"></vFooter>
    </div>
</template>

<style>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;

    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        height:230px;
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
        font-size: 16px;
    }
    .ms-login .el-input--small .el-input__inner{
        height:44px !important;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:44px;
    }
    #identify-code input{
        width: 180px;
    }
    .login-page-footer{
        padding-left: 0px !important;
        background: none !important;
    }
    .login-page-footer p{
        color: #fff !important;
    }
</style>
<script>
    import Vue from 'vue'
    import Identify from '../../components/Identify'
    import vFooter from '../../components/common/Footer.vue';

    export default {
        components:{
            Identify,vFooter
        },
        data: function(){
            return {
                pageName:null,
                accountType:'marketManager',//superManager:'超级管理员',marketManager:市场管理员账号,accountantManager:财务管理员账号,shopManager:门店角色,userManager:用户角色
                ruleForm: {
                    username: '',
                    password: '',
                    identifyCode:'',
                    phone:'',
                    phoneCode:'',
                },
                genCodeUrl:null,
                codeData:null,
            }
        },
        methods: {
            submitForm() {
                if(this.pageName=='login'){
                    let code=document.getElementsByClassName('code-value')[0].value;
                    if(!this.ruleForm.username||this.ruleForm.username==''){
                        Vue.operationFeedback({type:'warn',text:'请输入账号'});
                        return;
                    }
                    if(!this.ruleForm.password||this.ruleForm.password==''){
                        Vue.operationFeedback({type:'warn',text:'请输入密码'});
                        return;
                    }
                    if(!this.ruleForm.identifyCode||this.ruleForm.identifyCode==''){
                        Vue.operationFeedback({type:'warn',text:'请输入验证码'});
                        return;
                    }
                    if(this.ruleForm.identifyCode!=code){
                        Vue.operationFeedback({type:'warn',text:'验证码错误'});
                        return;
                    }
                    let fb=Vue.operationFeedback({text:'登录中...'});
                    Vue.api.superManagerLogin({...Vue.sessionInfo(),account:this.ruleForm.username,password:this.ruleForm.password}).then((resp)=>{
                        if(resp.respCode=='00'){
                            localStorage.setItem('loginPage','login');
                            this.$cookie.set('account',JSON.stringify({
                                type:'superManager',
                                account:this.ruleForm.username,
                            }),7);
                            this.$router.push({name:'shop',params:{}});
                            fb.setOptions({type:'complete',text:'登录成功'});
                        }else{
                            fb.setOptions({type:'warn',text:'登录失败，'+resp.respMsg});
                        }
                    });
                }else if(this.pageName=='adminLogin'){
                    let code=document.getElementsByClassName('code-value')[0].value;
                    if(!this.ruleForm.username||this.ruleForm.username==''){
                        Vue.operationFeedback({type:'warn',text:'请输入账号'});
                        return;
                    }
                    if(!this.ruleForm.password||this.ruleForm.password==''){
                        Vue.operationFeedback({type:'warn',text:'请输入密码'});
                        return;
                    }
                    if(!this.ruleForm.identifyCode||this.ruleForm.identifyCode==''){
                        Vue.operationFeedback({type:'warn',text:'请输入验证码'});
                        return;
                    }
                    if(this.ruleForm.identifyCode!=code){
                        Vue.operationFeedback({type:'warn',text:'验证码错误'});
                        return;
                    }
                    let fb=Vue.operationFeedback({text:'登录中...'});
                    Vue.api.adminLogin({...Vue.sessionInfo(),account:this.ruleForm.username,password:this.ruleForm.password}).then((resp)=>{
                        if(resp.respCode=='00'){
                            let data=JSON.parse(resp.respMsg);
                            localStorage.setItem('loginPage','adminLogin');
                            this.$cookie.set('account',JSON.stringify({
                                type:data.role,
                                account:this.ruleForm.username,
                            }),7);
                            this.$router.push({name:'benefitRank',params:{}});
                            fb.setOptions({type:'complete',text:'登录成功'});
                        }else{
                            fb.setOptions({type:'warn',text:'登录失败，'+resp.respMsg});
                        }
                    });
                }else if(this.pageName=='userLogin'||this.pageName=='shopLogin'){
                    if(this.$route.query.test=='userTest'){
                        this.$cookie.set('account',JSON.stringify({
                            type:this.accountType,
                            account:15876513870,
                            id:'1922433ca7924bb5abdb7e58571207b6'
                        }),7);
                        this.$router.push({name:this.pageName=='userLogin'?'statistics':'saleStatistics',params:{}});
                        return;
                    }
                    if(!this.codeData){
                        Vue.operationFeedback({type:'warn',text:'请先发送短信获取验证码'});
                        return;
                    }
                    if(!this.ruleForm.phoneCode||this.ruleForm.phoneCode==''){
                        Vue.operationFeedback({type:'warn',text:'请输入手机验证码'});
                        return;
                    }
                    let params={
                        ...Vue.sessionInfo(),
                        bizId:this.codeData.sms.bizId,
                        phone:this.ruleForm.phone,
                        verifyCode:this.ruleForm.phoneCode
                    }
                    let fb=Vue.operationFeedback({text:'登录中...'});
                    Vue.api.checkPhoneCode(params).then((resp)=>{
                        if(resp.respCode=='00'){
                            localStorage.setItem('loginPage',this.pageName);
                            this.$cookie.set('account',JSON.stringify({
                                type:this.accountType,
                                account:this.ruleForm.phone,
                                id:this.codeData.account.id
                            }),7);
                         /*   this.$cookie.set('account',JSON.stringify({
                                type:this.accountType,
                                account:15876513870,
                                id:'1922433ca7924bb5abdb7e58571207b6'
                            }),7);*/
                            this.$router.push({name:this.pageName=='userLogin'?'statistics':'saleStatistics',params:{}});
                            fb.setOptions({type:'complete',text:'登录成功'});
                        }else{
                            fb.setOptions({type:'warn',text:'登录失败，'+resp.respMsg});
                        }
                    });
                }
            },
            getCode:function (data) {
                console.log('data:',data);
            },
            genCodeData:function (data) {
                console.log('data:',data);
                this.codeData={
                    sms:data.sms?JSON.parse(data.sms):{},
                    account:this.pageName=='userLogin'?JSON.parse(data.user):JSON.parse(data.shop),
                };
            }
        },
        mounted () {
            this.pageName=this.$route.name;
            /**/
            if(this.pageName=='userLogin'){
                this.genCodeUrl='/user/smsLogin';
                this.accountType='userManager';
            }else if(this.pageName=='shopLogin'){
                this.genCodeUrl='/shop/smsLogin';
                this.accountType='shopManager';
            }

        },
    }
</script>
