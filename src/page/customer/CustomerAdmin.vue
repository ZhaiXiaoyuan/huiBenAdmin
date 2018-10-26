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
                    <el-input v-model="keyword" placeholder="输入搜索关键字" class="handle-input mr10"></el-input>
                    <el-button type="primary" icon="search" @click="getList()">搜索</el-button>
                </el-col>
            </el-row>
            <el-table :data="entryList" border style="width: 100%;" ref="multipleTable">
                <el-table-column prop="user.id" label="用户ID" align="center"></el-table-column>
                <el-table-column prop="user.name" label="昵称"  align="center"></el-table-column>
                <el-table-column label="性别" align="center" width="50">
                    <template slot-scope="scope">
                        {{scope.row.user.gender=='male'?'男':'女'}}
                    </template>
                </el-table-column>
                <el-table-column label="注册时间" align="center" >
                    <template slot-scope="scope">
                        {{scope.row.user.registrationDate|formatDate('yyyy-MM-dd hh:mm:ss')}}
                    </template>
                </el-table-column>
                <el-table-column label="最后登录时间" align="center" >
                    <template slot-scope="scope">
                        {{scope.row.user.lastLoginDate|formatDate('yyyy-MM-dd hh:mm:ss')}}
                    </template>
                </el-table-column>
                <el-table-column label="押金" align="center"  width="50">
                    <template slot-scope="scope">
                        {{scope.row.user.depositAmount}}
                    </template>
                </el-table-column>
                <el-table-column prop="user.borrowingOrderCount" label="在途单数"  align="center"  width="70"></el-table-column>
                <el-table-column prop="user.historyOrderCount" label="历史单数"  align="center"   width="70"></el-table-column>
                <el-table-column prop="user.audioMember" label="有声会员剩余天数"  align="center"></el-table-column>
                <el-table-column prop="user.historyPayCount" label="历史支付总额"  align="center"></el-table-column>
                <el-table-column label="备注历史" align="center" >
                    <template slot-scope="scope">
                        {{scope.row.lastUserRemark.userRemarkList.length>0?scope.row.lastUserRemark.userRemarkList[0].content:'-'}}
                    </template>
                </el-table-column>
                <el-table-column label="操作"  align="center">
                    <template slot-scope="scope">
                        <span @click="openRemarkModal(null,scope.row)"  class="cm-btn cm-link-btn">添加备注</span>
                        <span @click="getUserDetail(scope.row)" class="cm-btn cm-link-btn">查看详情</span>
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


        <el-dialog title="用户详情" class="" :visible.sync="userDetailModalFlag" v-if="userDetailModalFlag" width="70%">
            <div class="modal-body">
                <el-row>
                    <el-col :span="5">
                        <img  :src="curUser.headPic?curUser.headPic:defaultAvatar" style="width: 150px;height: 150px;" alt="">
                    </el-col>
                    <el-col :span="9">
                        <p style="color: #333;font-size: 18px;">用户昵称：{{curUser.name}}</p>
                   <!--     <p>微信：</p>-->
                        <p>手机：{{curUser.phone}}</p>
                        <p>押金余额：{{curUser.depositAmount}}</p>
                        <p>在途订单：{{curUser.borrowingOrderCount}}</p>
                     <!--   <p>在借本数：</p>-->
                        <p>已结算订单：{{curUser.historyOrderCount}}</p>
                        <p>有声会员：{{curUser.audioMember}}</p>
                        <p>注册时间：{{curUser.registrationDate|formatDate('yyyy-MM-dd hh:mm:ss')}}</p>
                        <p>最后登录时间：{{curUser.lastLoginDate|formatDate('yyyy-MM-dd hh:mm:ss')}}</p>
                    </el-col>
                    <el-col :span="10">
                        <p style="color: #333;font-size: 18px;">用户ID：{{curUser.id}}</p>
                        <p>宝贝详情：</p>
                        <el-table :data="babyEntryList" border style="width: 100%;" ref="multipleTable" v-loading="babyPager.loading">
                            <el-table-column label="序号" align="center" >
                                <template slot-scope="scope">
                                    {{scope.$index+1}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="name" label="昵称"  align="center"></el-table-column>
                            <el-table-column label="性别" align="center" >
                                <template slot-scope="scope">
                                    {{scope.row.gender=='male'?'男':'女'}}
                                </template>
                            </el-table-column>
                            <el-table-column label="生日" align="center" >
                                <template slot-scope="scope">
                                    {{scope.row.birth|formatDate('yyyy-MM-dd')}}
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination">
                            <el-pagination
                                @current-change ="getUserBabyList"
                                layout="prev, pager, next"
                                :page-size="babyPager.pageSize"
                                :total="babyPager.total">
                            </el-pagination>
                        </div>
                    </el-col>
                </el-row>
                <div style="border-top: 1px solid #ddd;margin-top: 20px;">
                    <el-row style="padding: 10px 0px;">
                        <el-col :span="14">
                           <span style="font-size: 18px;color: #333;">历史备注：</span>
                        </el-col>
                        <el-col :span="10" style="text-align: right">
                            <el-button type="primary" icon="el-icon-plus" @click="openRemarkModal()">添加备注</el-button>
                        </el-col>
                    </el-row>
                    <el-table :data="remarkEntryList" border style="width: 100%;" ref="multipleTable" v-loading="remarkPager.loading">
                        <el-table-column label="序号" align="center" width="50" >
                            <template slot-scope="scope">
                                {{scope.$index+1}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="content" label="内容" width="400"  align="center"></el-table-column>
                        <el-table-column label="时间" align="center" >
                            <template slot-scope="scope">
                               <!-- {{scope.row.user.registrationDate|formatDate('yyyy-MM-dd hh:mm:ss')}}-->
                            </template>
                        </el-table-column>
                        <el-table-column label="操作"  align="center">
                            <template slot-scope="scope">
                                <span class="cm-btn cm-link-btn" @click="openRemarkModal(scope.row)">编辑</span>
                                <span class="cm-btn cm-link-btn" @click="removeUserRemark(scope.$index)">删除</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination
                            @current-change ="getUserRemarkList"
                            layout="prev, pager, next"
                            :page-size="remarkPager.pageSize"
                            :total="remarkPager.total">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </el-dialog>
        <el-dialog :title="curRemark?'编辑备注':'添加备注'" class="edit-dialog" :visible.sync="remarkModalFlag" v-if="remarkModalFlag" width="40%">
            <div class="dialog-body">
                <el-input type="textarea" v-model="remarkForm.remark" rows="8"></el-input>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeRemarkModal()">取 消</el-button>
                <el-button type="primary" @click="saveRemark()">提交</el-button>
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
                defaultAvatar:require('../../images/common/default-avatar.png'),
                pager:{
                  pageIndex:1,
                  pageSize:20,
                  total:0,
                },
                keyword:null,
                entryList:[],
                curEntry:null,

                userDetailModalFlag: false,
                form:{},
                formLabelWidth: '120px',

                curUser:null,
                babyPager:{
                    pageIndex:1,
                    pageSize:5,
                    total:0,
                    loading:false,
                },
                babyEntryList:[],

                remarkPager:{
                    pageIndex:1,
                    pageSize:5,
                    total:0,
                    loading:false,
                },
                remarkEntryList:[],

                remarkModalFlag:false,
                remarkModalOptions:{
                    ok:null,
                },
                curRemark:null,
                remarkForm:{
                    remark:null,
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
                    searchContent:this.keyword?this.keyword:'',
                    pageIndex:this.pager.pageIndex,
                    pageSize:this.pager.pageSize,
                }
                this.pager.loading=true;
                Vue.api.getUserList(params).then((resp)=>{
                    if(resp.respCode=='2000'){
                        let data=JSON.parse(resp.respMsg);
                        let list=data;
                        list.forEach((item,i)=>{
                            item.lastUserRemark=JSON.parse(item.lastUserRemark)
                        })
                        this.entryList=list;
                        this.pager.total=data.count;
                          console.log('this.entryList:',this.entryList);
                        //
                       /* this.getUserDetail(this.entryList[1]);*/
                    }
                    let timeout=setTimeout(()=>{
                        this.pager.loading=false;
                        clearTimeout(timeout);
                    },500)
                });
            },
            getUserDetail:function (entry) {
                this.curEntry=entry;
                let params={
                   type:'id',
                   code:this.curEntry.user.id
                }
                Vue.api.getUserDetail(params).then((resp)=>{
                    if(resp.respCode=='2000'){
                        let data=JSON.parse(resp.respMsg);
                        this.curUser=data;
                        this.userDetailModalFlag=true;
                        this.getUserBabyList();
                        this.getUserRemarkList();
                        console.log('user:',data);
                    }
                });
            },
            getUserBabyList:function (pageIndex) {
                this.babyPager.pageIndex=pageIndex?pageIndex:1;
                let params={
                    userId:this.curUser.id,
                    pageIndex:this.babyPager.pageIndex,
                    pageSize:this.babyPager.pageSize,
                }
                this.babyPager.loading=true;
                Vue.api.getUserBabyList(params).then((resp)=>{
                    if(resp.respCode=='2000'){
                        let data=JSON.parse(resp.respMsg);
                        let list=data.userBabyList;
                        this.babyEntryList=list;
                        this.babyPager.total=data.count;
                        console.log('this.babyEntryList:',this.babyEntryList);
                    }
                    let timeout=setTimeout(()=>{
                        this.babyPager.loading=false;
                        clearTimeout(timeout);
                    },500)
                });
            },
            getUserRemarkList:function (pageIndex) {
                this.remarkPager.pageIndex=pageIndex?pageIndex:1;
                let params={
                    userId:this.curUser.id,
                    pageIndex:this.remarkPager.pageIndex,
                    pageSize:this.remarkPager.pageSize,
                }
                this.remarkPager.loading=true;
                Vue.api.getUserRemarkList(params).then((resp)=>{
                    if(resp.respCode=='2000'){
                        let data=JSON.parse(resp.respMsg);
                        let list=data.userRemarkList;
                        this.remarkEntryList=list;
                        this.remarkPager.total=data.count;
                        console.log('this.remarkEntryList:',this.remarkEntryList);
                    }
                    let timeout=setTimeout(()=>{
                        this.remarkPager.loading=false;
                        clearTimeout(timeout);
                    },500)
                });
            },
            openRemarkModal:function (entry,userEntry) {
                if(userEntry){
                    this.curEntry=userEntry;
                }
                this.curRemark=entry;
                if(this.curRemark){
                    this.remarkForm.remark=entry.content
                }
                this.remarkModalFlag=true;
            },
            closeRemarkModal:function () {
                this.remarkForm={
                    remark:null,
                };
                this.remarkModalFlag=false;
            },
            saveRemark:function () {
                if(!this.remarkForm.remark){
                    Vue.operationFeedback({type:'warn',text:'请输入备注'});
                    return;
                }
                let fb=Vue.operationFeedback({text:'保存中...'});
                if(this.curRemark){
                    Vue.api.updateUserRemark({id:this.curRemark.id,content:this.remarkForm.remark}).then((resp)=>{
                        if(resp.respCode=='2000'){
                            this.getList(this.pager.pageIndex);
                            this.curRemark.content=this.remarkForm.remark;
                            fb.setOptions({type:'complete',text:'保存成功'});
                            this.closeRemarkModal();
                        }else{
                            fb.setOptions({type:'warn',text:'保存失败，'+resp.respMsg});
                        }
                    });
                }else{
                    Vue.api.addUserRemark({userId:this.curEntry.user.id,content:this.remarkForm.remark}).then((resp)=>{
                        if(resp.respCode=='2000'){
                            this.getList(this.pager.pageIndex);
                            if(this.remarkModalFlag){
                                this.getUserRemarkList();
                            }
                            fb.setOptions({type:'complete',text:'保存成功'});
                            this.closeRemarkModal();
                        }else{
                            fb.setOptions({type:'warn',text:'保存失败，'+resp.respMsg});
                        }
                    });
                }
            },
            removeUserRemark:function (index) {
                let fb=Vue.operationFeedback({text:'删除中...'});
                Vue.api.removeUserRemark({id:this.remarkEntryList[index].id}).then((resp)=>{
                    if(resp.respCode=='2000'){
                        this.getList(this.pager.pageIndex);
                        fb.setOptions({type:'complete',text:'删除成功'});
                        this.remarkEntryList.splice(index,1);
                        if(this.remarkEntryList.length==0){
                            this.getUserRemarkList();
                        }
                    }else{
                        fb.setOptions({type:'warn',text:'删除失败，'+resp.respMsg});
                    }
                });
            },
        },
        mounted () {
            this.getList();


        },
    }
</script>
