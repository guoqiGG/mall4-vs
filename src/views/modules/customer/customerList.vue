<template>
  <!-- 客户列表 -->
  <div class="mod-user">
    <div class="search-bar">
      <el-form :inline="true" class="search-form" ref="searchForm" :model="searchForm" size="small">
        <div class="input-row">
          <el-form-item prop="nickName" :label="$t('users.name') + ':'">
            <el-input v-model="searchForm.nickName" type="text" clearable  :placeholder="$t('users.name')"></el-input>
          </el-form-item>
          <el-form-item prop="userMobile" :label="$t('publics.mobilePhone') + ':'">
            <el-input v-model="searchForm.userMobile" type="text" clearable  :placeholder="$t('publics.mobilePhone')"></el-input>
          </el-form-item>
         
          
          <el-form-item>
            <div class="default-btn primary-btn" @click="searchChange(true)">{{ $t('crud.searchBtn') }}</div>
            <div class="default-btn" @click="resetForm('searchForm')">{{ $t('shop.resetMap') }}</div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-container">
      <div class="operation-bar">
        <div
          v-if="isAuth('admin:coupon:send')"
          class="default-btn"
          @click="updateCoupon()"
          :class="{'disabled-btn': dataListSelections.length <= 0}"
        >{{$t('user.sendCoupons')}}</div>
        <div
          v-if="isAuth('user:clientList:addLabel')"
          class="default-btn"
          @click="updateTags()"
          :class="{'disabled-btn': dataListSelections.length <= 0}"
        >{{$t('user.tagging')}}</div>
        <div
          v-if="isAuth('customer:customerList:importCustomer')"
          class="primary-btn default-btn"
          @click="importUser()"
          :disabled="importDisabled"
        >{{$t('user.clientImport')}}</div>
        <div
          v-if="isAuth('customer:customerList:exportCustomer')"
          class="primary-btn default-btn"
          @click="exportUser()"
          :disabled="exportDisabled"
        >{{$t('user.clientExport')}}</div>
      </div>
      <div class="table-con">
          <div v-if="dataList.length === 0" class="empty-text">{{$t('user.noData')}}</div>
          <el-table
            :data="dataList"
            header-cell-class-name="table-header"
            row-class-name="table-row-low"
            style="width: 100%"
            @selection-change="selectionChange"
          >
            <el-table-column
              type="selection"
              align="center"
              width="60">
            </el-table-column>
            <el-table-column
              :label="$t('users.name')"
              prop="nickName"
              align="center"
            />
            <el-table-column
              prop="pic"
              :label="$t('publics.profilePicture')"
            >
              <template slot-scope="scope">
                <div class="table-cell-image">
                  <img src="~@/assets/img/userImg.jpg" v-if="!scope.row.pic" width="130px" />
                  <img :src="scope.row.pic" v-else />
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="userMobile"
              align="center"
              :label="$t('publics.mobilePhone')"
            />
            <el-table-column
              align="center"
              prop="totalOrderTimes"
              width="120"
              :label="$t('user.totalOrderTimes')"
              sortable
            />
            <el-table-column
              align="center"
              prop="consTimes"
              width="120"
              :label="$t('user.consumptionTimes')"
              sortable
            />
            <el-table-column
              width="120"
              prop="consAmount"
              :label="$t('user.consumptionAmount')"
              sortable
            >
              <template slot-scope="scope">
                <div>{{scope.row.consAmount || '-'}}</div>
              </template>
            </el-table-column>
            <el-table-column
              width="120"
              prop="actualAmount"
              :label="$t('user.actuallypaid')"
              sortable
            >
              <template slot-scope="scope">
                <div>{{scope.row.actualAmount || '-'}}</div>
              </template>
            </el-table-column>
            <el-table-column
              width="120"
              prop="averDiscount"
              :label="$t('user.averageDiscount')"
              sortable
            />
            <el-table-column
              align="center"
              width="120"
              prop="afterSaleTimes"
              :label="$t('user.refundTimes')"
              sortable
            />
            <el-table-column
              width="130"
              prop="afterSaleAmount"
              :label="$t('home.refundAmount')"
              sortable
            />
            <el-table-column
              fixed="right"
              align="center"
              :label="$t('crud.menu')"
              >
              <template slot-scope="scope">
                <div class="text-btn-con">
                  <div
                    v-if="isAuth('customer:customerList:edit')"
                    class="text-btn default-btn"
                    @click.stop="addOrUpdateHandle(scope.row.userId)"
                  >{{$t('user.edit')}}</div>
                </div>
              </template>
            </el-table-column>

            <div slot="empty">
              &nbsp;
            </div>
          </el-table>
      </div>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="page.pageSize"
          :total="page.total"
          layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshChange"></add-or-update>
    <update-growth v-if="updateGrowthVisible" ref="updateGrowth" @refreshDataList="refreshChange"></update-growth>
    <update-coupon v-if="updateCouponVisible" ref="updateCoupon" :getWay="1" @refreshDataList="refreshChange"></update-coupon>
    <import-user v-if="importUserVisible" ref="importUser" :type="0" @refreshDataList="refreshChange"></import-user>

    <tags-select
      v-if="tagsSelectVisible"
      :tagCategory="0"
      :limit="5"
      ref="tagsSelect"
      @refreshTagsArr="refreshTagsSelect"
    ></tags-select>
  </div>
