<template>
    <div class="shop-detail">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>用户信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-row class="container-hd">
              <!--  <el-col :span="12">
                    <el-button type="primary" icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
                </el-col>-->
                <el-col :span="24" style="text-align: right;">
                   <!-- <el-button type="primary" icon="el-icon-edit" v-if="userDetail.accountState=='enable'" @click="dialogFormVisible=true">编辑</el-button>-->
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
                        <h2>
                            <el-col :span="3" style="text-align: right">总收益:</el-col>
                            <span class="cm-amount">{{(userDetail.revenue?userDetail.revenue:0)|moneyFormat}}</span>元
                        </h2>
                        <h2>
                            <el-col :span="3" style="text-align: right"> 今日收益:</el-col>
                            <span class="cm-amount">{{(userDetail.dayEarnings?userDetail.dayEarnings:0)|moneyFormat}}</span>元
                        </h2>
                        <h2>
                            <el-col :span="3" style="text-align: right"> 今月收益:</el-col>
                            <span class="cm-amount">{{(userDetail.monthEarnings?userDetail.monthEarnings:0)|moneyFormat}}</span>元
                        </h2>
                        <h2>
                            <el-col :span="3" style="text-align: right"> 今年收益:</el-col>
                            <span class="cm-amount">{{(userDetail.yearEarnings?userDetail.yearEarnings:0)|moneyFormat}}</span>元
                        </h2>
                    </el-row>
                </el-row>
            </div>
        </div>
        <el-dialog title="编辑" class="edit-dialog" :visible.sync="dialogFormVisible" width="40%">
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
            let account=JSON.parse(this.$cookie.get('account'));
            this.id=this.$route.params.id?this.$route.params.id:account.id;
            /**/
            this.getUserDetail();
        },
    }
</script>
