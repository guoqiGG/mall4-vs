<template>
  <div class="shop-process-navbar">
    <div class="navbar-content">
      <div class="left-menu">
        <div class="title" v-if="configuration.bsMenuTitleOpen">{{ configuration.bsMenuTitleOpen }}</div>
        <div class="title" v-else>{{ $t('shopProcess.topNavbarTitle') }}</div>
      </div>
      <div class="right-menu">
        <div class="item">
          <el-dropdown @command="switchLang">
              <span class="el-dropdown-link">
                {{langName}}
                <i v-if="langList.length>1" class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu v-if="langList.length>1" slot="dropdown">
                <template v-for="(langItem,inx) in langList">
                  <el-dropdown-item :key="inx" :command="langItem.language">{{langItem.name}}</el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </el-dropdown>
        </div>
        <div class="item">
          <el-dropdown class="avatar-container" trigger="hover">
            <span class="el-dropdown-link">{{ shopName ? shopName : shopUserName }}</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="logoutHandle()">{{ $t("homes.exit") }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { clearLoginInfo } from '@/utils'
import { formatConfigInfo } from '@/utils/websiteConfig'
export default {
  data () {
    return {
      shopName: '',
      shopUserName: '',
      // 网站配置
      configuration: ''
    }
  },

  created () {
    this.getUserInfo()
    this.updateWebConfigData()
  },
  computed: {
    langName: {
      get () { return this.$store.state.lang.langName }
    },
    langList: {
      get () { return this.$store.state.lang.langList }
    }
  },

  methods: {
     // 更新网站配置信息
    updateWebConfigData () {
      this.$http({
        url: this.$http.adornUrl('/sys/webConfig/getActivity'),
        method: 'get'
      }).then(({data}) => {
        data = formatConfigInfo(data)
        this.$store.commit('webConfig/addData', data)
        this.configuration = data
      })
    },
    // 获取当前管理员信息
    getUserInfo () {
      this.$http({
        url: this.$http.adornUrl('/shop/shopDetail/info'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.loading = false
        this.shopName = data.shopName
        this.mobile = data.mobile
        this.shopUserName = data.userName
      })
    },

    switchLang (lang) {
      const langInfo = this.langList.find(f => f.language === lang)
      if (langInfo) {
        this.$store.commit('lang/switchLang', langInfo)
      }
      window.location.reload()
    },

    // 退出
    logoutHandle () {
      this.$confirm(this.$i18n.t('homes.isExit'), this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('homes.yes'),
        cancelButtonText: this.$i18n.t('homes.no'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/logOut'),
          method: 'post',
          data: this.$http.adornData()
        }).then(({ data }) => {
          clearLoginInfo()
          this.$router.push({ name: 'login' })
        })
      }).catch(() => { })
    }
  }
}
</script>

<style lang="scss" scoped>
.shop-process-navbar {
  display: block;
  width: 100%;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0, .08);
  font-size: 15px;
  .navbar-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .right-menu {
      padding-right: 10px;
      .item {
        display: inline-block;
        margin-left: 20px;
        .avatar-container.el-dropdown {
          padding: 0 20px;
        }
      }
    }
    .el-dropdown-link {
      cursor: pointer;
    }
  }
}
</style>