</template>

<script>
import AddOrUpdate from './customer-add-or-update'
import UpdateGrowth from './update-customer-growth'
import UpdateTags from './update-customer-tags'
import UpdateCoupon from './update-customer-coupon'
import ImportUser from './excel-customer-import'
import TagsSelect from '@/components/tags-select'

export default {
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件
      dataList: [],
      dataListLoading: false,
      exportDisabled: false,
      importDisabled: false,
      tagsSelectVisible: false,
      updateCouponVisible: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      updateGrowthVisible: false,
      updateTagsVisible: false,
      importUserVisible: false,
      createDateRange: [], // 注册时间范围
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      dynamicTags: [],
      dynamicTagsAll: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {
        // userTag: [],
        nickName: '',
        userMobile: '',
        isMember: ''
      },
      memberLevelVal: '',
      // 取缓存 区分登录端类型 (0:连锁品牌 1:自营品牌) (2:连锁门店)
      accountType: this.$store.state.user.accountType
    }
  },
  components: {
    AddOrUpdate,
    UpdateGrowth,
    UpdateTags,
    TagsSelect,
    UpdateCoupon,
    ImportUser
  },
  mounted () {
    this.getDataList(this.page)
  },
  methods: {
    // 获取客户列表  /user/user/pageCustomer
    getDataList (page, newData = false) {
      if (newData || !this.theData) {
        this.theData = JSON.parse(JSON.stringify(this.searchForm))
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/user/user/pageCustomer'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize
            },
            this.theData
          )
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.page.total = data.total
        this.dataListLoading = false
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, 0)
      })
    },
    // 条件查询 JSON.stringify(arr)
    searchChange (newData = false) {
      var arr = ''
      this.dynamicTags.forEach(item => {
        if (item.userTagId === this.dynamicTags[this.dynamicTags.length - 1].userTagId) {
          arr = arr + item.userTagId
          return
        }
        arr = arr + item.userTagId + ','
      })
      this.searchForm.customerTagIds = arr
      this.page.currentPage = 1
      this.getDataList(this.page, newData)
    },
    // 刷新回调用
    refreshChange () {
      this.getDataList(this.page)
    },
    handleSizeChange (val) {
      this.page.pageSize = val
      this.getDataList(this.page)
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.getDataList(this.page)
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.clearAllTags()
      this.memberLevelVal = null
      this.createDateRange = []
    },
    // 获取n天之前的日期
    getNDataAgo (n) {
      let myDate = new Date()
      let lw = new Date(myDate - 1000 * 60 * 60 * 24 * n) // 最后一个数字30可改，30天的意思
      let lastY = lw.getFullYear()
      let lastM = lw.getMonth() + 1
      let lastD = lw.getDate()
      let startData =
        lastY +
        '-' +
        (lastM < 10 ? '0' + lastM : lastM) +
        '-' +
        (lastD < 10 ? '0' + lastD : lastD) +
        ' 00:00:00'
      return startData
    },
    setCreateDateRange (val) {
      let start = this.getNDataAgo(val)
      let end = this.getNDataAgo(-1)
      this.$set(this.createDateRange, 0, start)
      this.$set(this.createDateRange, 1, end)
    },
    // 多选变化
    selectionChange (val) {
      this.dataListSelections = val
    },
    // 修改成长值
    updateGrowth (id) {
      if (this.dataListSelections.length <= 0) {
        return
      }
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.userId
      })
      // console.log(ids)
      this.updateGrowthVisible = true
      this.$nextTick(() => {
        this.$refs.updateGrowth.init(ids)
      })
    },
    updateTags (id) {
      if (this.dataListSelections.length <= 0) {
        return
      }
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.userId
      })
      // console.log(ids)
      this.updateTagsVisible = true
      this.$nextTick(() => {
        this.$refs.updateTags.init(ids)
      })
    },
    updateCoupon (id) {
      if (this.dataListSelections.length <= 0) {
        return
      }
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.userId
      })
      // console.log(ids)
      this.updateCouponVisible = true
      this.$nextTick(() => {
        this.$refs.updateCoupon.init(ids)
      })
    },
    // 移除标签单个选项 updateCoupon
    handleClose (tag) {
      this.dynamicTagsAll.splice(this.dynamicTags.indexOf(tag), 1)
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    // 选择客户标签
    selectUserTags () {
      this.tagsSelectVisible = true
      this.$nextTick(() => {
        this.$refs.tagsSelect.init(this.dynamicTagsAll)
      })
    },
    // 清除所有标签
    clearAllTags () {
      this.dynamicTags = []
      this.dynamicTagsAll = []
    },
    // 选择到的标签tagId
    refreshTagsSelect (data, allData) {
      this.clearAllTags()
      this.dynamicTags = data
      this.dynamicTagsAll = allData
      // this.searchForm.userTag = data
    },
    searchReset () {
      this.clearAllTags()
    },
    //  选择指定列进行排序
    changeTableSort (column) {
      // 获取字段名称和排序类型
      var fieldName = column.prop
      var sortingType = column.order
      this.searchForm.fieldName = fieldName
      this.searchForm.sortingType = sortingType
      this.$set(this.page, this.page)
      this.getDataList(this.page)
    },
    /**
     * 导入用户
     */
    importUser () {
      this.importUserVisible = true
      this.$nextTick(() => {
        this.$refs.importUser.init()
      })
    },
    /**
     * 导出客户
     */
    exportUser () {
      this.exportDisabled = true
      const loading = this.$loading({
        lock: true,
        target: '.table-con',
        customClass: 'export-load',
        background: 'transparent',
        text: this.$i18n.t('formData.exportIng')
      })
      this.$http({
        url: this.$http.adornUrl('/user/user/exportCustomer'),
        method: 'get',
        params: this.$http.adornParams(this.searchForm),
        responseType: 'blob' // 解决文件下载乱码问题
      }).then(({ data }) => {
        loading.close()
        this.exportDisabled = false
        var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
        const fileName = this.$i18n.t('user.clientInformationForm')
        const elink = document.createElement('a')
        if ('download' in elink) { // 非IE下载
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else { // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      }).catch((e) => {
        loading.close()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.mod-user {
  .tips .text {
    color: #FF0000;
  }
 ::v-deep .el-table__fixed{
    height: auto !important;
    bottom: 16px !important;
    &::before {
      background-color: transparent !important;
    }
  }
 ::v-deep .el-table__fixed-right{
    height: auto !important;
    bottom: 16px !important;
    &::before {
      background-color: transparent !important;
    }
  }

}
 .TagS {
   margin-right: 10px !important;
 }

.table-con {
  position: relative;
}

 .empty-text {
  position: absolute;
  z-index: 4;
  top: 50%;
  left: 50%;
  color: #909399;
 }
  ::v-deep .export-load {
    top: -50% !important;
  }


</style>

