<template>
    <div class="shop-detail">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>销售排名</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-row class="handle-box">
                <el-col :span="14">
                    <span style="margin-right: 5px;">年份</span>
                    <el-select v-model="selectedYear" @change="getList()" placeholder="请选择">
                        <el-option
                            v-for="(item,index) in yearArr"
                            :key="index"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <span style="margin-left:20px;margin-right: 5px;">月份</span>
                    <el-select v-model="selectedMonth" @change="getList()" placeholder="请选择">
                        <el-option
                            v-for="(item,index) in monthArr"
                            :key="index"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="8">
                    <v-distpicker class="cm-area-picker select-region" :callback="changeArea"></v-distpicker>
                </el-col>
            </el-row>
            <el-table :data="entryList" border style="width: 100%;" ref="multipleTable" v-loading="loading">
                <el-table-column label="序号" align="center" width="50">
                    <template slot-scope="scope">
                        {{scope.$index+1}}
                    </template>
                </el-table-column>
                <el-table-column prop="companyName" label="公司名" align="center"></el-table-column>
           <!--     <el-table-column prop="name" label="联系人姓名"  align="center"></el-table-column>-->
                <el-table-column prop="telephoneNums" label="联系人号码"  align="center"></el-table-column>
                <el-table-column label="日销售额"  align="center">
                    <template slot-scope="scope">
                        <span class="cm-amount">{{scope.row.daySale|moneyFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="月销售额"  align="center">
                    <template slot-scope="scope">
                        <span class="cm-amount">{{scope.row.monthSale|moneyFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="年销售额"  align="center">
                    <template slot-scope="scope">
                        <span class="cm-amount"> {{scope.row.yearSale|moneyFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作"  align="center">
                    <template slot-scope="scope">
                        <router-link :to="'/shopDetail/'+scope.row.id" size="small">查看详情</router-link>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
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
    .select-region{

    }
</style>
<script>
    import Vue from 'vue'
    export default {
        data() {
            return {
                curYear:null,
                curMonth:null,
                selectedYear:null,
                yearArr:[
                    /*  {label:'全部',value:0}*/
                ],
                selectedMonth:null,
                monthArr:[{label:'全部',value:0}],

                province:null,
                city:null,
                county:null,
                regionKeyword:null,

                loading:false,
                entryList:[],
            }
        },
        created(){
        },
        computed: {

        },
        methods: {
            getList:function () {
                let year=this.selectedYear;
                let month=this.selectedMonth;
                let rankingType=null;
                let dateString=Vue.formatDate(new Date(year,month?month:12,0),'yyyy-MM-dd');
                if(month){
                    if(year==this.curYear&&month==this.curMonth){
                        rankingType='thisMonth';
                    }else{
                        rankingType='month';
                    }
                }else{
                    if(year==this.curYear){
                        rankingType='thisYear';
                    }else{
                        rankingType='year';
                    }
                }
                let params={
                    ...Vue.sessionInfo(),
                    rankingType:rankingType,
                    dateString:dateString,
                    searchContent:this.regionKeyword?this.regionKeyword:null
                }
                this.loading=true;
                Vue.api.getSaleRanking(params).then((resp)=>{
                    if(resp.respCode=='00'){
                        this.entryList=JSON.parse(resp.respMsg);
                        if(rankingType!='thisYear'||rankingType!='thisMonth'){
                            this.entryList.forEach((item,i)=>{
                                if(item.shop){
                                    Object.assign(item,JSON.parse(item.shop));
                                }
                            })
                        }
                    }
                    this.loading=false;
                });
            },
            changeArea:function (data) {
                console.log('data:',data);
                let that=this;
                var now = +new Date();
                if (!this.previous) this.previous = now;
                if (1000 && now - this.previous > 1000) {
                    that.regionKeyword=data.value;
                    that.getList();
                    // 重置上一次开始时间为本次结束时间
                    this.previous = now;
                    clearTimeout(this.timer);
                } else {
                    clearTimeout(this.timer);
                    this.timer = setTimeout(function() {
                        that.regionKeyword=data.value;
                        that.getList();
                        this.previous = null;
                    }, 500);
                }
            },
        },
        mounted () {
            /**/
            let curDate=new Date();
            this.curYear=curDate.getFullYear();
            this.curMonth=curDate.getMonth()+1;
            this.selectedYear=this.curYear;
            this.selectedMonth=this.curMonth;
            for(let i=0;i<20;i++){
                this.yearArr.push({
                    label:this.curYear-i+'年',
                    value:this.curYear-i+''
                });
            }
            for(let i=0;i<12;i++){
                this.monthArr.push({
                    label:i+1+'月',
                    value:i+1+''
                });
            }
            /**/
            this.getList();
        },
    }
</script>
