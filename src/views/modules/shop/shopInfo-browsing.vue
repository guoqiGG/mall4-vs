<template>
  <div class="business-info-wrap">
    <div class="business-info-mod">
      <el-form @submit.native.prevent ref="shopBasicInfo" label-width="140px" :model="shopBasicInfo" size="small">
        <div class="ci-wrapper">
          <div class="left-wrap">
            <el-form-item :label="this.$i18n.t('shopProcess.logo') + '：'" required>
              <div class="business-license-box">
                <div class="logo-image-box">
                  <el-image
                    v-if="shopBasicInfo.shopLogo"
                    class="logo-image"
                    :src="shopBasicInfo.shopLogo.indexOf('http') === 0 ? shopBasicInfo.shopLogo : resourcesUrl + shopBasicInfo.shopLogo"
                  />
                </div>
              </div>
            </el-form-item>
            <!-- <el-form-item :label="this.$i18n.t('shopProcess.storeAccount') + '：'">
              <span v-if="shopBasicInfo.mobile ">{{ shopBasicInfo.mobile }}</span>
              <span v-else class="noyet-wrap">{{ $t('shopProcess.noYet') }}</span>
            </el-form-item> -->
            <el-form-item :label="this.$i18n.t('shopProcess.merchantName') + '：'" required>
              {{ shopBasicInfo.merchantName }}
            </el-form-item>
            <el-form-item :label="this.$i18n.t('shopProcess.shopName') + '：'" required>
              {{ shopBasicInfo.shopName }}
            </el-form-item>
            <el-form-item :label="this.$i18n.t('shopProcess.tel') + '：'" required>
              {{ shopBasicInfo.tel }}
            </el-form-item>
            <el-form-item :label="this.$i18n.t('shopProcess.email') + '：'" required>
              {{ shopBasicInfo.email }}
            </el-form-item>
            <el-form-item :label="this.$i18n.t('shopProcess.addr') + '：'" required>
              {{ shopBasicInfo.province + shopBasicInfo.city + shopBasicInfo.area }}
            </el-form-item>
            <el-form-item :label="this.$i18n.t('shopProcess.detailAddr') + '：'" required>
              {{ shopBasicInfo.shopAddress }}
            </el-form-item>
            <el-form-item :label="this.$i18n.t('shopProcess.intro') + '：'">
              <span v-if="shopBasicInfo.intro"> {{ shopBasicInfo.intro }} </span>
              <span v-else class="noyet-wrap">{{ $t('shopProcess.noYet') }}</span>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>

    <div class="footer">
      <div class="foot-box">
        <div class="btn default-btn primary-btn" @click="modifyBasicInfor">{{ $t('shopProcess.modify') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL, // 图片前缀
      shopBasicInfo: {
        mobile: '',
        intro: '',
        shopAddress: '',
        area: '',
        city: '',
        province: '',
        email: '',
        tel: '',
        shopName: '',
        merchantName: '',
        shopLogo: ''
      }
    }
  },
  mounted () {
    this.queryShopBasicInfo()
  },
  methods: {
      // 修改基本
    modifyBasicInfor () {
      this.$emit('closeBrowse')
    },
      /**
       * 查询基本信息
       */
    queryShopBasicInfo () {
      this.$http({
        url: this.$http.adornUrl(`/shop/shopDetail/info`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(res => {
        this.shopBasicInfo = res.data
      })
    }
  }
}
</script>

<style scoped>
  .business-info-wrap {
    color: #606266;
    font-size: 14px;
    margin-top: 30px;
  }
  .logo-image-box {
    width: 98px;
    height: 98px;
  }
  .logo-image {
    width: 100%;
    height: 100%;
  }
  .foot-box {
    margin-left: 140px;
  }
  .noyet-wrap {
    color: #999;
  }
  .ci-wrapper .left-wrap {
    max-width: 50%;
  }
</style>