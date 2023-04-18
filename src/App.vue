<template>
  <transition name="fade">
    <router-view></router-view>
  </transition>
</template>

<script>
export default {
  created () {
    // 获取国际化语言列表
    this.$http({
      url: this.$http.adornUrl('/sys/lang'),
      method: 'get',
      params: this.$http.adornParams()
    }).then(({data}) => {
      this.$store.commit('lang/updateLang', data)
      // 设置i18n.locale 组件库会按照上面的配置使用对应的文案文件
      this.$i18n.locale = this.$store.state.lang.language
    })
  },
  mounted () {
    // 检测浏览器路由改变页面不刷新问题,hash模式的工作原理是hashchange事件
    window.addEventListener('hashchange', () => {
      let currentPath = window.location.hash.slice(1)
      if (this.$route.path !== currentPath) {
        this.$router.push(currentPath)
      }
    }, false)
  },
  computed: {
    key () {
      return this.$route.path + Math.random()
    }
  }
}
</script>

<style>
.maxindex {
  z-index: 99999!important;
}
.el-input__inner {
  border-radius: 3px !important;
}
.el-scrollbar__wrap::-webkit-scrollbar{
  display:none !important
}

</style>
