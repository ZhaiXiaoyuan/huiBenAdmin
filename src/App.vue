<template>
    <div id="app" v-cloak>
        <router-view></router-view>
    </div>
</template>
<style lang="less" rel="stylesheet/less">
    @import "../static/css/main.css";
    @import "../static/css/color-dark.css";     /*深色主题*/
    /*@import "../static/css/theme-green/color-green.css";   浅绿色主题*/
    @import "less/main";
    [v-cloak] { display: none }
</style>
