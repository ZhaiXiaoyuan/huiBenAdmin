<template>
  <div class="crop-modal">
      <div class="modal-mask"  @click="close()"></div>
      <div class="modal-content">
          <div class="modal-header">
              <span class="cm-btn close-btn" @click="close()"><i class="icon el-icon-circle-close-outline"></i></span>
          </div>
          <div class="modal-body">
              <vue-cropper
                  ref="cropper"
                  :img="options.img"
                  :outputSize="options.size"
                  :outputType="options.outputType"
                  :autoCrop="options.autoCrop"
                  :centerBox="options.centerBox"
                  :fixedNumber="options.fixedNumber"
                  :fixedBox="options.fixedBox"
                  :fixed="options.fixed"
                  :canMove="options.canMove"
              ></vue-cropper>
          </div>
          <div class="modal-footer">
             <!-- <span class="cm-btm handle-btn">upload</span>-->
              <span class="cm-btm handle-btn" @click="save()">保存</span>
          </div>
      </div>
  </div>
</template>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" rel="stylesheet/less" scoped>
   .crop-modal{
       display: flex;
       align-items: center;
       justify-content: center;
       position: fixed;
       top: 0px;
       left: 0px;
       z-index: 5000;
       width: 100%;
       height: 100%;
       .modal-mask{
           position: absolute;
           z-index: 501;
           width: 100%;
           height: 100%;
           background: rgba(0,0,0,0.5);
       }
       .modal-content{
           position: relative;
           z-index: 502;
           width: 500px;
          /* height: 500px;*/
           background: #fff;
           border-radius: 5px;
           overflow: hidden;
           .modal-header{
               padding: 20px;
               .close-btn{
                   float: right;
                   .icon{
                       font-size: 25px;
                       color: #666;
                   }
               }
           }
           .modal-body{
               margin: 10px auto 0px auto;
               position: relative;
               width: 400px;
               height: 400px;
               background: #eee;
               border-radius: 5px;
           }
           .modal-footer{
               margin-top: 10px;
               border-top: 1px solid #e5e5e5;
               text-align: center;
               padding: 10px;
               .handle-btn{
                   display: inline-block;
                   font-size: 16px;
                   color: #5360aa;
                   border-radius: 5px;
                   border: 1px solid #5360aa;
                   padding: 8px 15px;
                   cursor: pointer;
                   &+.handle-btn{
                       margin-left: 20px;
                   }
               }
           }
       }
   }
</style>
<script>
  import Vue from 'vue'
  import { VueCropper }  from 'vue-cropper';

  export default {
    components: {
        VueCropper
    },
    props:{
      options:{
          type:'base64',
          img:null,
          size: 1,
          full: false,
          outputType: 'jpeg',
          canMove: true,
          fixedBox: false,
          original: false,
          canMoveBox: true,
          autoCrop: true,
          centerBox: false,
          fixedNumber:[1,1],
          fixed:true,
          ok:null,
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
        save:function () {
            this.$refs.cropper.getCropData((base64) => {
                this.$refs.cropper.getCropBlob((blob) => {
                    this.options.ok&&this.options.ok({base64:base64,blob:blob});
                    this.close();
                })
            })
        },
        close:function () {
            this.$el.remove();
            this.$destroy();
            this.options.closeCallback&&this.options.closeCallback();
        }
    },
    created: function () {

    },
    mounted: function () {

    }
  };
</script>
