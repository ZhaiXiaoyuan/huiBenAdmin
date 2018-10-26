<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>订单统计</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <a id="downlink"></a>
            <el-tabs v-model="activeName">
                <el-tab-pane label="订单报表" name="first">
                    <el-row class="handle-box">
                        <el-col :span="14">
                            <span style="padding-right: 5px;">日期</span>
                            <el-date-picker
                                v-model="orderDateStr"
                                type="date"
                                :picker-options="datePickerOptions"
                                placeholder="选择日期">
                            </el-date-picker>
                            <el-select v-model="orderSelectedShop" @change="shopChange" class="handle cm-select">
                                <el-option
                                    v-for="(item,index) in shopOptions"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="10" style="text-align: right;">
                            <el-button type="primary" class="mr10" @click="downLoadOrder()">
                                导出订单数据
                            </el-button>
                        </el-col>
                    </el-row>
                    <el-table :data="orderList" border style="width: 100%;" ref="multipleTable" v-loading="orderPage.loading">
                        <el-table-column label="序号" align="center" width="50">
                            <template slot-scope="scope">
                                {{scope.$index+1}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="outOrderId" label="订单号" align="center"></el-table-column>
                        <el-table-column prop="lotteryNo" label="彩票编号"  align="center"></el-table-column>
                        <el-table-column label="购彩金额"  align="center">
                            <template slot-scope="scope">
                                <span class="cm-amount">{{scope.row.lotteryAmount|moneyFormat}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="lotteryNoteCode" label="购彩注码" align="center"></el-table-column>
                        <el-table-column label="订单状态" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.orderState=='success'||scope.row.orderState=='SUCCESS'">成功</span>
                                <span v-if="scope.row.orderState=='fail'||scope.row.orderState=='FAIL'">失败</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="channel" label="商户号" align="center"></el-table-column>
                        <el-table-column prop="shop" label="公司名" align="center"></el-table-column>
                        <el-table-column label="时间" width="200"  align="center">
                            <template slot-scope="scope">
                                {{scope.row.createdAt|formatDate('yyyy-MM-dd hh:mm:ss')}}
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination
                            @current-change ="getOrderList"
                            layout="prev, pager, next"
                            :page-size="orderPage.pageSize"
                            :total="orderPage.total">
                        </el-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="中奖报表" name="second">
                    <el-row class="handle-box">
                        <el-col :span="14">
                            <span style="padding-right: 5px;">日期</span>
                            <el-date-picker
                                v-model="winDateStr"
                                type="date"
                                placeholder="选择日期">
                            </el-date-picker>
                            <el-select v-model="winSelectedShop" @change="shopChange" class="handle cm-select">
                                <el-option
                                    v-for="(item,index) in shopOptions"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="10" style="text-align: right;">
                            <el-button type="primary" class="mr10" @click="downloadWin()">
                                导出中奖数据
                            </el-button>
                        </el-col>
                    </el-row>
                    <el-table :data="winList" border style="width: 100%;" ref="multipleTable" v-loading="winPage.loading">
                        <el-table-column label="序号" align="center" width="50">
                            <template slot-scope="scope">
                                {{scope.$index+1}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="outOrderId" label="订单号" align="center"></el-table-column>
                        <el-table-column prop="lotteryNo" label="彩票编号"  align="center"></el-table-column>
                        <el-table-column label="中奖金额"  align="center">
                            <template slot-scope="scope">
                                <span class="cm-amount">{{(scope.row.prizeMoney?scope.row.prizeMoney:0)|moneyFormat}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="mobile" label="用户手机号" align="center"></el-table-column>
                        <el-table-column prop="channel" label="商户号" align="center"></el-table-column>
                        <el-table-column prop="shop" label="公司名" align="center"></el-table-column>
                        <el-table-column label="时间" width="200"  align="center">
                            <template slot-scope="scope" v-if="scope.row.createdAt">
                                {{scope.row.createdAt|formatDate('yyyy-MM-dd hh:mm:ss')}}
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination
                            @current-change ="getWinList"
                            layout="prev, pager, next"
                            :page-size="winPage.pageSize"
                            :total="winPage.total">
                        </el-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="统计报表" name="third">
                    <el-row class="handle-box">
                        <el-col :span="14">
                            <span style="padding-right: 5px;">日期</span>
                            <el-date-picker
                                v-model="statisticsDateStr"
                                type="date"
                                :picker-options="datePickerOptions"
                                placeholder="选择日期">
                            </el-date-picker>
                            <el-select v-model="selectedShop" @change="shopChange" class="handle cm-select">
                                <el-option
                                    v-for="(item,index) in shopOptions"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="10" style="text-align: right;">
                            <el-button type="primary" class="mr10" @click="downLoadStatistics()">
                                导出统计数据
                            </el-button>
                        </el-col>
                    </el-row>
                    <el-table :data="statisticsList" border style="width: 100%;" ref="multipleTable" v-loading="statisticsPage.loading">
                        <el-table-column label="序号" align="center" width="50">
                            <template slot-scope="scope">
                                {{scope.$index+1}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="companyName" label="公司名" align="center"></el-table-column>
                        <el-table-column prop="channelId" label="渠道号"  align="center"></el-table-column>
                        <el-table-column label="订单总金额/日"  align="center">
                            <template slot-scope="scope">
                                <span class="cm-amount">{{scope.row.daySale|moneyFormat}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="订单总金额/月" align="center">
                            <template slot-scope="scope">
                                <span class="cm-amount">{{scope.row.monthSale|moneyFormat}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="dayOrderCount" label="订单数/日" align="center"></el-table-column>
                        <el-table-column prop="monthOrderCount" label="订单数/月" align="center"></el-table-column>
                        <el-table-column prop="dayWinCount" label="中奖数/日" align="center"></el-table-column>
                        <el-table-column prop="monthWinCount" label="中奖数/月" align="center"></el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination
                            @current-change ="getStatisticsList"
                            layout="prev, pager, next"
                            :page-size="statisticsPage.pageSize"
                            :total="statisticsPage.total">
                        </el-pagination>
                    </div>
                </el-tab-pane>
            </el-tabs>
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
                account:null,
                datePickerOptions:{
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e6
                    }
                },

                activeName: 'first',

                orderSelectedShop:null,
                orderPage:{
                  pageIndex:1,
                  pageSize:20,
                  total:0,
                  loading:false
                },
                orderList:[],
                orderDateStr:'all',

                winSelectedShop:null,
                winPage:{
                    pageIndex:1,
                    pageSize:20,
                    total:0,
                    loading:false
                },
                winList:[],
                winDateStr:'all',

                selectedShop:null,
                shopOptions:[ {
                    value:null,
                    label:'全部',
                },],
                statisticsPage:{
                    pageIndex:1,
                    pageSize:20,
                    total:0,
                    loading:false
                },
                curDateStr:Vue.formatDate(new Date(),'yyyy-MM-dd'),
                statisticsDateStr:null,
                statisticsList:[],

            }
        },
        created(){
        },
        watch: {
            orderDateStr(value) {
                if(value){
                    this.orderDateStr=Vue.formatDate(value,'yyyy-MM-dd');
                }else{
                    this.orderDateStr='all';
                }
                if(!this.orderPage.loading){
                    this.getOrderList();
                }
            },
            winDateStr(value) {
                if(value){
                    this.winDateStr=Vue.formatDate(value,'yyyy-MM-dd');
                }else{
                    this.winDateStr='all';
                }
                if(!this.winPage.loading){
                    this.getWinList();
                }
            },
            statisticsDateStr(value) {
                if(value){
                    this.statisticsDateStr=Vue.formatDate(value,'yyyy-MM-dd');
                }else{
                    this.statisticsDateStr=null;
                }
                if(!this.statisticsPage.loading){
                    this.getStatisticsList();
                }
            },
        },
        computed: {
        },
        methods: {
            getOrderList:function (pageIndex) {
                let that=this;
                this.orderPage.pageIndex=pageIndex?pageIndex:1;
                let params={
                    ...Vue.sessionInfo(),
                    userId:this.account.id,
                    pageIndex:this.orderPage.pageIndex,
                    pageSize:this.orderPage.pageSize,
                    dateString:this.orderDateStr,
                    channel:this.orderSelectedShop
                }
                this.orderPage.loading=true;
                Vue.api.getShopOrderList(params).then((resp)=>{
                    if(resp.respCode=='00'){
                        let data=JSON.parse(resp.respMsg);
                        let list=JSON.parse(data.orderList);
                        that.orderList=[];
                        list.forEach(function (item,i) {
                            that.orderList.push({
                               ...JSON.parse(item.tpOrder),
                                shop:item.shop,
                            });
                        })
                        console.log('this.orderList:',this.orderList);
                        this.orderPage.total=data.orderCount;
                    }
                    this.orderPage.loading=false;
                });
            },
            downLoadOrder:function () {
                if(this.orderPage.total<=0){
                    return;
                }
                let params={
                    ...Vue.sessionInfo(),
                    userId:this.account.id,
                    pageIndex:1,
                    pageSize:this.orderPage.total,
                    dateString:this.orderDateStr,
                    channel:this.orderSelectedShop
                }
                this.downLoadFb=Vue.operationFeedback({text:'导出中...'});
                Vue.api.getShopOrderList(params).then((resp)=>{
                    if(resp.respCode=='00'){
                        let data=JSON.parse(resp.respMsg);
                        let allList=JSON.parse(data.orderList);
                        console.log('allList:',allList);
                        let jsonData=[
                            {
                                1:'序号',
                                2:'订单号',
                                3:'彩票编号',
                                4:'购彩金额',
                                5:'购彩注码',
                                6:'订单状态',
                                7:'商户号',
                                8:'公司名',
                                9:'时间',
                            }
                        ];
                        allList.forEach((item,i)=>{
                            item={
                                ...JSON.parse(item.tpOrder),
                                shop:item.shop,
                            }
                            jsonData.push({
                                1:i+1,
                                2:item.outOrderId,
                                3:item.lotteryNo,
                                4:Vue.moneyFormat(item.lotteryAmount),
                                5:item.lotteryNoteCode,
                                6:item.orderState=='success'||item.orderState=='SUCCESS'?'成功':'失败',
                                7:item.channel,
                                8:item.shop,
                                9:Vue.formatDate(item.createdAt,'yyyy-MM-dd hh:mm:ss'),
                            });
                        });
                        this.downloadExl(jsonData,'订单报表');
                    }else{
                        this.downLoadFb.setOptions({type:'warn',text:'导出失败，'+resp.respMsg});
                    }
                });
            },

            getWinList:function (pageIndex) {
                let that=this;
                this.winPage.pageIndex=pageIndex?pageIndex:1;
                let params={
                    ...Vue.sessionInfo(),
                      userId:this.account.id,
                    pageIndex:this.winPage.pageIndex,
                    pageSize:this.winPage.pageSize,
                    dateString:this.winDateStr,
                    channel:this.winSelectedShop
                }
                this.winPage.loading=true;
                Vue.api.getUserShopWinInfoList(params).then((resp)=>{
                    if(resp.respCode=='00'){
                        let data=JSON.parse(resp.respMsg);
                        let list=JSON.parse(data.winInfoList);
                        this.winList=[];
                        list.forEach(function (item,i) {
                            that.winList.push({
                                shop:item.shop,
                                channel:item.channel,
                                ...JSON.parse(item.winInfo),
                            });
                        })
                      /*  console.log('this.winList:',this.winList);*/
                        this.winPage.total=data.winInfoCount;
                    }
                    this.winPage.loading=false;
                });
            },
            downloadWin:function () {
                if(this.winPage.total<=0){
                    return;
                }
                let params={
                    ...Vue.sessionInfo(),
                    userId:this.account.id,
                    pageIndex:1,
                    pageSize:this.winPage.total,
                    dateString:this.winDateStr,
                    channel:this.winSelectedShop
                }
                this.downLoadFb=Vue.operationFeedback({text:'导出中...'});
                Vue.api.getUserShopWinInfoList(params).then((resp)=>{
                    if(resp.respCode=='00'){
                        let data=JSON.parse(resp.respMsg);
                        let allList=JSON.parse(data.winInfoList);
                        console.log('allList:',allList);
                        let jsonData=[
                            {
                                1:'序号',
                                2:'订单号',
                                3:'彩票编号',
                                4:'中奖金额',
                                5:'用户手机号',
                                6:'商户号',
                                7:'公司名',
                                8:'时间',
                            }
                        ];
                        allList.forEach((item,i)=>{
                            item={
                                shop:item.shop,
                                channel:item.channel,
                                ...JSON.parse(item.winInfo),
                            }
                            jsonData.push({
                                1:i+1,
                                2:item.outOrderId,
                                3:item.lotteryNo,
                                4:Vue.moneyFormat(item.prizeMoney),
                                5:item.mobile,
                                6:item.channel,
                                7:item.shop,
                                8:Vue.formatDate(item.createdAt,'yyyy-MM-dd hh:mm:ss'),
                            });
                        });
                        this.downloadExl(jsonData,'中奖报表');
                    }else{
                        this.downLoadFb.setOptions({type:'warn',text:'导出失败，'+resp.respMsg});
                    }
                });
            },
            getStatisticsList:function (pageIndex) {
                let that=this;
                this.statisticsPage.pageIndex=pageIndex?pageIndex:1;
                let params={
                    ...Vue.sessionInfo(),
                    userId:this.account.id,
                    pageIndex:this.statisticsPage.pageIndex,
                    pageSize:this.statisticsPage.pageSize,
                    channel:this.selectedShop,
                    dateString:this.statisticsDateStr==this.curDateStr?'today':this.statisticsDateStr,
                }
                this.statisticsPage.loading=true;
                Vue.api.getUserShopStatistics(params).then((resp)=>{
                    if(resp.respCode=='00'){
                        let data=JSON.parse(resp.respMsg);
                        this.statisticsList=JSON.parse(data.shopList);
                        this.statisticsPage.total=data.count;
                    }
                    this.statisticsPage.loading=false;
                });
            },
            getUserShop:function () {
                let params={
                    ...Vue.sessionInfo(),
                    userId:this.account.id,
                }
                Vue.api.getUserShop(params).then((resp)=>{
                    if(resp.respCode=='00'){
                        let data=JSON.parse(resp.respMsg);
                        data.forEach((item,i)=>{
                            this.shopOptions.push({
                                label:item.channelId+item.companyName,
                                value:item.channelId
                            })
                        });
                    }
                });
            },
            shopChange:function (data) {
                if(this.activeName=='first'){
                    this.getOrderList();
                }else if(this.activeName=='second'){
                    this.getWinList();
                }else if(this.activeName=='third'){
                    this.getStatisticsList();
                }
            },
            downLoadStatistics:function () {
                let params={
                    ...Vue.sessionInfo(),
                    userId:this.account.id,
                    pageIndex:1,
                    pageSize:this.statisticsPage.total,
                    channel:this.selectedShop,
                    dateString:this.statisticsDateStr==this.curDateStr?'today':this.statisticsDateStr,
                }
                this.downLoadFb=Vue.operationFeedback({text:'导出中...'});
                Vue.api.getUserShopStatistics(params).then((resp)=>{
                    if(resp.respCode=='00'){
                        let data=JSON.parse(resp.respMsg);
                        let allList=JSON.parse(data.shopList);
                        let jsonData=[
                            {
                                1:'序号',
                                2:'公司名',
                                3:'渠道号',
                                4:'订单总金额/日',
                                5:'订单总金额/月',
                                6:'订单数/日',
                                7:'订单数/月',
                                8:'中奖数/日',
                                9:'中奖数/月',
                            }
                        ];
                        allList.forEach((item,i)=>{
                            jsonData.push({
                                1:i+1,
                                2:item.companyName,
                                3:item.channelId,
                                4:Vue.moneyFormat(item.daySale),
                                5:Vue.moneyFormat(item.monthSale),
                                6:item.dayOrderCount,
                                7:item.monthOrderCount,
                                8:item.dayWinCount,
                                9:item.monthWinCount,
                            });
                        });
                        this.downloadExl(jsonData,'统计报表');
                    }else{
                        this.downLoadFb.setOptions({type:'warn',text:'导出失败，'+resp.respMsg});
                    }
                });
            },

            downloadFile: function (rs) { // 按钮导出
                let data = [{}]
                for (let k in rs[0]) {
                    data[0][k] = k
                }
                data = data.concat(rs)
                this.downloadExl(data, '菜单')
            },
            downloadExl: function (json, downName, type) {  // 导出到excel
                let that=this;
                //
                let keyMap = [] // 获取键
                for (let k in json[0]) {
                    keyMap.push(k)
                }
                console.info('keyMap', keyMap, json)
                let tmpdata = [] // 用来保存转换好的json
                json.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
                    v: v[k],
                    position: (j > 25 ? this.getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
                }))).reduce((prev, next) => prev.concat(next)).forEach(function (v) {
                    tmpdata[v.position] = {
                        v: v.v
                    }
                })
                let outputPos = Object.keys(tmpdata)  // 设置区域,比如表格从A1到D10
                let tmpWB = {
                    SheetNames: ['mySheet'], // 保存的表标题
                    Sheets: {
                        'mySheet': Object.assign({},
                            tmpdata, // 内容
                            {
                                '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] // 设置填充区域
                            })
                    }
                }
                let tmpDown = new Blob([this.s2ab(XLSX.write(tmpWB,
                    {bookType: (type === undefined ? 'xlsx' : type), bookSST: false, type: 'binary'} // 这里的数据是用来定义导出的格式类型
                ))], {
                    type: ''
                })  // 创建二进制对象写入转换好的字节流
                var href = URL.createObjectURL(tmpDown)  // 创建对象超链接
                this.outFile.download = downName + '.xlsx'  // 下载名称
                this.outFile.href = href  // 绑定a标签
                this.outFile.click()  // 模拟点击实现下载
                this.downLoadFb.setOptions({type:'complete',text:'导出成功，请留意浏览器的下载文件'});
                setTimeout(function () {  // 延时释放
                    URL.revokeObjectURL(tmpDown) // 用URL.revokeObjectURL()来释放这个object URL
                }, 100)
            },
            s2ab: function (s) { // 字符串转字符流
                var buf = new ArrayBuffer(s.length)
                var view = new Uint8Array(buf)
                for (var i = 0; i !== s.length; ++i) {
                    view[i] = s.charCodeAt(i) & 0xFF
                }
                return buf
            },
            getCharCol: function (n) { // 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
                let s = ''
                let m = 0
                while (n > 0) {
                    m = n % 26 + 1
                    s = String.fromCharCode(m + 64) + s
                    n = (n - m) / 26
                }
                return s
            },
        },
        mounted () {
            this.account=JSON.parse(this.$cookie.get('account'));
            /**/
      /*      this.dateStr=Vue.formatDate(new Date(),'yyyy-MM-dd')*/
            /**/
          /*  this.orderDateStr=this.curDateStr;*/
            this.getOrderList();
            /**/
            this.getWinList();
            /**/
            this.outFile = document.getElementById('downlink');
            this.getUserShop();
            this.statisticsDateStr=this.curDateStr;
            this.getStatisticsList();

        },
    }
</script>
