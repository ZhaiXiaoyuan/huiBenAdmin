<template>
    <div class="cm-page-content-min">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="container-bd">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="市场管理员" name="first">
                        <el-row class="handle-box">
                            <el-button type="primary" icon="el-icon-plus" @click="handle('add')">新建</el-button>
                        </el-row>
                        <el-table :data="marketManagerList" border style="width: 100%;" ref="multipleTable">
                            <el-table-column label="序号" align="center" width="50">
                                <template slot-scope="scope">
                                    {{scope.$index+1}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="account" label="手机号" align="center"></el-table-column>
                            <el-table-column prop="name" label="姓名"  align="center"></el-table-column>
                            <el-table-column label="状态"  align="center">
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.state" @change="setState(scope.row)" placeholder="请选择">
                                        <el-option
                                            v-for="item in options"
                                            :disabled="item.disabled"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作"  align="center">
                                <template slot-scope="scope">
                                    <el-button type="primary" icon="el-icon-edit" @click="handle('edit',scope.row)">编辑</el-button>
                                    <el-button type="primary" icon="el-icon-delete" @click="del(scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination">
                            <el-pagination
                                @current-change ="getMarketManagerList"
                                layout="prev, pager, next"
                                :page-size="marketManagerPager.pageSize"
                                :total="marketManagerPager.total">
                            </el-pagination>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="会计管理员" name="second">
                        <el-row class="handle-box">
                            <el-button type="primary" icon="el-icon-plus" @click="handle('add')">新建</el-button>
                        </el-row>
                        <el-table :data="accountantManagerList" border style="width: 100%;" ref="multipleTable2">
                            <el-table-column label="序号" align="center" width="50">
                                <template slot-scope="scope">
                                    {{scope.$index+1}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="account" label="手机号" align="center"></el-table-column>
                            <el-table-column prop="name" label="姓名"  align="center"></el-table-column>
                            <el-table-column label="状态"  align="center">
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.state" @change="setState(scope.row)" placeholder="请选择">
                                        <el-option
                                            v-for="item in options"
                                            :disabled="item.disabled"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作"  align="center">
                                <template slot-scope="scope">
                                    <el-button type="primary" icon="el-icon-edit" @click="handle('edit',scope.row)">编辑</el-button>
                                    <el-button type="primary" icon="el-icon-delete" @click="del(scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination">
                            <el-pagination
                                @current-change ="getAccountantManagerList"
                                layout="prev, pager, next"
                                :page-size="accountantManagerPager.pageSize"
                                :total="accountantManagerPager.total">
                            </el-pagination>
                        </div>
                    </el-tab-pane>
                </el-tabs>
                <el-dialog :title="(handleType=='add'?'新建':'编辑')+(activeName=='first'?'市场管理员':'会计管理员')" class="edit-dialog" :visible.sync="dialogFormVisible"  v-if="dialogFormVisible" width="40%">
                    <el-row type="flex">
                        <el-col :sm="24" :md="22" :lg="20">
                            <el-form :model="form">
                                <el-form-item label="手机号" :label-width="formLabelWidth">
                                    <el-input v-model="form.phoneNums" maxLength="50" auto-complete="off"></el-input>
                                </el-form-item>
                                <el-form-item label="姓名" :label-width="formLabelWidth">
                                    <el-input v-model="form.name" maxLength="50" auto-complete="off"></el-input>
                                </el-form-item>
                                <el-form-item label="密码" :label-width="formLabelWidth">
                                    <el-input v-model="form.pwd" maxLength="50" auto-complete="off"></el-input>
                                </el-form-item>
                            </el-form>
                        </el-col>
                    </el-row>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button type="primary"
                                   :disabled="
                                   !form.phoneNums||form.phoneNums==''
                                   ||!form.name||form.name==''
                                   ||!form.pwd||form.pwd==''"
                                   @click="submit()">提交</el-button>
                    </div>
                </el-dialog>
            </div>
        </div>
    </div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
    .handle-box{}
</style>
<script>
    import Vue from 'vue'
    export default {
        data() {
            return {
                activeName: 'first',

                handleType:'add',//add:新增,edit:编辑
                dialogFormVisible: false,
                form:{},
                formLabelWidth: '120px',
                curEntry:null,

                id:null,
                userDetail:{},

                marketManagerPager:{
                    pageIndex:1,
                    pageSize:20,
                    total:0,
                },
                marketManagerList:[],

                accountantManagerPager:{
                    pageIndex:1,
                    pageSize:20,
                    total:0,
                },
                accountantManagerList:[],

                options: [{
                    value: 'enable',
                    label: '正常'
                }, {
                    value: 'disable',
                    label: '禁用'
                }, {
                    value: 'del',
                    label: '删除',
                    disabled:true
                }],
            }
        },
        created(){
        },
        computed: {

        },
        methods: {
            handleClick(tab, event) {

            },
            getMarketManagerList:function (pageIndex) {
                this.marketManagerPager.pageIndex=pageIndex?pageIndex:1;
                let params={
                    ...Vue.sessionInfo(),
                    pageIndex:this.marketManagerPager.pageIndex,
                    pageSize:this.marketManagerPager.pageSize,
                    searchContent:null,
                }
                Vue.api.getMarketManagerList(params).then((resp)=>{
                    if(resp.respCode=='00'){
                        let data=JSON.parse(resp.respMsg);
                        this.marketManagerList=JSON.parse(data.marketManagerList);
                        this.marketManagerPager.total=data.count;
                    }
                });
            },
            getAccountantManagerList:function (pageIndex) {
                this.accountantManagerPager.pageIndex=pageIndex?pageIndex:1;
                let params={
                    ...Vue.sessionInfo(),
                    pageIndex:this.accountantManagerPager.pageIndex,
                    pageSize:this.accountantManagerPager.pageSize,
                    searchContent:null,
                }
                Vue.api.getAccountantManagerList(params).then((resp)=>{
                    if(resp.respCode=='00'){
                        let data=JSON.parse(resp.respMsg);
                        this.accountantManagerList=JSON.parse(data.accountantManagerList);
                        this.accountantManagerPager.total=data.count;
                    }
                });
            },
            del:function (entry) {
                entry.state='del';
                this.$confirm('确定删除该账号?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then((data) => {
                    this.setState(entry);
                }).catch((data) => {

                });
            },
            update:function () {
                let params={
                    id:this.id,
                    ...this.form
                }
                let fb=Vue.operationFeedback({text:'保存中...'});
                Vue.api.updateMarketManager(params).then((resp)=>{
                    if(resp.respCode=='00'){
                        Object.assign(this.userDetail,this.form);
                        this.dialogFormVisible = false;
                        fb.setOptions({type:'complete',text:'保存成功'});
                    }else{
                        fb.setOptions({type:'warn',text:'保存失败，'+resp.respMsg});
                    }
                });
            },
            setState:function (entry){
                if(this.activeName=='first'){
                    let fb=Vue.operationFeedback({text:'操作中...'});
                    Vue.api.setMarketManagerState({...Vue.sessionInfo(),id:entry.id,state:entry.state}).then((resp)=>{
                        if(resp.respCode=='00'){
                            if(entry.state=='del'){
                                for(let i=0;i<this.marketManagerList.length;i++){
                                    if(this.marketManagerList[i].id==entry.id){
                                        this.marketManagerList.splice(i,1);
                                        break;
                                    }
                                }
                            }
                            fb.setOptions({type:'complete',text:'操作成功'});
                        }else{
                            fb.setOptions({type:'warn',text:'操作失败，'+resp.respMsg});
                        }
                    });
                }else if(this.activeName=='second'){
                    let fb=Vue.operationFeedback({text:'操作中...'});
                    Vue.api.setAccountantManagerState({...Vue.sessionInfo(),id:entry.id,state:entry.state}).then((resp)=>{
                        if(resp.respCode=='00'){
                            if(entry.state=='del'){
                                for(let i=0;i<this.accountantManagerList.length;i++){
                                    if(this.accountantManagerList[i].id==entry.id){
                                        this.accountantManagerList.splice(i,1);
                                        break;
                                    }
                                }
                            }
                            fb.setOptions({type:'complete',text:'操作成功'});
                        }else{
                            fb.setOptions({type:'warn',text:'操作失败，'+resp.respMsg});
                        }
                    });
                }
            },
            handle:function (type,entry) {
                this.handleType=type;
                this.dialogFormVisible=true;
                if(entry){
                    this.curEntry=entry;
                    this.form.phoneNums=entry.account;
                    this.form.name=entry.name;
                 /*   this.form.pwd=entry.password;*/
                }
            },
            submit:function () {
                if(this.handleType=='add'){
                    let params={
                        ...Vue.sessionInfo(),
                        account:this.form.phoneNums,
                        name:this.form.name,
                        password:this.form.pwd
                    }
                    if(this.activeName=='first'){
                        let fb=Vue.operationFeedback({text:'保存中...'});
                        Vue.api.addMarketManager(params).then((resp)=>{
                            if(resp.respCode=='00'){
                                this.getMarketManagerList(1);
                                this.form={};
                                this.dialogFormVisible = false;
                                fb.setOptions({type:'complete',text:'新建成功'});
                            }else{
                                fb.setOptions({type:'warn',text:'新建失败，'+resp.respMsg});
                            }
                        });
                    }else if(this.activeName=='second'){
                        let fb=Vue.operationFeedback({text:'保存中...'});
                        Vue.api.addAccountantManager(params).then((resp)=>{
                            if(resp.respCode=='00'){
                                this.getAccountantManagerList(1);
                                this.form={};
                                this.dialogFormVisible = false;
                                fb.setOptions({type:'complete',text:'新建成功'});
                            }else{
                                fb.setOptions({type:'warn',text:'新建失败，'+resp.respMsg});
                            }
                        });
                    }
                }else if(this.handleType=='edit'){
                    let params={
                        ...Vue.sessionInfo(),
                        id:this.curEntry.id,
                        account:this.form.phoneNums,
                        name:this.form.name,
                        password:this.form.pwd
                    }
                    if(this.activeName=='first'){
                        let fb=Vue.operationFeedback({text:'保存中...'});
                        Vue.api.updateMarketManager(params).then((resp)=>{
                            if(resp.respCode=='00'){
                                this.curEntry.account=params.account;
                                this.curEntry.name=params.name;
                                this.curEntry.password=params.password;
                                this.dialogFormVisible = false;
                                fb.setOptions({type:'complete',text:'保存成功'});
                            }else{
                                fb.setOptions({type:'warn',text:'保存失败，'+resp.respMsg});
                            }
                        });
                    }else if(this.activeName=='second'){
                        let fb=Vue.operationFeedback({text:'保存中...'});
                        Vue.api.updateAccountantManager(params).then((resp)=>{
                            if(resp.respCode=='00'){
                                this.curEntry.account=params.account;
                                this.curEntry.name=params.name;
                                this.curEntry.password=params.password;
                                this.dialogFormVisible = false;
                                fb.setOptions({type:'complete',text:'保存成功'});
                            }else{
                                fb.setOptions({type:'warn',text:'保存失败，'+resp.respMsg});
                            }
                        });
                    }
                }
            }
        },
        mounted () {
            /**/
           this.getMarketManagerList(1);
            /**/
            this.getAccountantManagerList(1);
           /* this.handle('add');*/
        },
    }
</script>
