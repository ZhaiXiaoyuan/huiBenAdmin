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
                <el-table-column prop="borrowOrder.userId" label="用户ID" align="center"></el-table-column>
                <el-table-column prop="borrowOrder.receivingName" label="收货人"  align="center"></el-table-column>
                <el-table-column prop="borrowOrder.receivingPhone" label="收货手机"  align="center"></el-table-column>
                <el-table-column label="支付时间" align="center" >
                    <template slot-scope="scope">
                        {{scope.row.borrowOrder.prePayTime?(scope.row.borrowOrder.prePayTime|formatDate('yyyy-MM-dd hh:mm:ss')):'-'}}
                    </template>
                </el-table-column>
                <el-table-column prop="borrowOrder.orderId" label="订单号"  align="center"></el-table-column>
                <el-table-column label="支付流水号" align="center"  >
                    <template slot-scope="scope">
                        {{scope.row.borrowOrder.transactionId|empty}}
                    </template>
                </el-table-column>
                <el-table-column label="订单状态" align="center"  >
                    <template slot-scope="scope">
                        {{scope.row.borrowOrder.state|orderStatus}}
                    </template>
                </el-table-column>
                <el-table-column label="签收时间" align="center" >
                    <template slot-scope="scope">
                        {{scope.row.borrowOrder.deliverExpressSignTime?(scope.row.borrowOrder.deliverExpressSignTime|formatDate('yyyy-MM-dd hh:mm:ss')):'-'}}
                    </template>
                </el-table-column>
                <el-table-column label="归还时间" align="center" >
                    <template slot-scope="scope">
                        {{scope.row.borrowOrder.returnExpressStartTime?(scope.row.borrowOrder.returnExpressStartTime|formatDate('yyyy-MM-dd hh:mm:ss')):'-'}}
                    </template>
                </el-table-column>
                <el-table-column label="计费时长" align="center" >
                    <template slot-scope="scope">
                        {{scope.row.borrowOrder.billingTime?scope.row.borrowOrder.billingTime+'天':'-'}}
                    </template>
                </el-table-column>
                <el-table-column prop="borrowOrder.finalSettlementAmount" label="结算金额"  align="center"></el-table-column>
                <el-table-column label="定损理由" align="center" >
                    <template slot-scope="scope">
                        {{scope.row.borrowOrder.lostCostMsg|empty}}
                    </template>
                </el-table-column>
                <el-table-column label="操作"  align="center">
                    <template slot-scope="scope">
                        <span @click="openSettlementModal(scope.row)" v-if="scope.row.borrowOrder.state=='waitSettlement'"  class="cm-btn cm-link-btn">修改结算金额</span>
                        <span @click="getDetail(scope.row)" class="cm-btn cm-link-btn">查看详情</span>
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


        <el-dialog title="修改结算金额" class="edit-dialog" :visible.sync="settlementModalFlag" v-if="settlementModalFlag" width="400px">
            <div class="dialog-body">
                <el-form :model="settlementForm" ref="settlementForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="原结算价：" prop="finalSettlementAmount">
                        <el-input v-model="settlementForm.finalSettlementAmount" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="现结算价：" prop="newFinalSettlementAmount">
                        <el-input v-model="settlementForm.newFinalSettlementAmount"></el-input>
                    </el-form-item>
                    <el-form-item label="结算理由：" prop="finalSettlementMsg">
                        <el-input type="textarea" v-model="settlementForm.finalSettlementMsg" rows="4"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeSettlementModal()">取 消</el-button>
                <el-button type="primary" @click="saveSettlement()">提交</el-button>
            </div>
        </el-dialog>

        <el-dialog title="订单详情" class="" :visible.sync="detailModalFlag" v-if="detailModalFlag" width="80%">
            <div class="modal-body">
                <el-row>
                    <el-col :span="12">
                        <p>订单编号：{{detail.borrowOrder.orderId}}</p>
                        <p>生成时间：{{detail.borrowOrder.prePayTime?(detail.borrowOrder.prePayTime|formatDate('yyyy-MM-dd hh:mm:ss')):''}}</p>
                        <p>订单预付金额：{{detail.borrowOrder.amount}}</p>
                        <p>支付方式：</p>
                        <p>支付流水号：{{detail.borrowOrder.transactionId}}</p>
                        <p>发货时间：</p>
                        <p>借出物流承运商：</p>
                        <p>借出物流单号：</p>
                        <p>签收时间：{{detail.borrowOrder.deliverExpressSignTime?(detail.borrowOrder.deliverExpressSignTime|formatDate('yyyy-MM-dd hh:mm:ss')):''}}</p>
                    </el-col>
                    <el-col :span="12">
                        <p>还书发起时间：</p>
                        <p>还书物流承运商：</p>
                        <p>还书物流单号：</p>
                        <p>还书揽件时间：</p>
                        <p>计费时长：{{detail.borrowOrder.billingTime?detail.borrowOrder.billingTime+'天':''}}</p>
                        <p>结算金额：{{detail.borrowOrder.finalSettlementAmount}}</p>
                        <p>结算支付时间：{{detail.borrowOrder.finalSettlementTime?(detail.borrowOrder.finalSettlementTime|formatDate('yyyy-MM-dd hh:mm:ss')):''}}</p>
                        <p>结算备注：{{detail.borrowOrder.finalSettlementMsg}}</p>
                    </el-col>
                </el-row>
                <div style="border-top: 1px solid #ddd;margin-top: 20px;">
                    <el-row style="padding: 10px 0px;">
                        <el-col :span="14">
                            <span style="font-size: 18px;color: #333;">租借书本：</span>
                        </el-col>
                    </el-row>
                    <el-table :data="detail.bookSkuList" border style="width: 100%;" ref="multipleTable">
                        <el-table-column label="序号" align="center" width="50" >
                            <template slot-scope="scope">
                                {{scope.$index+1}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="书名"  align="center"></el-table-column>
                        <el-table-column prop="isbn" label="条码"  align="center"></el-table-column>
                        <el-table-column prop="shelvesSerial" label="编码"  align="center"></el-table-column>
                        <el-table-column prop="" label="租借次数"  align="center"></el-table-column>
                        <el-table-column prop="" label="总借出天数"  align="center"></el-table-column>
                    </el-table>
                </div>
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

                detailModalFlag: false,
                detail:null,


                settlementModalFlag:false,
                settlementForm:{
                    finalSettlementAmount:null,
                    newFinalSettlementAmount:null,
                    finalSettlementMsg:''
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
                    userId:'',
                    orderState:'',//“”，"waitPay","waitSent","waitReach","borrowing", "waitReturn","waitInventory","waitSettlement","finish","cancel"
                    pageIndex:this.pager.pageIndex,
                    pageSize:this.pager.pageSize,
                }
                this.pager.loading=true;
                Vue.api.getUserBorrowOrderList(params).then((resp)=>{
                    if(resp.respCode=='2000'){
                        let data=JSON.parse(resp.respMsg);
                        let list=data.borrowOrderList;
                        this.entryList=list;
                        this.pager.total=data.count;
                          console.log('this.entryList:',this.entryList);
                        //临时测试
                       /* this.openSettlementModal(list[0]);*/

                       /*this.getDetail(list[0]);*/
                    }
                    let timeout=setTimeout(()=>{
                        this.pager.loading=false;
                        clearTimeout(timeout);
                    },500)
                });
            },
            getDetail:function (entry) {
                this.curEntry=entry;
                let params={
                    orderId:this.curEntry.borrowOrder.orderId
                }
                Vue.api.getBorrowOrder(params).then((resp)=>{
                    if(resp.respCode=='2000'){
                        let data=JSON.parse(resp.respMsg);
                        this.detail=data;
                        console.log(' this.detail:', this.detail);
                        this.detailModalFlag=true;
                    }
                });
            },
            openSettlementModal:function (entry) {
                this.curEntry=entry;
                this.settlementForm.finalSettlementAmount=this.curEntry.borrowOrder.finalSettlementAmount;
                this.settlementModalFlag=true;
            },
            closeSettlementModal:function () {
                this.$refs['settlementForm'].resetFields();
                this.settlementModalFlag=false;
            },
            saveSettlement:function () {
                console.log('this.curEntry:',this.curEntry);
                if(!this.settlementForm.newFinalSettlementAmount){
                    Vue.operationFeedback({type:'warn',text:'请输入现结算价'});
                    return;
                }
                if(!this.settlementForm.finalSettlementMsg){
                    Vue.operationFeedback({type:'warn',text:'请输入调整理由'});
                    return;
                }
                let fb=Vue.operationFeedback({text:'保存中...'});
                let params={
                    borrowOrderId:this.curEntry.borrowOrder.orderId,
                    finalSettlementAmount: this.settlementForm.newFinalSettlementAmount,
                    finalSettlementMsg:this.settlementForm.finalSettlementMsg,
                    operationPlatformHandlerId:this.account.id,
                }
                Vue.api.finishBorrowOrder(params).then((resp)=>{
                    if(resp.respCode=='2000'){
                        fb.setOptions({type:'complete',text:'保存成功'});
                        this.closeRemarkModal();
                    }else{
                        fb.setOptions({type:'warn',text:'保存失败，'+resp.respMsg});
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
