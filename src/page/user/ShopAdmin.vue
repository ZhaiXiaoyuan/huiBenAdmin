<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>账户系统</el-breadcrumb-item>
                <el-breadcrumb-item>门店管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-row class="handle-box">
                <el-col :span="14">
                    <v-distpicker class="cm-area-picker" :callback="changeArea" style="display: inline-block;"></v-distpicker>
                    <el-button size="small" style="margin-left: 5px;" @click="getAll()">全部</el-button>
                </el-col>
                <el-col :span="10" style="text-align: right">
                    <el-button type="primary" icon="el-icon-plus" @click="dialogFormVisible=true">新建门店</el-button>
                    <el-button type="primary" class="mr10" @click="uploadFile()">
                        批量导入
                        <input type="file" @change="importFile(this)" id="imFile" style="display: none"
                               accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
                    </el-button>
                    <el-button type="primary" class="mr10" @click="getAllList()">
                        导出二维码
                    </el-button>
                    <a id="downlink"></a>
                </el-col>
            </el-row>
            <el-table :data="entryList" border style="width: 100%;" ref="multipleTable" v-loading="pager.loading">
                <el-table-column label="序号" align="center" width="50">
                    <template slot-scope="scope">
                        {{scope.$index+1}}
                    </template>
                </el-table-column>
                <el-table-column prop="channelId" label="编号" align="center"></el-table-column>
                <el-table-column prop="companyName" label="公司名"  align="center"></el-table-column>
                <el-table-column prop="socialCreditCode" label="社会信用代码"  align="center"></el-table-column>
                <el-table-column prop="telephoneNums" label="电话"  align="center"></el-table-column>
                <el-table-column prop="province" label="省份"  align="center"></el-table-column>
                <el-table-column prop="city" label="市区"  align="center"></el-table-column>
                <el-table-column prop="county" label="县/区" align="center"></el-table-column>
                <el-table-column prop="address" label="详细地址" width="200"  align="center"></el-table-column>
                <el-table-column label="操作"  align="center">
                    <template slot-scope="scope">
                        <router-link :to="'/shopDetail/'+scope.row.id" size="small" @click="handleEdit(scope.$index, scope.row)">查看详情</router-link>
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
            <el-dialog title="新建" class="edit-dialog" :visible.sync="dialogFormVisible" v-if="dialogFormVisible" width="45%">
                <el-row type="flex">
                    <el-col :sm="24" :md="22" :lg="20">
                        <el-form :model="form">
                            <el-form-item label="公司名称" :label-width="formLabelWidth">
                                <el-input v-model="form.companyName" maxLength="50" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="企业信用码" :label-width="formLabelWidth">
                                <el-input v-model="form.socialCreditCode" maxLength="50" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="手机号码" :label-width="formLabelWidth">
                                <el-input v-model="form.telephoneNums" maxLength="50" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="门店渠道账户号码" :label-width="formLabelWidth">
                                <el-input v-model="form.shopChannelsPhoneNums" maxLength="50" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="渠道号" :label-width="formLabelWidth">
                                <el-input v-model="form.channelId" placeholder="请输入渠道号" maxLength="20" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="门店渠道返点" :label-width="formLabelWidth">
                                <el-input v-model="form.shopRebates" placeholder="请输入返点数，如输入1，则生效数额为1%" maxLength="4" auto-complete="off"></el-input>
                                <span class="unit">%</span>
                            </el-form-item>
                            <el-form-item label="中介渠道账户号码" :label-width="formLabelWidth">
                                <el-input v-model="form.marketingChannelsPhoneNums" maxLength="50" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="中介渠道返点" :label-width="formLabelWidth">
                                <el-input v-model="form.marketingRebates" placeholder="请输入返点数，如输入1，则生效数额为1%"  maxLength="4" auto-complete="off"></el-input>
                                <span class="unit">%</span>
                            </el-form-item>
                            <el-form-item label="其他渠道账户号码" :label-width="formLabelWidth">
                                <el-input v-model="form.otherPhoneNums" maxLength="50" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="其他渠道返点" :label-width="formLabelWidth">
                                <el-input v-model="form.otherRebates" placeholder="请输入返点数，如输入1，则生效数额为1%"  maxLength="4" auto-complete="off"></el-input>
                                <span class="unit">%</span>
                            </el-form-item>
                            <el-form-item label="地区" :label-width="formLabelWidth">
                                <v-distpicker class="cm-area-picker"  :callback="addShopChangeArea"></v-distpicker>
                            </el-form-item>
                            <el-form-item label="详细地址" :label-width="formLabelWidth">
                                <el-input v-model="form.address" maxLength="100" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary"
                               :disabled="!form.companyName||form.companyName==''
                           ||!form.socialCreditCode||form.socialCreditCode==''
                           ||!form.telephoneNums||form.telephoneNums==''
                           ||!form.shopChannelsPhoneNums||form.shopChannelsPhoneNums==''
                           ||!form.channelId||form.channelId==''
                           ||form.shopRebates==''
                           ||!form.marketingChannelsPhoneNums||form.marketingChannelsPhoneNums==''
                           ||form.marketingRebates==''
                           ||!form.otherPhoneNums||form.otherPhoneNums==''
                           ||form.otherRebates==''
                           ||!form.province||form.province==''
                           ||!form.city||form.city==''
                           ||!form.county||form.county==''
                           ||!form.address||form.address==''"
                               @click="add()">提交</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
    .handle-box{
        margin-bottom: 20px;
    }
    .el-input{
    }
    .unit{
        position: absolute;
        top:0px;;
        bottom: 0px;
        right: 0px;
        padding: 2px 10px;
        font-weight: bold;
        color: #F56C6C;
    }
