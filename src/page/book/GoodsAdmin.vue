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
                <el-col :span="14">
                    <el-button type="primary" icon="el-icon-plus">
                        添加书本信息
                    </el-button>
                    <el-button type="primary" icon="el-icon-upload2">
                        批量上架
                    </el-button>
                    <el-button type="primary" icon="el-icon-download">
                        批量下架
                    </el-button>
                </el-col>
                <el-col :span="10" style="text-align: right;">
                    <el-input v-model="keyword" placeholder="输入搜索关键字" class="handle-input mr10"></el-input>
                    <el-button type="primary" icon="search" @click="getList()">搜索</el-button>
                </el-col>
            </el-row>
            <el-table :data="entryList" border style="width: 100%;" ref="multipleTable" v-loading="pager.loading">
                <el-table-column label="选择" align="center" width="50">
                    <template slot-scope="scope">

                    </template>
                </el-table-column>
                <el-table-column prop="bookSku.name" label="书名"  align="center"></el-table-column>
                <el-table-column label="封面" align="center" width="60">
                    <template slot-scope="scope">
                        <img :src="basicConfig.coverBasicUrl+scope.row.bookSku.coverPic" style="width: 30px;height: 30px;" alt="">
                    </template>
                </el-table-column>
                <el-table-column prop="bookSku.isbn" label="isbn码"  align="center"></el-table-column>
                <el-table-column prop="" label="语言"  align="center" width="60"></el-table-column>
                <el-table-column prop="bookSku.publisher" label="出版社"  align="center"></el-table-column>
                <el-table-column prop="bookSku.author" label="作者"  align="center"></el-table-column>
                <el-table-column prop="bookSku.price" label="市场价"  align="center"></el-table-column>
                <el-table-column prop="bookSku.inventory" label="库存"  align="center" width="60"></el-table-column>
                <el-table-column prop="bookSku.borrowing" label="在借"  align="center"  width="60"></el-table-column>
                <el-table-column prop="bookSku.cannelCount" label="已核销"  align="center"  width="60"></el-table-column>
                <el-table-column label="商品状态" align="center" width="70">
                    <template slot-scope="scope">
                        {{scope.row.bookSku.state=='enable'?'上架中':'已下架'}}
                    </template>
                </el-table-column>
                <el-table-column label="操作"  align="center">
                    <template slot-scope="scope">
                        <span @click="openFormModal(scope.row)" class="cm-btn cm-link-btn">编辑</span>
                        <span @click="remove(scope.$index)" class="cm-btn cm-link-btn">音频管理</span>
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


        <el-dialog :title="curEntry?'编辑商品':'添加商品'" class="edit-dialog" :visible.sync="formModalFlag" :close-on-click-modal="false" v-if="formModalFlag" width="60%">
            <div class="dialog-body">
                <div style="max-width: 1000px;">
                    <el-form ref="form" :model="form" :inline="true" label-width="100px">
                        <el-form-item label="书名：" prop="name">
                            <el-input v-model="form.name" placeholder="请输入书名"></el-input>
                        </el-form-item>
                        <div>
                            <el-form-item label="封面图片：" prop="cover">
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
                        </div>
                        <el-form-item label="ISBN码：" prop="isbn">
                            <el-input v-model="form.isbn" placeholder="请输入ISBN码"></el-input>
                        </el-form-item>
                        <el-form-item label="市场价：" prop="price">
                            <el-input v-model="form.price" placeholder="请输入市场价"></el-input>
                        </el-form-item>
                        <el-form-item label="作者：" prop="author">
                            <el-input v-model="form.author" placeholder="请输入作者"></el-input>
                        </el-form-item>
                      <!--  <el-form-item label="作者国籍：" prop="label">
                            <el-input v-model="form.label" placeholder="请输入作者国籍"></el-input>
                        </el-form-item>-->
                        <el-form-item label="出版社：" prop="publisher">
                            <el-input v-model="form.publisher" placeholder="请输入出版社"></el-input>
                        </el-form-item>
                <!--        <el-form-item label="译者：" prop="label">
                            <el-input v-model="form.label" placeholder="请输入译者"></el-input>
                        </el-form-item>-->
                        <div v-for="(entry,index) in labelData" :key="index">
                            <el-form-item :label="entry.LabelLevel1.title+'：'" prop="label">
                                <span v-for="(item,i) in entry.labelLevel2List" :key="item.id" :class="item.selected?'active':''" @click="selectLabel(item)" class="cm-btn label-item">{{item.title}}</span>
                            </el-form-item>
                        </div>
                        <el-form-item label="内容简介：" prop="summary">
                            <el-input type="textarea" rows="5" cols="60" v-model="form.summary" placeholder="请输入内容简介"></el-input>
                        </el-form-item>
                        <el-form-item label="图文详情：" prop="reason">
                            <div id="editor" style="max-width: 800px;"></div>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div slot="footer" class="dialog-footer" style="text-align: center;">
                <el-button @click="closeFormModal()">取 消</el-button>
                <el-button type="primary" @click="save()">提交</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<style>
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
    .edit-dialog .el-dialog__body{
        padding: 10px 20px;
    }
    .edit-dialog .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
        margin-bottom: 10px;
    }
    .label-list{

    }
    .label-item{
        display: inline-block;
        padding: 0 10px;
        height: 28px;
        line-height: 28px;
        font-size: 12px;
        border-radius: 4px;
        box-sizing: border-box;
        white-space: nowrap;
        background-color: hsla(220,4%,58%,.1);
        color: #909399;
        border: 1px solid #e5e5e5;
    }
    .label-item.active{
        background-color: rgba(64,158,255,.1);
        color: #409eff;
        border: 1px solid rgba(64,158,255,.2);
    }
    .label-item+.label-item{
        margin-left: 8px;
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


                labelData:[],
                editor:null,

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
                    audio:'',
                    labelArray:'',
                    searchType:'',//"","name","author","publisher"
                    searchContent:'',
                    sortType:'',//默认传“”,按热度传"borrowOrderCountMonth",
                    pageIndex:this.pager.pageIndex,
                    pageSize:this.pager.pageSize,
                }
                this.pager.loading=true;
                Vue.api.getGoodsList(params).then((resp)=>{
                    if(resp.respCode=='2000'){
                        let data=JSON.parse(resp.respMsg);
                        let list=data.bookSkuJSONArray;
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
            getLabelList:function () {
                Vue.api.getLabelList({}).then((resp)=>{
                    if(resp.respCode=='2000'){
                        let data=JSON.parse(resp.respMsg);
                        data.forEach((entry,index)=>{
                            entry.labelLevel2List.forEach((item,i)=>{
                                item.labelLevel2Id=item.id;
                                item.selected=false;
                            });
                        })
                        this.labelData=data;
                        console.log('labelData:',this.labelData);
                    }
                });
            },
            openFormModal:function (entry) {
                this.curEntry=entry;
                console.log('this.curEntry:',this.curEntry);
                if(this.curEntry){
                    this.form={...this.curEntry.banner}
                }
                this.formModalFlag=true;
                //
                setTimeout(()=>{
                    let E = window.wangEditor;
                    this.editor = new E('#editor');
                    this.editor.create();
/*
                    this.editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
*/
                    this.editor.txt.clear();

                   /* editor.txt.html('<p>用 JS 设置的内容</p>')*/
                },500);
            },
            closeFormModal:function () {
                this.formModalFlag=false;
                this.$refs['form'].resetFields();
            },
            save:function () {
                if(!this.form.name){
                    Vue.operationFeedback({type:'warn',text:'请输入书名'});
                    return;
                }
                if(!this.form.cover){
                    Vue.operationFeedback({type:'warn',text:'请上传封面'});
                    return;
                }
                if(!this.form.isbn){
                    Vue.operationFeedback({type:'warn',text:'请输入ISBN码'});
                    return;
                }
                if(!this.form.price){
                    Vue.operationFeedback({type:'warn',text:'请输入市场价'});
                    return;
                }
                if(!this.form.author){
                    Vue.operationFeedback({type:'warn',text:'请输入作者'});
                    return;
                }
                if(!this.form.publisher){
                    Vue.operationFeedback({type:'warn',text:'请输入出版社'});
                    return;
                }
                if(!this.form.summary){
                    Vue.operationFeedback({type:'warn',text:'请输入内容简介'});
                    return;
                }
                //
                this.form.detail=this.editor.txt.html();
                if(!this.form.detail){
                    Vue.operationFeedback({type:'warn',text:'请输入图文详情'});
                    return;
                }
                //
                this.form.labelList=[];
                this.labelData.forEach((entry,index)=>{
                    entry.labelLevel2List.forEach((item,i)=>{
                        if(item.selected){
                            this.form.labelList.push(item);
                        }
                    });
                });
                //
                let fb=Vue.operationFeedback({text:'保存中...'});
                let params={
                    isbn:this.form.isbn,
                    shelvesSerial:'',
                    name:this.form.name,
                    author:this.form.author,
                    publisher:this.form.publisher,
                    price:this.form.price,
                    audio:true,
                    label:this.form.labelList,
                    summary:this.form.summary,
                    detail:this.form.detail,
                    tpData:'',
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
                    Vue.api.addGoods(params,this.form.file).then((resp)=>{
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
                            this.form.file=data.blob;
                        }
                    });
                });
            },
            selectLabel:function (entry) {
                entry.selected=!entry.selected;
            }
        },
        mounted () {
            //
            this.account=this.getAccountInfo();
            //
            this.getList();
            this.getLabelList();
            //
          /*  this.openFormModal();*/
            //


        },
    }
</script>
