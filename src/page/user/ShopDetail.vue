<template>
    <div class="shop-detail">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>账户系统</el-breadcrumb-item>
                <el-breadcrumb-item>门店管理</el-breadcrumb-item>
                <el-breadcrumb-item>门店详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-row class="container-hd">
                <el-col :span="12">
                    <el-button type="primary" icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
                </el-col>
                <el-col :span="12" style="text-align: right;">
                    <el-button type="primary" icon="el-icon-delete" v-if="shopDetail.accountState!='del'" @click="del()">删除</el-button>
                    <el-button type="primary" icon="el-icon-warning" v-if="shopDetail.accountState=='enable'" @click="disable()">禁用</el-button>
                    <el-button type="primary" icon="el-icon-view" v-if="shopDetail.accountState=='disable'" @click="enable()">恢复</el-button>
                    <el-button type="primary" icon="el-icon-edit" v-if="shopDetail.accountState=='enable'" @click="dialogFormVisible=true">编辑</el-button>
                    <el-button type="primary" class="mr10" @click="downloadQrcodeInfo()">
                        导出二维码
                    </el-button>
                    <a id="downlink"></a>
                </el-col>
            </el-row>
            <div class="container-bd">
                <el-row class="block">
                    <el-col :span="16">
                        <el-row class="info-row">
                            <el-col :span="5" style="text-align: right;">
                                门店编号：
                            </el-col>
                            <el-col :span="8">
                                {{shopDetail.channelId}}
                            </el-col>
                            <el-col :span="4">
                                状态：
                                <span v-if="shopDetail.accountState=='enable'">可用</span>
                                <span v-if="shopDetail.accountState=='disable'">禁止</span>
                                <span v-if="shopDetail.accountState=='del'">已删除</span>
                            </el-col>
                        </el-row>
                        <el-row class="info-row">
                            <el-col :span="5" style="text-align: right;">
                                公司：
                            </el-col>
                            {{shopDetail.companyName}}
                        </el-row>
                        <el-row class="info-row">
                            <el-col :span="5" style="text-align: right;">
                                社会信用代码：
                            </el-col>
                            {{shopDetail.socialCreditCode}}
                        </el-row>
                        <el-row class="info-row">
                            <el-col :span="5" style="text-align: right;">
                                电话：
                            </el-col>
                            {{shopDetail.telephoneNums}}
                        </el-row>
                        <el-row class="info-row">
                            <el-col :span="5" style="text-align: right;">
                                省份：
                            </el-col>
                            {{shopDetail.province}}
                        </el-row>
                        <el-row class="info-row">
                            <el-col :span="5" style="text-align: right;">
                                市区：
                            </el-col>
                            {{shopDetail.city}}
                        </el-row>
                        <el-row class="info-row">
                            <el-col :span="5" style="text-align: right;">
                                县：
                            </el-col>
                            {{shopDetail.county}}
                        </el-row>
                        <el-row class="info-row">
                            <el-col :span="5" style="text-align: right;">
                                详细地址：
                            </el-col>
                            {{shopDetail.address}}
                        </el-row>
                    </el-col>
                    <el-col :span="8">
                       <el-row>
                           <el-col :span="11" class="img-item">
                               <img class="img" :src="basicConfig.basicUrl+shopDetail.qRCodeId" alt="">
                               <el-row style="text-align: center">
                                   html跳转二维码
                               </el-row>
                           </el-col>
                           <el-col :span="11" :offset="2" class="img-item">
                               <img class="img" :src="basicConfig.basicUrl+shopDetail.appQrCodeId" alt="">
                               <el-row style="text-align: center">
                                   app推广二维码
                               </el-row>
                           </el-col>
                       </el-row>
                        <el-row style="margin-top: 10px;">
                            <el-col :span="11"  class="img-item">
                                <img class="img" v-if="shopDetail.companyPic" :src="basicConfig.basicUrl+shopDetail.companyPic" @click="viewPicModal({imgUrl:basicConfig.basicUrl+shopDetail.companyPic})" alt="">
                                <i class="icon cm-default-pic img" v-if="!shopDetail.companyPic"></i>
                                <!--
                                                            <div class="img" :style="{background: 'url('+basicConfig.basicUrl+shopDetail.companyPic+') no-repeat center',backgroundSize: 'cover'}"></div>
                                -->
                                <el-row style="text-align: center">
                                    <el-col :span="12">营业执照</el-col>
                                    <el-col :span="12" class="cm-link-btn" style="text-align: right;position: relative">
                                        设置
                                        <input type="file" id="file-input" multiple @change="selectFile()">
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <el-row class="block">
                    <el-col :span="16">
                        <el-row class="info-row">
                            <el-col :span="8" style="text-align: right;">
                                日销售额 {{curDateStrArr[0]+'年'+curDateStrArr[1]+'月'+curDateStrArr[2]+'日'}}：
                            </el-col>
                            <span class="cm-amount">{{shopDetail.daySale|moneyFormat}}</span>元
                        </el-row>
                        <el-row class="info-row">
                            <el-col :span="8" style="text-align: right;">
                                月销售额 {{curDateStrArr[0]+'年'+curDateStrArr[1]}}月：
                            </el-col>
                            <span class="cm-amount"> {{shopDetail.monthSale|moneyFormat}}</span>元
                        </el-row>
                        <el-row class="info-row">
                            <el-col :span="8" style="text-align: right;">
                                年销售额 {{curDateStrArr[0]}}年：
                            </el-col>
                            <span class="cm-amount">{{shopDetail.yearSale|moneyFormat}}</span>元
                        </el-row>
                    </el-col>
                </el-row>
                <el-row class="block">
                    <el-row class="info-row">
                        <el-col :span="3" style="text-align: right;">商户账户：</el-col>
                        <el-col :span="8">{{shopChannelsUser.name}}&nbsp;{{shopChannelsUser.phoneNums}}</el-col>
                        <el-col :span="9" :offset="1">返点比例：{{shopDetail.shopRebates*100}}% </el-col>
                    </el-row>
                    <el-row class="info-row">
                        <el-col :span="3" style="text-align: right;">代理账户：</el-col>
                        <el-col :span="8">{{marketingChannelsUser.name}}&nbsp;{{marketingChannelsUser.phoneNums}}</el-col>
                        <el-col :span="9" :offset="1">返点比例：{{shopDetail.marketingRebates*100}}%</el-col>
                    </el-row>
                    <el-row class="info-row">
                        <el-col :span="3" style="text-align: right;">账户1 ：</el-col>
                        <el-col :span="8">{{otherUser.name}}&nbsp;{{otherUser.phoneNums}}</el-col>
                        <el-col :span="9" :offset="1">返点比例：{{shopDetail.otherRebates*100}}% </el-col>
                    </el-row>
                </el-row>
            </div>
        </div>
        <el-dialog title="编辑" class="edit-dialog" :visible.sync="dialogFormVisible"  v-if="dialogFormVisible" width="40%">
            <el-row type="flex">
                <el-col :sm="24" :md="22" :lg="20">
                    <el-form :model="form">
                        <el-form-item label="公司名称" :label-width="formLabelWidth">
                            <el-input v-model="form.companyName" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="企业信用码" :label-width="formLabelWidth">
                            <el-input v-model="form.socialCreditCode" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号码" :label-width="formLabelWidth">
                            <el-input v-model="form.telephoneNums" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="门店渠道返点" :label-width="formLabelWidth">
                            <el-input v-model="form.shopRebates*100" disabled auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="中介渠道返点" :label-width="formLabelWidth">
                            <el-input v-model="form.marketingRebates*100" disabled auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="其他渠道返点" :label-width="formLabelWidth">
                            <el-input v-model="form.otherRebates*100" disabled auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="地区" :label-width="formLabelWidth">
                            <v-distpicker class="cm-area-picker" :province="form.province" :city="form.city" :area="form.area" @selected="changeArea"></v-distpicker>
                        </el-form-item>
                        <el-form-item label="详细地址" :label-width="formLabelWidth">
                            <el-input v-model="form.address" auto-complete="off"></el-input>
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

                           ||!form.province||form.province==''
                           ||!form.city||form.city==''
                           ||!form.area||form.area==''
                           ||!form.address||form.address==''"
                           @click="update()">提交</el-button>
            </div>
        </el-dialog>
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
        .img{
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
    #file-input{
        position: absolute;
        opacity: 0;
        width: 100%;
        height: 100%;
        top:0px;
        left: 0px;
    }
