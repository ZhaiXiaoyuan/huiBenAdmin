<template>
    <div class="cm-page-content-min system-setting">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>系统设置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="container-bd">
                <div class="info-row">
                    <span class="label" >系统开放时间</span>
                   <!-- <div class="time-item">
                        <p>{{timeData.startTime|hoursFormat}}</p>
                        <el-button class="edit-btn" type="primary">编辑</el-button>
                    </div>
                    <span class="gap">至</span>
                    <div class="time-item">
                        <p>{{timeData.endtTime|hoursFormat}}</p>
                        <el-button class="edit-btn" type="primary">编辑</el-button>
                    </div>-->
                  <!--  <el-time-picker
                        is-range
                        size="medium"
                        v-model="timeData"
                        value-format="HH:mm"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        @change="selectTime"
                        placeholder="选择时间范围">
                    </el-time-picker>-->

                    <el-time-picker
                        size="medium"
                        value-format="HH:mm"
                        v-model="startTime"
                        @change="selectTime('startTime')"
                        placeholder="开始时间">
                    </el-time-picker>
                    <span class="gap">至</span>
                    <el-time-picker
                        size="medium"
                        value-format="HH:mm"
                        v-model="endTime"
                        @change="selectTime('endTime')"
                        placeholder="结束时间">
                    </el-time-picker>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
    .system-setting{
        .container{
            min-height: 500px;
        }
    }
    .info-row{
        display: flex;
        align-items: center;
        color: #333;
        font-size: 20px;
        .label{
            padding-right: 20px;
        }
        .gap{
            padding: 0px 10px;
        }
        .time-item{
            position: relative;
            top:2px;
        }
        .edit-btn{
            position: absolute;
            left: 0px;
            right: 0px;
            bottom: -40px;
            margin: auto;
        }
    }
    .gap{
        font-size: 16px;
        color: #999;
    }
</style>
<script>
    import Vue from 'vue'
    export default {
        data() {
            return {
                timeData: [],
                startTime:null,
                endTime:null,
            }
        },
        created(){
        },
        computed: {

        },
        methods: {
            hoursFormat:function (text) {
                if(!text){
                    return;
                }
                let textArr=(text+'').split('');
                for(let i=0;i<4-textArr.length;i++){
                    textArr.unshift('0');
                }
                return textArr[0]+textArr[1]+':'+textArr[2]+textArr[3];
            },
            getQRTime:function () {
                Vue.api.getQRTime({...Vue.sessionInfo()}).then((resp)=>{
                    if(resp.respCode=='00'){
                        let data=JSON.parse(resp.respMsg);
                        this.startTime=this.hoursFormat(data.startTime);
                        this.endTime=this.hoursFormat(data.endtTime);
                      /*  this.timeData.push(this.hoursFormat(data.startTime),this.hoursFormat(data.endtTime));*/
                    }
                });
            },
            selectTime:function (type) {
                let fb=Vue.operationFeedback({text:'设置中...'});
                if(type=='startTime'){
                    let startTime=parseInt(this.startTime.replace(':',''));
                    Vue.api.setQRStartTime({...Vue.sessionInfo(),startTime:startTime}).then((resp)=>{
                        if(resp.respCode=='00'){
                            fb.setOptions({type:'complete',text:'设置成功'});
                        }else{
                            fb.setOptions({type:'warn',text:'设置失败，'+resp.respMsg});
                        }
                    });
                }else{
                    let endTime=parseInt(this.endTime.replace(':',''));
                    Vue.api.setQREndTime({...Vue.sessionInfo(),endTime:endTime}).then((resp)=>{
                        if(resp.respCode=='00'){
                            fb.setOptions({type:'complete',text:'设置成功'});
                        }else{
                            fb.setOptions({type:'warn',text:'设置失败，'+resp.respMsg});
                        }
                    });
                }

            }
        },
        mounted () {
           /**/
           this.getQRTime();
        },
    }
</script>
