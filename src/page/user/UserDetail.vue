<template>
    <div class="shop-detail">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>账户系统</el-breadcrumb-item>
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
                <el-breadcrumb-item>用户详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-row class="container-hd">
                <el-col :span="12">
                    <el-button type="primary" icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
                </el-col>
                <el-col :span="12" style="text-align: right;">
                    <el-button type="primary" icon="el-icon-delete" v-if="userDetail.accountState!='del'" @click="del()">删除</el-button>
                    <el-button type="primary" icon="el-icon-warning" v-if="userDetail.accountState=='enable'" @click="disable()">禁用</el-button>
                    <el-button type="primary" icon="el-icon-view" v-if="userDetail.accountState=='disable'" @click="enable()">恢复</el-button>
                    <el-button type="primary" icon="el-icon-edit" v-if="userDetail.accountState=='enable'" @click="dialogFormVisible=true">编辑</el-button>
                </el-col>
            </el-row>
            <div class="container-bd">
                <el-row class="block">
                    <el-row class="info-row">
                        <el-col :span="3" style="text-align: right;">手机号：</el-col>
                        <el-col :span="6">
                            {{userDetail.phoneNums}}</el-col>
                        <el-col :span="4">
                            状态:
                            <span v-if="userDetail.accountState=='enable'">可用</span>
                            <span v-if="userDetail.accountState=='disable'">禁止</span>
                            <span v-if="userDetail.accountState=='del'">已删除</span>
                        </el-col>
                    </el-row>
                    <el-row class="info-row">
                        <el-col :span="3" style="text-align: right;"> 姓名：</el-col>
                        {{userDetail.name}}
                    </el-row>
                    <el-row class="info-row">
                        <el-col :span="3" style="text-align: right;"> 身份证：</el-col>
                        {{userDetail.idCard}}</el-row>
                    <el-row class="info-row">
                        <el-col :span="3" style="text-align: right;">  邮箱：</el-col>
                        {{userDetail.email}}
                    </el-row>
                    <el-row class="info-row">
                        <el-col :span="3" style="text-align: right;">  开户行：</el-col>
                        {{userDetail.bankName}}</el-row>
                    <el-row class="info-row">
                        <el-col :span="3" style="text-align: right;">   支行：</el-col>
                        {{userDetail.subbranch}}
                    </el-row>
                    <el-row class="info-row">
                        <el-col :span="3" style="text-align: right;">   银行账户：</el-col>
                        {{userDetail.bankAccount}}
                    </el-row>
                </el-row>
                <el-row class="block">
                    <el-row class="info-row">
                        <h2>总收益:<span class="cm-amount">{{(userDetail.revenue?userDetail.revenue:0)|moneyFormat}}</span>元</h2>
                    </el-row>
                </el-row>
            </div>
        </div>
        <el-dialog title="编辑" class="edit-dialog" :visible.sync="dialogFormVisible"  v-if="dialogFormVisible" width="40%">
            <el-row type="flex">
                <el-col :sm="24" :md="22" :lg="20">
                    <el-form :model="form">
                        <el-form-item label="手机号码" :label-width="formLabelWidth">
                            <el-input v-model="form.phoneNums" disabled maxLength="50" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="姓名" :label-width="formLabelWidth">
                            <el-input v-model="form.name" maxLength="50" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="身份证" :label-width="formLabelWidth">
                            <el-input v-model="form.idCard" maxLength="50" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="邮件" :label-width="formLabelWidth">
                            <el-input v-model="form.email" maxLength="50" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="银行名称" :label-width="formLabelWidth">
                            <el-input v-model="form.bankName" maxLength="50" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="分行" :label-width="formLabelWidth">
                            <el-input v-model="form.subbranch" maxLength="50" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="银行账号" :label-width="formLabelWidth">
                            <el-input v-model="form.bankAccount" maxLength="50" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="地区" :label-width="formLabelWidth">
                            <v-distpicker class="cm-area-picker" :province="form.province" :city="form.city" :area="form.county" @selected="changeArea"></v-distpicker>
                        </el-form-item>
                        <el-form-item label="详细地址" :label-width="formLabelWidth">
                            <el-input v-model="form.address" maxLength="100" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary"
                           :disabled="!form.phoneNums||form.phoneNums==''
                           ||!form.name||form.name==''
                           ||!form.idCard||form.idCard==''
                           ||!form.email||form.email==''
                           ||!form.bankName||form.bankName==''
                           ||!form.subbranch||form.subbranch==''
                           ||!form.bankAccount||form.bankAccount==''
                           ||!form.province||form.province==''
                           ||!form.city||form.city==''
                           ||!form.county||form.county==''
                           ||!form.address||form.address==''"
                           @click="update()">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
    .shop-detail{
        max-width: 1000px;
    }
   .block{
       padding: 10px;
       &+.block{
           border-top: 1px solid #E4E7ED;
       }
   }
    .info-row{
        font-size: 16px;
        color: #606266;
        &+.info-row{
            margin-top: 10px;
        }
    }
    .img-item{
        color: #606266;
        font-size: 14px;
        img{
            width: 140px;
            height: 140px;
            margin-bottom: 5px;
        }
    }
    .edit-dialog{
        .el-dialog{
            width: 500px;
        }
    }
    .cm-amount{
        font-size: 32px;
    }
