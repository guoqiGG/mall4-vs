<template>
<div>
  <el-card class="main-head" v-if="$route.meta.isTab && $route.name !== 'shop-feature/create/edit/index' && $route.name !== 'shop-decorate/create/edit/index'">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-for="(item,index) in selectMenu" :key="index" class="breadcrumb-item">
        <span>{{item}}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </el-card>
  <main
    class="site-content"
    :class="{ 'site-content--tabs': $route.meta.isTab, 'padding-none' : ($route.name === 'shop-feature/create/edit/index' || $route.name === 'shop-decorate/create/edit/index') }"
  >
    <!-- 主入口标签页 (发布商品) -->
    <div v-if="$route.name === 'prod-post-product/postProduct'" :style="siteContentViewHeight">
      <keep-alive>
        <router-view />
      </keep-alive>
    </div>
    <!-- 新增/编辑装修页 -->
    <div v-else-if="($route.name === 'shop-feature/create/edit/index' || $route.name === 'shop-decorate/create/edit/index')">
      <router-view />
    </div>
    <el-card :style="{
      'border-radius': '0 !important',
      'min-height': $route.name === 'shop-decorate/create/select-decorate/index' ? 'auto' : '100vh',
      'box-shadow':'none'}" 
      :body-style="siteContentViewHeight" v-else-if="homeHidden">
      <keep-alive :include="includePageList">
        <router-view />
      </keep-alive>
    </el-card>
    <div v-else>
      <router-view />
    </div>
  </main>
</div>
</template>

<script>
import { isURL } from '@/utils/validate'
export default {
  data () {
    return {
    }
  },
  computed: {
    siteContentViewHeight () {
      var height = this.documentClientHeight - 50 - 30 - 2
      if (this.$route.meta.isTab) {
        height -= 40
        return isURL(this.$route.meta.iframeUrl) ? { height: height + 'px' } : { minHeight: height + 'px' }
      }
      return { minHeight: height + 'px' }
    },
    selectMenu: {
      get () { return this.$store.state.common.selectMenu }
    },
    includePageList: {
      get () { return this.$store.state.router.includePageList }
    },
    homeHidden: {
      get () { return this.$route.name !== 'home' }
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>
<style scoped>
.main-head {
  background: #FFFFFF;
  width: 100%;
  height: 40px;
  position: fixed;
  top: 50px;
  z-index: 10;
  display: flex;
  align-items: center;
  border-radius: 0;
  box-shadow: none;
  border-top: none;
}

.padding-none {
  padding: 0 !important;
}

.breadcrumb-item:last-child span{
  color: #155BD4 !important;
}
.main-head .title {
  color: #999999;
}
.main-head .router {
  color: #155BD4;
}
</style>
<style>
.el-input__inner {
  border-radius: 3px;
  padding: 0 10px !important;
}
.el-date-editor .el-input__inner {
  padding-left: 30px !important;
}
.el-date-editor .el-range-separator,
.el-input__suffix,
.el-date-editor .el-input__icon,
.el-date-editor .el-range__icon{
  display: flex;
  align-items: center;
}
.el-input-group--append .el-input__inner {
  border-radius: 3px 0 0 3px !important;
}
.el-input-group--prepend .el-input__inner {
  border-radius: 0 3px 3px 0 !important;
}
.el-input-group--prepend.el-input-group--append .el-input__inner {
  border-radius: 0 0 0 0 !important;
}
.el-form--inline .el-form-item {
  margin-right: 20px;
}
</style>
