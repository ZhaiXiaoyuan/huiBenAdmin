<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <svg class="icon" aria-hidden="true">
                                <use :xlink:href="item.icon"></use>
                            </svg>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <el-menu-item  v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">
                            {{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index" :class="{'active':item.index.indexOf(pageName)>-1}">
                        <svg class="icon" aria-hidden="true">
                            <use :xlink:href="item.icon"></use>
                        </svg>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        z-index: 2;
        left: 0;
        top: 70px;
        bottom:0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
        background-color: #fff !important;
    }
    .icon{
        width: 18px;
        height: 18px;
        margin-right: 5px;
        vertical-align: middle;
    }
    .el-menu-item{
        background-color: #fff !important;
        color: rgba(122, 205, 244, 1) !important;
    }
    .el-menu-item.active{
        background-color: rgba(122, 205, 244, 0.9) !important;
        color: #fff !important;
    }
</style>

<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                pageName:null,
                collapse: false,
                itemsConfig:[
                    {
                        code:'01',
                        icon: '#icon-user',
                        index: '/customerAdmin',
                        title: '用户管理',
                    },
                    {
                        code:'02',
                        icon: '#icon-dingdan',
                        index: '/orderAdmin',
                        title: '订单管理',
                    },
                    {
                        code:'03',
                        icon: '#icon-tupian',
                        index: '/bannerAdmin',
                        title: 'banner管理',
                    },
                  /*  {
                        code:'02',
                        icon: '#icon-paiming',
                        index: '2',
                        title: '排名',
                        subs: [
                            {
                                index: '/saleRank',
                                title: '销售排名'
                            },
                            {
                                index: '/benefitRank',
                                title: '收益排名'
                            },
                            {
                                index: '/oddsRank',
                                title: '中奖率排名'
                            }
                        ]
                    },
                    {
                        code:'03',
                        icon: '#icon-caiwu2',
                        index: '3',
                        title: '财务系统',
                        subs: [
                            {
                                index: '/rebatesRecord',
                                title: '返点记录'
                            },
                            {
                                index: '/log',
                                title: '操作日志'
                            }
                        ]
                    },
                    {
                        code:'04',
                        icon: '#icon-permissions',
                        index: '/permission',
                        title: '权限管理',
                    },
                    {
                        code:'05',
                        icon: '#icon-xitongshezhi',
                        index: '/setting',
                        title: '系统设置',
                    },
                    {
                        code:'06',
                        icon: '#icon-weibiaoti4',
                        index: '/statistics',
                        title: '用户信息',
                    },
                    {
                        code:'07',
                        icon: '#icon-tongji',
                        index: '/saleStatistics',
                        title: '门店信息',
                    },
                    {
                        code:'08',
                        icon: '#icon-dingdan',
                        index: '/orderStatistics',
                        title: '订单统计',
                    },
                    {
                        code:'09',
                        icon: '#icon-xiugaimima',
                        index: '/setPassword',
                        title: '修改密码',
                    },
                    {
                        code:'10',
                        icon: '#icon-dingdan',
                        index: '/order',
                        title: '订单统计',
                    },*/
                ],
                items: []
            }
        },
        computed:{
            onRoutes(){
                this.pageName=this.$route.name;
                return this.$route.path.replace('/','');
            }
        },
        created(){
            //
            this.pageName=this.$route.name;
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            });
            //
            this.accountInfo=this.getAccountInfo();
            this.accountAccess=null;
            //临时测试
            if(true||this.accountInfo.type=='superManager'){
                this.accountAccess=['01','02','03','04','05','09','10'];
               /* this.accountAccess='all';*/
            }else if(this.accountInfo.type=='marketManager'){
                this.accountAccess=['01','02','10'];
            }else if(this.accountInfo.type=='accountantManager'){
                this.accountAccess=['03'];
            }else if(this.accountInfo.type=='userManager'){
                this.accountAccess=['06','07','08'];
            } else if(this.accountInfo.type=='shopManager'){
               /* this.accountAccess=['07','08'];*/
            }
            if(this.accountAccess=='all'){
                this.items=this.itemsConfig;
            }else if(this.accountAccess&&this.accountAccess.length>0){
                this.accountAccess.forEach((value,index)=>{
                    for(let i=0;i<this.itemsConfig.length;i++){
                        if(value==this.itemsConfig[i].code){
                            this.items.push(this.itemsConfig[i]);
                        }
                    }
                })
            }
        }
    }
</script>
