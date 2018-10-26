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
                    <el-input v-model="keyword" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                    <el-button type="primary" icon="search" @click="getList()">搜索</el-button>
                </el-col>
                <el-col :span="10" style="text-align: right">
                    <el-button type="primary" icon="el-icon-plus" @click="dialogFormVisible=true">新建用户</el-button>
                    <el-button type="primary" class="mr10" @click="uploadFile()">
                        批量导入
                        <input type="file" @change="importFile(this)" id="imFile" style="display: none"
                               accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
                    </el-button>
                </el-col>
            </el-row>
            <el-table :data="entryList" border style="width: 100%;" ref="multipleTable">
                <el-table-column label="序号" align="center" width="50">
                    <template slot-scope="scope">
                        {{scope.$index+1}}
                    </template>
                </el-table-column>
                <el-table-column prop="phoneNums" label="手机号" align="center"></el-table-column>
                <el-table-column prop="name" label="姓名"  align="center"></el-table-column>
                <el-table-column prop="idCard" label="身份证"  align="center"></el-table-column>
                <el-table-column prop="email" label="邮箱"  align="center"></el-table-column>
                <el-table-column label="总收益"  align="center">
                    <template slot-scope="scope">
                        <span class="cm-amount">{{scope.row.revenue|moneyFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="bankName" label="开户行"  align="center"></el-table-column>
                <el-table-column prop="subbranch" label="支行" align="center"></el-table-column>
                <el-table-column prop="bankAccount" label="银行账户" width="200"  align="center"></el-table-column>
                <el-table-column label="操作"  align="center">
                    <template slot-scope="scope">
                        <router-link :to="'/userDetail/'+scope.row.id" size="small">查看详情</router-link>
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
                url: './static/vuetable.json',
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,

                pager:{
                  pageIndex:1,
                  pageSize:20,
                  total:0,
                },
                keyword:null,
                entryList:[],

                fullscreenLoading: false, // 加载中
                imFile: '', // 导入文件el
                outFile: '',  // 导出文件el
                errorDialog: false, // 错误信息弹窗
                errorMsg: '', // 错误信息内容
                excelData: [ ],
                failDialog:false,
                failList:[],

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
            getList:function (pageIndex) {
                this.pager.pageIndex=pageIndex?pageIndex:1;
                let params={
                    searchContent:this.regionKeyword?this.regionKeyword:'',
                    pageIndex:this.pager.pageIndex,
                    pageSize:this.pager.pageSize,
                }
                this.pager.loading=true;
                Vue.api.getUserList(params).then((resp)=>{
                    if(resp.respCode=='00'){
                        let data=JSON.parse(resp.respMsg);
                        this.entryList=JSON.parse(data.shopList);
                        this.pager.total=data.shopCount;
                        /*  console.log('this.entryList:',this.entryList[0]);*/
                    }
                    let timeout=setTimeout(()=>{
                        this.pager.loading=false;
                        clearTimeout(timeout);
                    },500)
                });
            },
        },
        mounted () {
            this.getList();


        },
    }
</script>
