<template>
    <div class="table">
        <div class="crumbs">
          <!--  <el-breadcrumb separator="/">
                <el-breadcrumb-item></el-breadcrumb-item>
                <el-breadcrumb-item></el-breadcrumb-item>
            </el-breadcrumb>-->
        </div>
        <div class="container">
            <el-row class="handle-box">
                <el-col :span="10">
                    <el-input v-model="keyword" placeholder="输入搜索关键字" class="handle-input mr10"></el-input>
                    <el-button type="primary" icon="search" @click="getList()">搜索</el-button>
                </el-col>
                <el-col :span="14" style="text-align: right;">
                    <el-button type="primary" icon="el-icon-plus">
                        添加小书单
                    </el-button>
                    <el-button type="primary" icon="el-icon-upload2">
                        批量上架
                    </el-button>
                    <el-button type="primary" icon="el-icon-download">
                        批量下架
                    </el-button>
                </el-col>
            </el-row>
            <el-table :data="entryList" border style="width: 100%;" ref="multipleTable" v-loading="pager.loading">
                <el-table-column label="选择" align="center" width="50">
                    <template slot-scope="scope">

                    </template>
                </el-table-column>
                <el-table-column prop="recommendBookList.id" label="小书单ID"  align="center"></el-table-column>
                <el-table-column prop="recommendBookList.booklistName" label="书单名"  align="center"></el-table-column>
                <el-table-column label="封面图片" align="center" width="60">
                    <template slot-scope="scope">
                        <img :src="basicConfig.basicUrl+scope.row.recommendBookList.cover" style="width: 40px;height: 40px;" alt="">
                    </template>
                </el-table-column>
                <el-table-column prop="recommendBookList.bookCount" label="书本量"  align="center"></el-table-column>
                <el-table-column prop="recommendBookList.label" label="特色"  align="center"></el-table-column>
                <el-table-column prop="recommendBookList.reason" label="推荐理由"  align="center"></el-table-column>
                <el-table-column prop="recommendBookList.userId" label="发起者"  align="center"></el-table-column>
                <el-table-column label="书单状态" align="center">
                    <template slot-scope="scope">
                        {{scope.row.recommendBookList.state=='enable'?'上架中':'已下架'}}
                    </template>
                </el-table-column>
                <el-table-column label="操作"  align="center">
                    <template slot-scope="scope">
                        <span @click="openFormModal(scope.row)" class="cm-btn cm-link-btn">编辑</span>
                        <span @click="remove(scope.$index)" class="cm-btn cm-link-btn">删除</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    @current-change ="getList"
                    layout="prev, pager, next"
                    :page-size="pager.pageSize"
                    :total="pager.total">
                </el-pagination>
            </div>
        </div>


        <el-dialog :title="curEntry?'编辑小书单':'新增小书单'" class="edit-dialog" :visible.sync="formModalFlag" v-if="formModalFlag" width="60%">
            <div class="dialog-body">
                <div style="width: 60%;">
                    <el-form ref="form" :model="form" label-width="100px">
                        <el-form-item label="书单名称：" prop="name">
                            <el-input v-model="form.name" placeholder="请输入书单名称"></el-input>
                        </el-form-item>
                        <el-form-item label="上传图片：" prop="cover">
                            <div class="cm-pic-uploader" :class="{'anew':form.cover}">
                                <div class="wrapper">
                                    <img :src="form.cover" alt="">
                                    <div class="btn-wrap">
                                        <input  type="file" id="file-input" accept="image/*" @change="selectFile()">
                                        <div class="cm-btn upload-btn"><i class="icon el-icon-plus"></i></div>
                                        <span class="cm-btn cm-link-btn text-upload-btn">重新上传</span>
                                    </div>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label="书单标签：" prop="label">
                            <el-input v-model="form.label" placeholder="请输入书单标签，逗号区格"></el-input>
                        </el-form-item>
                        <el-form-item label="推荐理由：" prop="reason">
                            <el-input type="textarea" rows="5" v-model="form.reason" placeholder="请输入推荐理由"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeFormModal()">取 消</el-button>
                <el-button type="primary" @click="save()">提交</el-button>
            </div>
        </el-dialog>

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

    export default {
        data() {
            return {
                account:{},
                pager:{
                  pageIndex:1,
                  pageSize:20,
                  total:0,
                  loading:false
                },
                keyword:null,
                entryList:[],
                curEntry:null,



                formModalFlag:false,
                form:{
                    cover:null,
                },
            }
        },
        created(){
        },
        computed: {
        },
        methods: {
            getList:function (pageIndex) {
                this.pager.pageIndex=pageIndex?pageIndex:1;
                let params={
                    searchContent:'',
                    pageIndex:this.pager.pageIndex,
                    pageSize:this.pager.pageSize,
                }
                this.pager.loading=true;
                Vue.api.getBookListList(params).then((resp)=>{
                    if(resp.respCode=='2000'){
                        let data=JSON.parse(resp.respMsg);
                        let list=data;
                        this.entryList=list;
                        this.pager.total=data.count;
                          console.log('this.entryList:',this.entryList);
                    }
                    let timeout=setTimeout(()=>{
                        this.pager.loading=false;
                        clearTimeout(timeout);
                    },500)
                });
            },
            openFormModal:function (entry) {
                this.curEntry=entry;
                console.log('this.curEntry:',this.curEntry);
                if(this.curEntry){
                    this.form={...this.curEntry.banner}
                }
                this.formModalFlag=true;
            },
            closeFormModal:function () {
                this.formModalFlag=false;
                this.$refs['form'].resetFields();
            },
            save:function () {
                if(!this.form.cover){
                    Vue.operationFeedback({type:'warn',text:'请上传封面'});
                    return;
                }
                if(!this.form.name){
                    Vue.operationFeedback({type:'warn',text:'请输入书单名称'});
                    return;
                }
                if(!this.form.reason){
                    Vue.operationFeedback({type:'warn',text:'请输入推荐理由'});
                    return;
                }
                let fb=Vue.operationFeedback({text:'保存中...'});
                let params={
                    userId:'',
                    booklistName:this.form.name,
                    reason:this.form.reason,
                    label:this.form.label,
                }
                if(this.curEntry){
                    params.id=this.curEntry.banner.id;
                    Vue.api.updateBanner(params).then((resp)=>{
                        if(resp.respCode=='2000'){
                            this.getList(this.pager.pageIndex);
                            fb.setOptions({type:'complete',text:'保存成功'});
                            this.closeFormModal();
                        }else{
                            fb.setOptions({type:'warn',text:'保存失败，'+resp.respMsg});
                        }
                    });
                }else{
                    Vue.api.addBookList(params,this.form.file).then((resp)=>{
                        if(resp.respCode=='2000'){
                            this.getList();
                            fb.setOptions({type:'complete',text:'保存成功'});
                            this.closeFormModal();
                        }else{
                            fb.setOptions({type:'warn',text:'保存失败，'+resp.respMsg});
                        }
                    });
                }
            },
            remove:function (index) {
                let fb=Vue.operationFeedback({text:'删除中...'});
                Vue.api.remove({operationPlatformHandlerId:this.account.id,id:this.entryList[index].banner.id}).then((resp)=>{
                    if(resp.respCode=='2000'){
                        fb.setOptions({type:'complete',text:'删除成功'});
                        this.entryList.splice(index,1);
                        if(this.entryList.length==0){
                            this.getList();
                        }
                    }else{
                        fb.setOptions({type:'warn',text:'删除失败，'+resp.respMsg});
                    }
                });
            },
            selectFile:function () {
                let file=document.getElementById('file-input').files[0];
                this.form.file=file;
                Vue.tools.fileToBlob(file,(data)=>{
                    this.cropModal({
                        img:data,
                        ok:(data)=>{
                            this.form.cover=data.base64;
                           /* this.form.file=data.blob;*/
                        }
                    });
                });
            },
        },
        mounted () {
            //
            this.account=this.getAccountInfo();
            //
            this.getList();
            //
            this.openFormModal();


        },
    }
</script>
