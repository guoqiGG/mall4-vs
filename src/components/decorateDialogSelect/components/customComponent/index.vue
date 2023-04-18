<template>
  <div class="custom-page-container">
    <div class="config-items">
      <div class="title">{{$t('pcdecorate.commonModal.customLink')}}</div>
      <el-input v-model.trim="link.url" :placeholder="$t('pcdecorate.commonModal.customLinkTips')" style="width: 50%" ></el-input>
      <img src="@/assets/img/pc-micro-page/selected_link.png" alt="">
    </div>
    <div class="config-items" v-if="deviceType === 'pc'">
      <div class="title">{{$t('pcdecorate.commonModal.customLinkOpen')}}</div>
      <el-checkbox v-model="link.checked"></el-checkbox>
    </div>
    <div class="config-items config-items-tips" >
      <div class="title">{{ $t('pcdecorate.commonModal.customLinkTips1') }}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    activeName: { // 激活tab名
      type: String,
      default: () => ''
    },
    customLinkArr: { // 自定义链接回显数据
      type: Object,
      default: () => {}
    },
    deviceType: {
      type: String,
      default: () => 'pc'
    }
  },
  data () {
    return {
      link: {
        url: '',
        checked: true
      }
    }
  },
  methods: {
    // 回显
    setDatas () {
      if (this.customLinkArr && this.customLinkArr.type != '' && this.customLinkArr.type === '6') {
        this.link = this.customLinkArr.link
        this.$emit('handleGoodsSelect', { type: 'customLink', value: this.link })
      }
    }
  },
  watch: {
    link (val) {
      this.$emit('handleGoodsSelect', { type: 'customLink', value: val })
    },
    activeName (val) {
      if (val === '6') {
        this.link = {
          url: '',
          checked: true
        }
        this.setDatas()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.custom-page-container {
  min-height: 450px;
  max-height: 450px;
  height: 450px;
  overflow-y: auto;
  padding: 20px;
  .config-items {
    display: flex;
    align-items: center;
    position: relative;
    margin-bottom: 20px;
    .title {
      margin-right: 20px;
    }
    img {
      position: absolute;
      top: 6px;
      width: 20px;
      height: 20px;
      left: 57.5%;
    }
  }
  .config-items-tips {
    color: #5e5e5e;
  }
}
</style>
<style lang="scss">
.custom-page-container {
  .el-input__inner {
    height: 32px;
  }
}
</style>