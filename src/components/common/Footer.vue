<template>
    <div class="footer">
        <p>Copyright  2018</p>
    </div>
</template>
<script>
    import Vue from 'vue'
    export default {
        data() {
            return {

            }
        },
        computed:{

        },
        methods:{

        },
        created(){

        }
    }
</script>
<style scoped>
    *{
        box-sizing: border-box;
    }
    .footer{
        position: fixed;
        z-index: 1;
      /*  left: 250px;*/
        left: 0px;
        padding-left: 250px;
        bottom: 0px;
        width: 100%;
        height: 44px;
        line-height: 44px;
        background: #F0F0F0;
        color: #333;
        font-size: 14px;
    }
    .footer p{
        text-align: center;
    }
</style>
