<template>
    <div class="shop-detail">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>操作日志</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="container-bd">
                <p style="font-size:20px;padding:40px;color:#666;text-align:center">敬请期待</p>
            </div>
        </div>
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
