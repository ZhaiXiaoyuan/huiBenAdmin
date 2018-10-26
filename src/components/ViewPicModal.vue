<template>
  <div class="view-pic-modal">
    <div class="mask" @click="close()"></div>
    <div class="modal-content">
      <div class="modal-body">
        <div class="view-win">
            <img :src="options.imgUrl" alt="">
            <el-button primary class="close-btn" icon="el-icon-circle-close" @click="close()">关闭</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" rel="stylesheet/less" scoped>
  .view-pic-modal{
    position: fixed;
    z-index: 1000;
    width: 100%;
    height: 100%;
    top:0px;
    left: 0px;
  }
  .mask{
    position: fixed;
    z-index: 1000;
    width: 100%;
    height: 100%;
    top:0px;
    left: 0px;
    background: rgba(0,0,0,0.5);
  }
  .modal-content{
      position: fixed;
      z-index: 1001;
    width: 100%;
    height: 100%;
  }
  .modal-body{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    .view-win{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      height: 80%;
      img{
       height: 100%;
      }
        .close-btn{
            position: absolute;
            left: 50%;
            bottom: 0%;
            -webkit-transform: translate3d(-50%,-100%,0);
            transform: translate3d(-50%,-100%,0);
        }
    }
  }
</style>
<script>
  import Vue from 'vue'
  export default {
    components: {

    },
    props:{
      options:{
          imgUrl:null
      }
    },
    data: function () {
      return {

      }
    },
    computed: {},
    watch: {

    },
    methods: {
      close:function () {
        this.$el.remove();
        this.$destroy();
      }
    },
    created: function () {

    },
    mounted: function () {

    }
  };
</script>
