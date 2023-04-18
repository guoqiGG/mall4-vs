<template>
  <!-- 会员编辑弹窗 -->
  <div>
    <el-dialog
      :title="
        !dataForm.userId
          ? this.$i18n.t('user.add')
          : this.$i18n.t('user.details')
      "
      :close-on-click-modal="false"
      :visible.sync="visible"
      @closed="handleDialogClose"
      class="user-update-dialog"
      width="70%"
    >
    <!-- 用户信息 -->
    <div class="user-info-item">
      <el-divider class="info-title" content-position="left">
        <h3>{{ $t('user.userInfo') }}</h3>
      </el-divider>
      <div class="info-content">
        <div class="base-info"></div>
        <div class="user-status"></div>
      </div>
    </div>
      <el-form
        :model="dataForm"
        :rules="dataRule"
        ref="dataForm"
        @keyup.enter.native="dataFormSubmit()"
        :label-width="
          this.$i18n.t('language') === 'English' ? '130px' : '80px'"
      >
        <el-container style="margin-top:20px">
          <el-aside width="210px">
            <el-form-item :label="$t('publics.profilePicture')" prop="pic">
              <img
                src="~@/assets/img/userImg.jpg"
                v-if="!dataForm.pic"
                width="130"
                height="130"
              />
              <img
                v-else
                :src="dataForm.pic"
                class="image"
                width="130"
                height="130"
              />
            </el-form-item>
          </el-aside>
          <el-container>
            <el-main>
              <el-row>
                <el-col :span="7" justify="start">
                  <el-form-item
                    :label="$t('users.name') + ':'"
                    prop="nickName"
                    size="mini"
                  >
                    <span v-if="nameVisible">{{ dataForm.nickName }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    :label="$t('publics.status') + ':'"
                    size="mini"
                    prop="status"
                  >
                    <span v-if="dataForm.status == 0">{{
                      $t("publics.disable")
                    }}</span>
                    <span v-if="dataForm.status == 1">{{
                      $t("publics.normal")
                    }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="9" v-if="type===1">
                  <el-form-item
                    :label="$t('user.registrationTime') + ':'"
                    prop="userRegtime"
                    size="mini"
                  >
                    <span>{{ dataForm.registTime }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-main>
            <el-footer>
              <el-row :gutter="10" type="flex">
                <el-col v-if="isAuth('admin:coupon:send')" :span="$t('language') == '简体中文' ? 4 : 5">
                  <div @click="updateCoupon()" class="default-btn primary-btn">
                    {{ $t("user.sendCoupons") }}
                  </div>
                </el-col>
                
              </el-row>
            </el-footer>
          </el-container>
        </el-container>
        <el-form-item v-if="type===1" :label="$t('user.memberTags')" prop="memberTags">
          <div v-if="memberTags&&memberTags.length > 0">
            <el-tag
              :key="tag.tagId"
              v-for="tag in memberTags"
              :closable="tag.tagType === 0 && isAuth('user:userList:addLabel')"
              :disable-transitions="false"
              @close="handleClose(tag)"
              >{{ tag.tagName }}</el-tag
            >
          </div>
          <span v-else>{{$t('brand.notYet')}}</span>
        </el-form-item>
        <!-- 账户资产 -->
        <div v-if="type===1">
          <el-divider content-position="left" >
            <h3>{{ $t("user.accountAssets") }}</h3>
          </el-divider>
          <el-container>
            <el-main>
              <div>
                <h4>
                  {{ $t("user.coupons") }}
                  <el-popover
                    placement="top"
                    width="200"
                    trigger="hover"
                    :content="$t('user.couponTip3')"
                  >
                    <i class="el-icon-question"   slot="reference"></i>
                  </el-popover>
                </h4>
                <br />
                <div>
                  <span
                    >{{ $t("user.notUsed") }}：{{
                      dataForm.couponUserParam.couponUsableNums || 0
                    }}&nbsp;&nbsp;{{ $t("marketing.piece") }} </span
                  >
                  <span style="margin-left: 60px"
                    >{{ $t("user.used") }}：{{
                      dataForm.couponUserParam.couponUsedNums || 0
                    }}&nbsp;&nbsp;{{ $t("marketing.piece") }} </span
                  >
                  <br />
                  <span
                    >{{ $t("user.invalid") }}：{{
                      dataForm.couponUserParam.couponExpiredNums || 0
                    }}&nbsp;&nbsp;{{ $t("marketing.piece") }} </span
                  >
                </div>
                <br />
              </div>
            </el-main>
          </el-container>
        </div>
        <el-divider content-position="left" v-if="type===1">
          <h3>{{ $t("user.otherInfo") }}</h3>
        </el-divider>
      </el-form>
      <div>
        <el-tabs>
          <el-tab-pane :label="$t('user.tradeDetails')">
            <trade-detail ref="tradeDetail" />
          </el-tab-pane>
          <el-tab-pane :label="$t('user.couponDetails')" v-if="type===1">
            <coupon-detail ref="couponDetail" />
          </el-tab-pane>
        </el-tabs>
      </div>

      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="visible = false">{{
          $t("remindPop.cancel")
        }}</el-button> -->
        <div class="default-btn primary-btn" @click="dataFormSubmit()">{{ $t("user.confirm") }}</div>
      </span>
    </el-dialog>
    <!-- 送优惠券弹窗 -->
    <update-coupon
      v-if="updateCouponVisible"
      ref="updateCoupon"
      :getWay="1"
      @refreshDataList="refreshChange"
    ></update-coupon>
    <!-- 打标签弹窗 -->
    <update-tags
      v-if="updateTagsVisible"
      :tagCategory="type"
      :type="type"
      ref="updateTags"
      @refreshDataList="refreshChange"
    ></update-tags>
    <!-- 修改用户基本信息 -->
    <!-- <update-user-info
      v-if="updateUserInfoVisible"
      ref="updateUserInfo"
      @refreshUserInfo="refreshInfo"
    ></update-user-info> -->
  </div>
</template>

<script>
import UpdateCoupon from './update-customer-coupon.vue'
import UpdateTags from './update-customer-tags'
import TradeDetail from './trade-detail.vue'
import CouponDetail from './coupon-detail.vue'
import UpdateUserInfo from './update-customer-info.vue'
export default {
  components: {
    UpdateCoupon,
    UpdateTags,
    TradeDetail,
    CouponDetail,
    UpdateUserInfo

  },
  data () {
    return {
      visible: false,
      type: 0, // 判断是会员信息还是客户信息 0:客户  1：会员
      isSubmit: false,
      nameVisible: true,
      statusVisible: true,
      updateCouponVisible: false,
      updateUserInfoVisible: false,
      updateTagsVisible: false,
      dataForm: {
        userId: 0,
        nickName: '',
        pic: '',
        status: 1,
        couponUserParam: {
          couponUsableNums: 0,
          couponUsedNums: 0,
          couponExpiredNums: 0
        }
      },
      couponUserParam: {
        couponUsableNums: 0,
        couponUsedNums: 0,
        couponExpiredNums: 0
      },
      // 分销信息
      distributionUser: {
        parentName: null,
        bindTime: null,
        state: null
      },
      customerTags: [],
      memberTags: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      dataRule: {
      }
    }
  },
  methods: {
    init (id, type) {
      this.dataForm.userId = id || 0
      this.type = type || 0
      // console.log('aa', id, this.dataForm)
      this.visible = true
      this.isSubmit = false
      this.clearVueData()
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
      })
      if (this.dataForm.userId) {
        if (this.isSubmit) {
          return false
        }
        this.isSubmit = true
        this.$http({
          url: this.$http.adornUrl(`/user/info/${this.dataForm.userId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          this.dataForm = data
          this.couponUserParam = this.dataForm.couponUserParam
          this.customerTags = this.dataForm.customerTags
          this.memberTags = this.dataForm.memberTags
          this.initTradeDetail(this.dataForm.userId)
          this.initCouponDetail(this.dataForm.userId)
        }).catch((e) => {
          this.isSubmit = false
        })
      }
    },
    // 修改后刷新
    refreshChange () {
      this.init(this.dataForm.userId, this.type)
    },
    // 移除标签
    handleClose (tag) {
      this.$http({
        url: this.$http.adornUrl('/user/userTag/deleteUserTag'),
        method: 'delete',
        data: this.$http.adornData({
          userId: this.dataForm.userId,
          userTagId: tag.tagId
        })
      }).then(({ data }) => {
        this.refreshChange()
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.visible = false
    },
    // 打标签
    updateTags (id) {
      var ids = id ? [id] : [this.dataForm.userId]
      this.updateTagsVisible = true
      this.$nextTick(() => {
        this.$refs.updateTags.init(ids)
      })
    },
    // 送优惠券
    updateCoupon (id) {
      var ids = id ? [id] : [this.dataForm.userId]
      this.updateCouponVisible = true
      this.$nextTick(() => {
        this.$refs.updateCoupon.init(ids)
      })
    },
    // 修改用户信息
    /* updateUserInfo () {
      this.updateUserInfoVisible = true
      this.$nextTick(() => {
        this.$refs.updateUserInfo.init(this.dataForm)
      })
    }, */
    // 修改昵称
    updateName () {
      this.nameVisible = false
    },
    // 修改状态
    updateStatus () {
      this.statusVisible = false
    },
    // 清空数据
    clearVueData () {
      // this.$refs['couponUserParam'].resetFields()
      Object.assign(this.couponUserParam, this.$options.data().couponUserParam)
    },
    // 调用交易信息组件方法
    initTradeDetail (id) {
      this.$refs.tradeDetail.init(id)
    },
    // 优惠券明细
    initCouponDetail (id) {
      this.$refs.couponDetail.init(id)
    },

    // 修改名称或者状态完成后刷新详情
    refreshInfo () {
      this.init(this.dataForm.userId, this.type)
      this.$emit('refreshDataList', this.page)
    },
    /**
     * 关闭回调
     */
    handleDialogClose () {
      this.distributionUser = {
        parentName: null,
        bindTime: null,
        state: null
      }
      this.customerTags = []
      this.memberTags = []
    }
  }
}
</script>
<style  lang="scss">
.user-update-dialog {
  .el-tabs__content {
    overflow: auto;
  }
  .user-edit-table {
    margin-bottom: 20px;
  }
}
</style>