</style>
<script>
    import Vue from 'vue'
    export default {
        data() {
            return {
                dialogFormVisible: false,
                form:{province: '', city: '', county: ''},
                formLabelWidth: '120px',

                id:null,
                userDetail:{},
            }
        },
        created(){
        },
        computed: {

        },
        methods: {
            getUserDetail:function () {
                Vue.api.getUserDetail({...Vue.sessionInfo(),userId:this.id}).then((resp)=>{
                    if(resp.respCode=='00'){
                        this.userDetail=JSON.parse(resp.respMsg);
                        this.form=Object.assign({},this.userDetail);
                        console.log('this.form:',this.form);
                    }
                });
            },
            del:function () {
                this.$confirm('确定删除该用户?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then((data) => {
                    let fb=Vue.operationFeedback({text:'删除中...'});
                    Vue.api.setUserState({...Vue.sessionInfo(),userId:this.id,state:'del'}).then((resp)=>{
                        if(resp.respCode=='00'){
                            this.userDetail.accountState='del';
                            fb.setOptions({type:'complete',text:'删除成功'});
                            setTimeout(()=>{
                                window.history.go(-1);
                            },1500);
                        }else{
                            fb.setOptions({type:'warn',text:'删除失败，'+resp.respMsg});
                        }
                    });
                }).catch((data) => {

                });
            },
            disable:function () {
                this.$confirm('确定禁用该用户?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then((data) => {
                    let fb=Vue.operationFeedback({text:'操作中...'});
                    Vue.api.setUserState({...Vue.sessionInfo(),userId:this.id,state:'disable'}).then((resp)=>{
                        if(resp.respCode=='00'){
                            this.userDetail.accountState='disable';
                            fb.setOptions({type:'complete',text:'操作成功'});
                        }else{
                            fb.setOptions({type:'warn',text:'操作失败，'+resp.respMsg});
                        }
                    });
                }).catch((data) => {

                });
            },
            enable:function () {
                this.$confirm('确定恢复该用户?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then((data) => {
                    let fb=Vue.operationFeedback({text:'操作中...'});
                    Vue.api.setUserState({...Vue.sessionInfo(),userId:this.id,state:'enable'}).then((resp)=>{
                        if(resp.respCode=='00'){
                            this.userDetail.accountState='enable';
                            fb.setOptions({type:'complete',text:'操作成功'});
                        }else{
                            fb.setOptions({type:'warn',text:'操作失败，'+resp.respMsg});
                        }
                    });
                }).catch((data) => {

                });
            },
            update:function () {
                this.form.phoneNums=undefined;
                let params={
                    ...Vue.sessionInfo(),
                    userId:this.id,
                    ...this.form
                }
                let fb=Vue.operationFeedback({text:'保存中...'});
                Vue.api.updateUserInfo(params).then((resp)=>{
                    if(resp.respCode=='00'){
                        Object.assign(this.userDetail,this.form);
                        this.dialogFormVisible = false;
                        fb.setOptions({type:'complete',text:'保存成功'});
                    }else{
                        fb.setOptions({type:'warn',text:'保存失败，'+resp.respMsg});
                    }
                });
            },
            changeArea:function (data) {
                console.log('data:',data);
                this.form.province=data.province.value;
                this.form.city=data.city.value;
                this.form.area=data.area.value;
                this.form.county=data.area.value;
            }
        },
        mounted () {
            /**/
            this.id=this.$route.params.id;
            /**/
            this.getUserDetail();
        },
    }
</script>
