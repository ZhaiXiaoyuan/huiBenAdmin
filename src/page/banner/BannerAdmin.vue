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
                <el-col :span="24" style="text-align: right;">
                    <el-button type="primary" icon="el-icon-plus" @click="openBannerModal()">
                        添加
                    </el-button>
                </el-col>
            </el-row>
            <el-table :data="entryList" border style="width: 100%;" ref="multipleTable">
                <el-table-column label="序号" align="center" width="50">
                    <template slot-scope="scope">
                        {{scope.$index+1}}
                    </template>
                </el-table-column>
                <el-table-column prop="typeChinese" label="banner类型"  align="center"></el-table-column>
                <el-table-column label="图片" align="center" >
                    <template slot-scope="scope">
                        <img :src="scope.row.banner.image" style="width: 80px;height: 40px;" alt="">
                    </template>
                </el-table-column>
                <el-table-column prop="banner.url" label="链接"  align="center"></el-table-column>
                <el-table-column label="展示时间" align="center">
                    <template slot-scope="scope">
                       缺字段
                    </template>
                </el-table-column>
                <el-table-column prop="OperationPlatformHandlerName" label="上传者"  align="center"></el-table-column>
                <el-table-column label="操作"  align="center">
                    <template slot-scope="scope">
                        <span @click="swapSort(scope.$index,'up')"  class="cm-btn cm-link-btn">上移</span>
                        <span @click="swapSort(scope.$index,'down')" class="cm-btn cm-link-btn">下移</span>
                        <span @click="openBannerModal(scope.row)" class="cm-btn cm-link-btn">编辑</span>
                        <span @click="removeBanner(scope.$index)" class="cm-btn cm-link-btn">删除</span>
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


        <el-dialog :title="curEntry?'编辑banner':'新增banner'" class="edit-dialog" :visible.sync="bannerModalFlag" v-if="bannerModalFlag" width="40%">
            <div class="dialog-body">
                <el-form ref="bannerForm" :model="bannerForm" label-width="80px">
                    <el-form-item label="类型" prop="bannerType">
                        <el-select v-model="bannerForm.bannerType" placeholder="请选择类型">
                            <el-option label="书本" value="book"></el-option>
                            <el-option label="文章" value="article"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="封面地址" prop="image">
                        <el-input v-model="bannerForm.image" placeholder="请输入封面地址"></el-input>
                    </el-form-item>
                    <el-form-item label="链接" prop="url">
                        <el-input v-model="bannerForm.url" placeholder="请输入链接"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeBannerModal()">取 消</el-button>
                <el-button type="primary" @click="saveBanner()">提交</el-button>
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
    let XLSX = require('xlsx');
    export default {
        data() {
            return {
                account:{},
                pager:{
                  pageIndex:1,
                  pageSize:20,
                  total:0,
                },
                keyword:null,
                entryList:[],
                curEntry:null,



                bannerModalFlag:false,
                bannerForm:{
                    bannerType:'book',
                    image:null,
                    url:null,
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
                    pageIndex:this.pager.pageIndex,
                    pageSize:this.pager.pageSize,
                }
                this.pager.loading=true;
                Vue.api.getBannerList(params).then((resp)=>{
                    if(resp.respCode=='2000'){
                        let data=JSON.parse(resp.respMsg);
                        let list=data.bannerList;
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
            openBannerModal:function (entry) {
                this.curEntry=entry;
                console.log('this.curEntry:',this.curEntry);
                if(this.curEntry){
                    this.bannerForm={...this.curEntry.banner}
                }
                this.bannerModalFlag=true;
            },
            closeBannerModal:function () {
                this.bannerModalFlag=false;
                this.$refs['bannerForm'].resetFields();
            },
            saveBanner:function () {
                if(!this.bannerForm.image){
                    Vue.operationFeedback({type:'warn',text:'请输入banner封面地址'});
                    return;
                }
                if(!this.bannerForm.url){
                    Vue.operationFeedback({type:'warn',text:'请输入链接'});
                    return;
                }
                let fb=Vue.operationFeedback({text:'保存中...'});
                let params={
                    sort:'',
                    bannerType:this.bannerForm.bannerType,
                    image:this.bannerForm.image,
                    url:this.bannerForm.url,
                    operationPlatformHandlerId:this.account.id,
                }
                if(this.curEntry){
                    params.id=this.curEntry.banner.id;
                    Vue.api.updateBanner(params).then((resp)=>{
                        if(resp.respCode=='2000'){
                            this.getList(this.pager.pageIndex);
                            fb.setOptions({type:'complete',text:'保存成功'});
                            this.closeBannerModal();
                        }else{
                            fb.setOptions({type:'warn',text:'保存失败，'+resp.respMsg});
                        }
                    });
                }else{
                    Vue.api.addBanner(params).then((resp)=>{
                        if(resp.respCode=='2000'){
                            this.getList();
                            fb.setOptions({type:'complete',text:'保存成功'});
                            this.closeBannerModal();
                        }else{
                            fb.setOptions({type:'warn',text:'保存失败，'+resp.respMsg});
                        }
                    });
                }
            },
            removeBanner:function (index) {
                let fb=Vue.operationFeedback({text:'删除中...'});
                Vue.api.removeBanner({operationPlatformHandlerId:this.account.id,id:this.entryList[index].banner.id}).then((resp)=>{
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
            swapSort:function (index,type) {
                let id1=this.entryList[index].banner.id;
                let id2=null;
                let index2=null;
                if(type=='up'&&index>0){
                    index2=index-1;
                }else if(type=='down'&&index<this.entryList.length-1){
                    index2=index+1;
                }else{
                    return;
                }
                id2=this.entryList[index2].banner.id;
                let fb=Vue.operationFeedback({text:'操作中...'});
                Vue.api.swapBannerSort({id1:id1,id2:id2,operationPlatformHandlerId:this.account.id}).then((resp)=>{
                    if(resp.respCode=='2000'){
                        fb.setOptions({type:'complete',text:'操作成功'});
                        this.getList(this.pager.pageIndex);
                    }else{
                        fb.setOptions({type:'warn',text:'操作失败，'+resp.respMsg});
                    }
                });
            },
        },
        mounted () {
            //
            this.account=this.getAccountInfo();
            //
            this.getList();


        },
    }
</script>
