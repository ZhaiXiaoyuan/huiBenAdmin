<template>
    <div class="shop-detail">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>收益排名</el-breadcrumb-item>
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
            </el-row>
            <el-table :data="entryList" border style="width: 100%;" ref="multipleTable">
                <el-table-column label="序号" align="center" width="50">
                    <template slot-scope="scope">
                        {{scope.$index+1}}
                    </template>
                </el-table-column>
                <el-table-column prop="phoneNums" label="账号" align="center"></el-table-column>
                <el-table-column prop="name" label="姓名"  align="center"></el-table-column>
                <el-table-column label="累计收益"  align="center">
                    <template slot-scope="scope">
                        <span class="cm-amount">{{scope.row.revenue|moneyFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作"  align="center">
                    <template slot-scope="scope">
                        <router-link :to="'/userDetail/'+scope.row.id" size="small">查看详情</router-link>
                    </template>
                </el-table-column>
            </el-table>
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
                curYear:null,
                curMonth:null,
                selectedYear:null,
                yearArr:[
                  /*  {label:'全部',value:0}*/
                    ],
                selectedMonth:null,
                monthArr:[{label:'全部',value:0}],
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
                    dateString:dateString
                }
                Vue.api.getEarningsRanking(params).then((resp)=>{
                    if(resp.respCode=='00'){
                        this.entryList=JSON.parse(resp.respMsg);
                        if(rankingType!='thisYear'||rankingType!='thisMonth'){
                            this.entryList.forEach((item,i)=>{
                                if(item.user){
                                    Object.assign(item,JSON.parse(item.user));
                                }
                            })
                        }
                    }
                });
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
            //
        },
    }
</script>