</style>
<script>
    import Vue from 'vue'
    let XLSX = require('xlsx');
    export default {
        data() {
            return {
                dialogFormVisible: false,
                areaSelect: { province: '', city: '', area: '' },
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: '',
                    id:null,
                },
                formLabelWidth: '120px',

                shopDetail:{},
                shopChannelsUser:{},
                marketingChannelsUser:{},
                otherUser:{},

                uploadFb:null,
                uploadedCount:0,

                curDateStrArr:Vue.formatDate(new Date(),'yyyy.MM.dd').split('.'),

                fullscreenLoading: false, // 加载中
                imFile: '', // 导入文件el
                outFile: '',  // 导出文件el
                errorDialog: false, // 错误信息弹窗
                errorMsg: '', // 错误信息内容
                excelData: [],
                downLoadFb:null,
            }
        },
        created(){

        },
        computed: {

        },
        methods: {
            getShopDetail:function () {
                Vue.api.getShopDetail({...Vue.sessionInfo(),shopId:this.id}).then((resp)=>{
                    if(resp.respCode=='00'){
                    this.shopDetail=JSON.parse(resp.respMsg);
                    console.log('this.shopDetail:',this.shopDetail);
                    this.form=Object.assign({},this.shopDetail);
                    this.form.area=this.form.county;
                    this.shopChannelsUser=JSON.parse(this.shopDetail.shopChannelsUser);
                    this.marketingChannelsUser=JSON.parse(this.shopDetail.marketingChannelsUser);
                        console.log(' this.shopChannelsUser:', this.shopChannelsUser);
                        console.log(' this.marketingChannelsUser:', this.marketingChannelsUser);
                    this.otherUser=JSON.parse(this.shopDetail.otherUser);
                }
            });
            },
            del:function () {
                this.$confirm('确定删除该账号?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then((data) => {
                    let fb=Vue.operationFeedback({text:'删除中...'});
                    Vue.api.setShopState({timeStamp:Vue.sessionInfo().timeStamp,shopId:this.id,state:'del'}).then((resp)=>{
                        if(resp.respCode=='00'){
                            this.shopDetail.accountState='del';
                            fb.setOptions({type:'complete',text:'删除成功'});
                            setTimeout(()=>{
                                window.history.go(-1);
                            },1500);
                        }else{
                            fb.setOptions({type:'warn',text:'删除失败，'+resp.respMsg});
                        }
                    });
                }).catch((data) => {

                });
            },
            disable:function () {
                this.$confirm('确定禁用该账号?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then((data) => {
                    let fb=Vue.operationFeedback({text:'操作中...'});
                    Vue.api.setShopState({timeStamp:Vue.sessionInfo().timeStamp,shopId:this.id,state:'disable'}).then((resp)=>{
                        if(resp.respCode=='00'){
                            this.shopDetail.accountState='disable';
                            fb.setOptions({type:'complete',text:'操作成功'});
                        }else{
                            fb.setOptions({type:'warn',text:'操作失败，'+resp.respMsg});
                        }
                    });
                }).catch((data) => {

                });
            },
            enable:function () {
                this.$confirm('确定恢复该账号?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then((data) => {
                    let fb=Vue.operationFeedback({text:'操作中...'});
                    Vue.api.setShopState({timeStamp:Vue.sessionInfo().timeStamp,shopId:this.id,state:'enable'}).then((resp)=>{
                        if(resp.respCode=='00'){
                            this.shopDetail.accountState='enable';
                            fb.setOptions({type:'complete',text:'操作成功'});
                        }else{
                            fb.setOptions({type:'warn',text:'操作失败，'+resp.respMsg});
                        }
                    });
                }).catch((data) => {

                });
            },
            update:function () {
                let params={
                    ...Vue.sessionInfo(),
                    shopId:this.id,
                    ...this.form
                }
                console.log('this.form:',this.form);
                let fb=Vue.operationFeedback({text:'保存中...'});
                Vue.api.updateShopInfo(params).then((resp)=>{
                    if(resp.respCode=='00'){
                        this.getShopDetail();
                        this.dialogFormVisible = false;
                        fb.setOptions({type:'complete',text:'保存成功'});
                    }else{
                        fb.setOptions({type:'warn',text:'保存失败，'+resp.respMsg});
                    }
                });
            },
            selectFile:function () {
                let that=this;
                this.files=document.getElementById('file-input').files;
                this.uploadFb=this.operationFeedback({text:'上传中，请耐心等待',mask:true});
                this.uploadedCount=0;
                let index=0;
                let uploadInterval=setInterval(()=>{
                    if(index==this.files.length){
                        clearInterval(uploadInterval);
                        return;
                    }
                    this.upload(this.files[index]);
                    index++;
                },1000);
            },
            upload:function (file) {
                let that=this;
                let sessionInfo=Vue.sessionInfo();
                var formData = new FormData();
                formData.append('timeStamp',sessionInfo.timeStamp);
                formData.append('shopId',this.id);
                formData.append("file", file);
                Vue.api.uploadShopPic(formData).then((resp)=>{
                    if(resp.respCode=='00'){
                        this.getShopDetail();
                        that.uploadFb.setOptions({type:'complete',text:'上传成功'});
                    }else{

                    }
                });
            },
            changeArea:function (data) {
                console.log('data:',data);
                this.form.province=data.province.value;
                this.form.city=data.city.value;
                this.form.area=data.area.value;
                this.form.county=data.area.value;
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
            analyzeData: function (data) {  // 此处可以解析导入数据
                return data
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
            downloadQrcodeInfo:function () {
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
                let shopChannelsUser=JSON.parse(this.shopDetail.shopChannelsUser);
                jsonData.push({
                    1:1,
                    2:this.shopDetail.companyName,//公司名
                    3:this.shopDetail.province,//省份
                    4:this.shopDetail.city,//市区
                    5:this.shopDetail.county,//县
                    6:this.shopDetail.address,//详细地址
                    7:shopChannelsUser.phoneNums,//手机号码
                    8:shopChannelsUser.name,//姓名
                    9:Vue.basicConfig.basicUrl+this.shopDetail.qRCodeId,//HTML推广二维码
                    10:Vue.basicConfig.qrCodeBasicUrl+'?channels='+this.shopDetail.channelId,//HTML推广二维码内容
                    11:Vue.basicConfig.basicUrl+this.shopDetail.appQrCodeId,//app推广二维码
                    12:Vue.basicConfig.appBaickUrl+'?channels='+this.shopDetail.channelId,//app推广二维码内容
                });
                this.downLoadFb=Vue.operationFeedback({text:'导出中...'});
                this.downloadExl(jsonData,'二维码导出表');
            }
        },
        mounted () {
            /**/
            this.id=this.$route.params.id;
            /**/
            this.getShopDetail();
            /**/
            this.outFile = document.getElementById('downlink');
        },
    }
</script>
