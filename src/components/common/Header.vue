<template>
    <div class="header">
        <div class="collapse-btn" @click="collapseChage">
            <i class="el-icon-menu"></i>
        </div>
        <div class="logo">
            夜彩平台·<span v-if="accountInfo.type=='superManager'">超级管理员</span>
            <span v-if="accountInfo.type=='marketManager'">市场管理员</span>
            <span v-if="accountInfo.type=='accountantManager'">财务管理员</span>
            <span v-if="accountInfo.type=='userManager'">用户</span>
            <span v-if="accountInfo.type=='shopManager'">门店</span>
        </div>
        <div class="user-info">
            <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                    <img class="user-logo" src="../../../static/img/img.jpg">
                 {{accountInfo.account}}
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="loginout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                name: 'linxin',
                accountInfo:{},
            }
        },
        computed:{

        },
        methods:{
            handleCommand(command) {
                if(command == 'loginout'){
                    Vue.cookie.set('account','');
                    let loginPage=localStorage.getItem('loginPage');
                    this.$router.push({name:loginPage?loginPage:'login'});
                }
            },
            collapseChage(){
                this.collapse = !this.collapse;
                bus.$emit('collapse', this.collapse);
            }
        },
        created(){
           /* this.accountInfo=this.getAccountInfo();*/
        }
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        line-height: 70px;
        color: #fff;
    }
    .collapse-btn{
        float: left;
        padding: 0 21px;
        cursor: pointer;
    }
    .collapse-btn:hover{
        background: rgb(40,52,70);
    }
    .header .logo{
        float: left;
        width:250px;
        /* text-align: center; */
    }
    .user-info {
        float: right;
        padding-right: 50px;
        font-size: 16px;
        color: #fff;
    }
    .user-info .el-dropdown-link{
        position: relative;
        display: inline-block;
        padding-left: 50px;
        color: #fff;
        cursor: pointer;
        vertical-align: middle;
    }
    .user-info .user-logo{
        position: absolute;
        left:0;
        top:15px;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
</style>
