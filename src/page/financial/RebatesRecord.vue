<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>财务系统</el-breadcrumb-item>
                <el-breadcrumb-item>返点记录</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <p style="font-size:20px;padding:40px;color:#666;text-align:center">敬请期待</p>
        </div>
    </div>
</template>
<style scoped>
    .handle-box{
        margin-bottom: 20px;
    }
    .handle-select{
        width: 120px;
    }
    .handle-input{
        width: 300px;
        display: inline-block;
    }
</style>
<script>
    import Vue from 'vue'
    let XLSX = require('xlsx');
    export default {
        data() {
            return {

                pager:{
                    pageIndex:1,
                    pageSize:20,
                    total:0,
                },
                keyword:null,
                entryList:[],

                dialogFormVisible: false,
                form:{},
                formLabelWidth: '120px',
            }
        },
        created(){
        },
        computed: {
        },
        methods: {
            percentFormatter(row, column) {
                return row.revenue+'%';
            },
            getList:function (pageIndex) {
                this.pager.pageIndex=pageIndex?pageIndex:1;
                let params={
                    ...Vue.sessionInfo(),
                    pageIndex:this.pager.pageIndex,
                    pageSize:this.pager.pageSize,
                    searchContent:this.keyword,
                }
                Vue.api.getAccountantManagerList(params).then((resp)=>{
                    if(resp.respCode=='00'){
                        let data=JSON.parse(resp.respMsg);
                        this.entryList=JSON.parse(data.userList);
                        this.pager.total=data.userCount;
                    }
                });
            },
            add:function () {
                let params={
                    ...Vue.sessionInfo(),
                    ...this.form
                }
                let fb=Vue.operationFeedback({text:'保存中...'});
                Vue.api.addUser(params).then((resp)=>{
                    if(resp.respCode=='00'){
                        this.getList();
                        this.dialogFormVisible = false;
                        fb.setOptions({type:'complete',text:'新建成功'});
                    }else{
                        fb.setOptions({type:'warn',text:'新建失败，'+resp.respMsg});
                    }
                });
            },
            addUserChangeArea:function (data) {
                if(data.type=='province'){
                    this.form.province=data.value;
                }else if(data.type=='city'){
                    this.form.city=data.value;
                }else if(data.type=='area'){
                    this.form.county=data.value;
                }
            },
        },
        mounted () {
            /**/
         /*   this.getList();*/

        },
    }
</script>
