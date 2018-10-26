<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>账户系统</el-breadcrumb-item>
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            </el-breadcrumb>
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
            <el-dialog title="新建" class="edit-dialog" :visible.sync="dialogFormVisible"  v-if="dialogFormVisible" width="40%">
                <el-row type="flex">
                    <el-col :sm="24" :md="22" :lg="20">
                        <el-form :model="form">
                            <el-form-item label="手机号码" :label-width="formLabelWidth">
                                <el-input v-model="form.phoneNums" maxLength="50" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="姓名" :label-width="formLabelWidth">
                                <el-input v-model="form.name" maxLength="50" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="身份证" :label-width="formLabelWidth">
                                <el-input v-model="form.idCard" maxLength="50" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="邮件" :label-width="formLabelWidth">
                                <el-input v-model="form.email" maxLength="50" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="银行名称" :label-width="formLabelWidth">
                                <el-input v-model="form.bankName" maxLength="50" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="分行" :label-width="formLabelWidth">
                                <el-input v-model="form.subbranch" maxLength="50" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="银行账号" :label-width="formLabelWidth">
                                <el-input v-model="form.bankAccount" maxLength="50" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="地区" :label-width="formLabelWidth">
                                <v-distpicker class="cm-area-picker"  :callback="addUserChangeArea"></v-distpicker>
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
                               :disabled="!form.phoneNums||form.phoneNums==''
                           ||!form.name||form.name==''
                           ||!form.idCard||form.idCard==''
                           ||!form.email||form.email==''
                           ||!form.bankName||form.bankName==''
                           ||!form.subbranch||form.subbranch==''
                           ||!form.bankAccount||form.bankAccount==''
                           ||!form.province||form.province==''
                           ||!form.city||form.city==''
                           ||!form.county||form.county==''
                           ||!form.address||form.address==''"
                               @click="add()">提交</el-button>
                </div>
            </el-dialog>
        </div>

        <el-dialog
            title="提示"
            :visible.sync="failDialog"
            width="60%">
            <div style="height: 350px;overflow-y: auto;">
                <p style="font-size: 16px;color: #333;padding: 10px 0px;"><i class="icon el-icon-warning" style="color:#F56C6C;font-size: 22px;margin-right: 8px;"></i>以下账号未导入成功，请仔细核查您的excel文件</p>
                <el-table :data="failList" stripe style="width: 100%;border-top: 1px solid #e5e5e5">
                    <el-table-column
                        prop="user.phoneNums"
                        label="手机号"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="user.name"
                        label="姓名"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="user.idCard"
                        label="身份证">
                    </el-table-column>
                    <el-table-column label="状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.state=='fail'">导入失败</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="mgs" label="原因"></el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="failDialog = false">取 消</el-button>
                <el-button type="primary" @click="failDialog = false">确 定</el-button>
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
                    /*for(let i=0;i<$t.wb.SheetNames.length;i++){
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
                setTimeout(function () {  // 延时释放
                    URL.revokeObjectURL(tmpDown) // 用URL.revokeObjectURL()来释放这个object URL
                }, 100)
            },
            analyzeData: function (data) {  // 此处可以解析导入数据
                return data
            },
            dealFile: function (data) {   // 处理导入的数据
              /*  console.log(data)*/
                this.imFile.value = ''
                this.fullscreenLoading = false
                if (data.length <= 0) {
                    this.errorDialog = true
                    this.errorMsg = '请导入正确信息'
                } else {
                    this.excelData = [];
                    data.forEach((item,key)=>{
                            if(parseInt(item['用户账户登记'])>=1&&item.__EMPTY){
                                this.excelData.push(
                                    {
                                        "bankAccount":item.__EMPTY_2,
                                        "idCard":item.__EMPTY_5,
                                        "bankName":item.__EMPTY,
                                        "phoneNums":item.__EMPTY_3,
                                        "name":item.__EMPTY_4,
                                        "subbranch":item.__EMPTY_1,
                                        "email":item.__EMPTY_6,
                                        "province":'**',
                                        "city":'**',
                                        "county":'**',
                                        "address":'**',
                                    }
                                )
                            }
                    })
                    let fb=Vue.operationFeedback({text:'导入中...'});
                    Vue.api.addUserBatch({...Vue.sessionInfo(),userData:JSON.stringify(this.excelData)}).then((resp)=>{
                        if(resp.respCode=='00'){
                            let data=JSON.parse(resp.respMsg);
                            let failList=JSON.parse(data.failJsonArray);
                            this.failList=failList;
                            this.failList.forEach((item,i)=>{
                                item.user=JSON.parse(item.user);
                            })
                            console.log('this.failList:',this.failList);
                            this.failDialog=true;
                            if(failList.length>0){
                                if(data.length==failList.length){
                                    fb.setOptions({type:'warn',text:'导入失败'});
                                }else{
                                    fb.setOptions({type:'warn',text:'部分账号导入失败'});
                                }
                            }else{
                                fb.setOptions({type:'complete',text:'导入成功'});
                            }
                            this.getList();
                        }else{
                            fb.setOptions({type:'warn',text:'导入失败，'+resp.respMsg});
                        }
                    });

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

            percentFormatter(row, column) {
                return row.revenue+'%';
            },
            getList:function (pageIndex) {
                this.pager.pageIndex=pageIndex?pageIndex:1;
                let params={
                    ...Vue.sessionInfo(),
                    pageIndex:this.pager.pageIndex,
                    pageSize:this.pager.pageSize,
                    searchContent:this.keyword,
                }
                Vue.api.getUserList(params).then((resp)=>{
                    if(resp.respCode=='00'){
                        let data=JSON.parse(resp.respMsg);
                        this.entryList=JSON.parse(data.userList);
                        this.pager.total=data.userCount;
                    }
                });
            },
            add:function () {
                let params={
                    ...Vue.sessionInfo(),
                    ...this.form
                }
                let fb=Vue.operationFeedback({text:'保存中...'});
                Vue.api.addUser(params).then((resp)=>{
                    if(resp.respCode=='00'){
                        this.form={};
                        this.getList();
                        this.dialogFormVisible = false;
                        fb.setOptions({type:'complete',text:'新建成功'});
                    }else{
                        fb.setOptions({type:'warn',text:'新建失败，'+resp.respMsg});
                    }
                });
            },
            addUserChangeArea:function (data) {
                if(data.type=='province'){
                    this.form.province=data.value;
                }else if(data.type=='city'){
                    this.form.city=data.value;
                }else if(data.type=='area'){
                    this.form.county=data.value;
                }
            },
        },
        mounted () {
            this.imFile = document.getElementById('imFile');
            this.outFile = document.getElementById('downlink');

            /**/
            this.getList();

        },
    }
</script>