</style>
<script>
    import Vue from 'vue'
   /* import Distpicker from '../../components/Distpicker'*/
    let XLSX = require('xlsx');
    export default {
        components: {

        },
        data() {
            return {

                province:null,
                city:null,
                county:null,
                regionKeyword:null,
                pager:{
                    pageIndex:1,
                    pageSize:20,
                    total:0,
                    loading:false
                },
                entryList:[],
                timer:null,
                previous:null,

                fullscreenLoading: false, // 加载中
                imFile: '', // 导入文件el
                outFile: '',  // 导出文件el
                errorDialog: false, // 错误信息弹窗
                errorMsg: '', // 错误信息内容
                excelData: [],

                dialogFormVisible: false,
                form:{province:'',city:'',county:''},
                formLabelWidth: '140px',

                downLoadFb:null,
            }
        },
        created(){

        },
        watch:{

        },
        computed: {
        },
        methods: {
            uploadFile: function () { // 按钮导入
                this.imFile.click()
            },
            downloadFile: function (rs) { // 按钮导出
                let data = [{}]
                for (let k in rs[0]) {
                    data[0][k] = k
                }
                data = data.concat(rs)
                this.downloadExl(data, '菜单')
            },
            importFile: function () { // 导入excel
                this.fullscreenLoading = true
                let obj = this.imFile
                if (!obj.files) {
                    this.fullscreenLoading = false
                    return
                }
                var f = obj.files[0]
                var reader = new FileReader()
                let $t = this
                reader.onload = function (e) {
                    var data = e.target.result
                    if ($t.rABS) {
                        $t.wb = XLSX.read(btoa(this.fixdata(data)), {  // 手动转化
                            type: 'base64'
                        })
                    } else {
                        $t.wb = XLSX.read(data, {
                            type: 'binary'
                        })
                    }
                 /*   for(let i=0;i<$t.wb.SheetNames.length;i++){
                        let json = XLSX.utils.sheet_to_json($t.wb.Sheets[$t.wb.SheetNames[i]]);
                        $t.dealFile($t.analyzeData(json)) // analyzeData: 解析导入数据
                    }*/
                    let json = XLSX.utils.sheet_to_json($t.wb.Sheets[$t.wb.SheetNames[0]]);
                    $t.dealFile($t.analyzeData(json)) // analyzeData: 解析导入数据
                }
                if (this.rABS) {
                    reader.readAsArrayBuffer(f)
                } else {
                    reader.readAsBinaryString(f)
                }
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
            analyzeData: function (data) {  // 此处可以解析导入数据
                return data
            },
            dealFile: function (data) {   // 处理导入的数据
                console.log(data)
                this.imFile.value = ''
                this.fullscreenLoading = false
                if (data.length <= 0) {
                    this.errorDialog = true
                    this.errorMsg = '请导入正确信息'
                } else {
                    this.excelData = [];
                    data.forEach((item,key)=>{
                     /*   console.log('item:',item);*/
                        if(parseInt(item['夜彩门店信息'])>=1&&item.__EMPTY){
                            this.excelData.push({
                                "telephoneNums":item.__EMPTY_2,
                                "shopChannelsPhoneNums":item.__EMPTY_8,
                                "shopRebates":item.__EMPTY_10,
                                "marketingChannelsPhoneNums":item.__EMPTY_11,
                                "marketingRebates":item.__EMPTY_13,
                                "otherPhoneNums":item.__EMPTY_14,
                                "otherRebates":item.__EMPTY_16,
                                "companyName":item.__EMPTY,
                                "socialCreditCode":item.__EMPTY_1,
                                "province":item.__EMPTY_4,
                                "city":item.__EMPTY_5,
                                "county":item.__EMPTY_6,
                                "address":item.__EMPTY_7,
                                channelId:item.__EMPTY_3,
                            })
                        }
                    });
                   /**/
                   if(this.excelData.length>0){
                       let fb=Vue.operationFeedback({text:'导入中...'});
                       Vue.api.addShopBatch({...Vue.sessionInfo(),shopData:JSON.stringify(this.excelData)}).then((resp)=>{
                           if(resp.respCode=='00'){
                               this.getList();
                               fb.setOptions({type:'complete',text:'导入成功'});
                           }else{
                               fb.setOptions({type:'warn',text:'导入失败，'+resp.respMsg});
                           }
                       });
                   }
                }
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
            fixdata: function (data) {  // 文件流转BinaryString
                var o = ''
                var l = 0
                var w = 10240
                for (; l < data.byteLength / w; ++l) {
                    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
                }
                o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
                return o
            },

            getList:function (pageIndex) {
                this.pager.pageIndex=pageIndex?pageIndex:1;
                let params={
                    ...Vue.sessionInfo(),
                    pageIndex:this.pager.pageIndex,
                    pageSize:this.pager.pageSize,
                    searchContent:this.regionKeyword?this.regionKeyword:null,
                }
                this.pager.loading=true;
                Vue.api.getShopList(params).then((resp)=>{
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
            getAll:function () {
                this.province=null;
                this.city=null;
                this.county=null;
                this.regionKeyword=null;
                this.getList();
            },
            getAllList:function (pageIndex) {
                let params={
                    ...Vue.sessionInfo(),
                    pageIndex:1,
                    pageSize:this.pager.total,
                    searchContent:this.regionKeyword?this.regionKeyword:null,
                }
                this.downLoadFb=Vue.operationFeedback({text:'导出中...'});
                Vue.api.getShopList(params).then((resp)=>{
                    if(resp.respCode=='00'){
                        let data=JSON.parse(resp.respMsg);
                        let allList=JSON.parse(data.shopList);
                        let jsonData=[
                            {
                                1:'序号',
                                2:'公司名',
                                3:'省份',
                                4:'市区',
                                5:'县',
                                6:'详细地址',
                                7:'手机号码',
                                8:'姓名',
                                9:'HTML推广二维码',
                                10:'HTML推广二维码内容',
                                11:'app推广二维码',
                                12:'app推广二维码内容',
                            }
                        ];
                        allList.forEach((item,i)=>{
                            jsonData.push({
                                1:i+1,
                                2:item.companyName,//公司名
                                3:item.province,//省份
                                4:item.city,//市区
                                5:item.county,//县
                                6:item.address,//详细地址
                                7:item['shopChannelsId-phoneNums'],//手机号码
                                8:item['shopChannelsId-name'],//姓名
                                9:Vue.basicConfig.basicUrl+item.qRCodeId,//HTML推广二维码
                                10:Vue.basicConfig.qrCodeBasicUrl+'?channels='+item.channelId,//HTML推广二维码内容
                                11:Vue.basicConfig.basicUrl+item.appQrCodeId,//app推广二维码
                                12:Vue.basicConfig.appBaickUrl+'?channels='+item.channelId,//app推广二维码内容
                            });
                        });
                        this.downloadExl(jsonData,'二维码导出表');
                    }else{
                        this.downLoadFb.setOptions({type:'warn',text:'导出失败，'+resp.respMsg});
                    }
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
            addShopChangeArea:function (data) {
                if(data.type=='province'){
                    this.form.province=data.value;
                }else if(data.type=='city'){
                    this.form.city=data.value;
                }else if(data.type=='area'){
                    this.form.county=data.value;
                }
            },
            add:function () {
                if(this.form.channelId.length!=12){
                    Vue.operationFeedback({type:'warn',text:'请输入12位的渠道号'});
                    return;
                }
                let shopRebates=this.form.shopRebates/100;
                let marketingRebates=this.form.marketingRebates/100;
                let otherRebates=this.form.otherRebates/100;
                let params={
                    ...Vue.sessionInfo(),
                    ...this.form
                }
                params.shopRebates=shopRebates;
                params.marketingRebates=marketingRebates;
                params.otherRebates=otherRebates;
                let fb=Vue.operationFeedback({text:'保存中...'});
                Vue.api.addShop(params).then((resp)=>{
                    if(resp.respCode=='00'){
                        this.form={province:'',city:'',county:''};
                        this.getList();
                        this.dialogFormVisible = false;
                        fb.setOptions({type:'complete',text:'新建成功'});
                    }else{
                        fb.setOptions({type:'warn',text:'新建失败，'+resp.respMsg});
                    }
                });
            },
        },
        mounted () {
            this.imFile = document.getElementById('imFile');
            this.outFile = document.getElementById('downlink');

            //
            this.getList();
            //

        },
    }
</script>
