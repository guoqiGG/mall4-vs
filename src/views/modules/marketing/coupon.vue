<template>
  <div class="mod-marketing-coupon">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form @submit.native.prevent :inline="true" class="search-form" ref="test-form" :model="searchForm" label-width="auto" size="small">
        <div class="input-row">
          <el-form-item :label="$t('coupon.couponName')+':'">
              <el-input v-model="searchForm.couponName" :placeholder="$t('coupon.couponName')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('coupon.expStatus')+':'">
            <el-select v-model="searchForm.overdueStatus" :placeholder="$t('coupon.expStatus')">
              <el-option
                v-for="item in overdueStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('coupon.launchStatus')+':'">
            <el-select v-model="searchForm.putonStatus" :placeholder="$t('coupon.launchStatus')">
              <el-option
                v-for="item in putonStatuList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 日期组件 -->
          <el-form-item :label="$t('coupon.expire')+':'">
            <el-date-picker
              v-model="dateRange"
              type="datetimerange"
              :range-separator="$t('time.tip')"
              value-format="yyyy-MM-dd HH:mm:ss"
              :start-placeholder="$t('time.start')"
              :end-placeholder="$t('time.end')"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <div class="default-btn primary-btn" @click="searchChange(true)">{{$t('shopFeature.searchBar.search')}}</div>
            <div class="default-btn" @click="clearSearch">{{$t('shop.resetMap')}}</div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- 搜索栏end -->
    <!-- 表格主体 -->
    <div class="main-container">
      <div class="operation-bar">
        <div
          class="default-btn primary-btn"
          v-if="isAuth('admin:coupon:save')"
          @click="addOrUpdateHandle()"
          >{{ $t("crud.addTitle") }}
        </div>
      </div>
      <!-- 表格 -->
      <div class="table-con seckill-table">
        <el-table
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%">
          <el-table-column
            prop="couponName"
            :label="$t('coupon.couponName')"
            min-width="280"
            fixed="left"
            >
            <template slot-scope="scope">
              <div>
                <span class="table-cell-text line-clamp-one">{{ scope.row.couponName || '' }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="startTime"
            :label="$t('coupon.startTime')"
            min-width="180"
            >
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.startTime || '-' }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="endTime"
            :label="$t('coupon.endTime')"
            min-width="180"
            >
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.endTime || '-' }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="couponType"
            :label="$t('coupon.couponType')"
            min-width="150"
            >
            <template slot-scope="scope">
              <div class="tag-text">
                {{['',$t("coupon.voucher"), $t("coupon.discountCoupon"),
                $t("coupon.excCerti")]
                [scope.row.couponType]}}</div>
            </template>
          </el-table-column>

          <el-table-column
            prop="overdueStatus"
            :label="$t('coupon.expStatus')"
            min-width="100"
            >
            <template slot-scope="scope">
              <div class="tag-text">
                {{[$t("coupon.exp"), $t("coupon.notExp")]
                [scope.row.overdueStatus]}}</div>
            </template>
          </el-table-column>

          <el-table-column
            prop="putonStatus"
            :label="$t('coupon.launchStatus')"
            min-width="130"
            >
            <template slot-scope="scope">
              <div class="tag-text" v-if="scope.row.putonStatus!==-1">
                {{[$t("coupon.waitAutoLaunch"), $t("coupon.launched"), $t("coupon.illOff"), $t("coupon.waitReview"), $t("coupon.waitLaunch")]
                [scope.row.putonStatus]}}
              </div>
              <div class="tag-text" v-else>
                {{$t("coupon.cancelLaunch")}}
              </div>
            </template>
          </el-table-column>
          <el-table-column align="left" prop="launchTime" :label="$t('coupon.timeToMarket')" width="180">
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.launchTime || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="stocks"
            :label="$t('coupon.stock')"
            sortable
            min-width="100"
            >
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.stocks || '-' }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="getWay"
            :label="$t('coupon.getWay')"
            width="auto">
            <template slot-scope="scope">
              <span class="tag-text">{{[$t("coupon.receiveDirectly"),$t("coupon.exchangeOrSystemIssue")][scope.row.getWay]}}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="takeNum"
            :label="$t('dataAnaly.numberOfRe')"
            sortable
            min-width="110"
            >
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.takeNum || '-' }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="useNum"
            :label="$t('dataAnaly.microMallUsage')"
            sortable
            min-width="160"
            >
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.useNum || '-' }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" :label="$i18n.t('crud.menu')" width="180" fixed="right">
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('admin:coupon:update')"
                  @click="addOrUpdateHandle(scope.row.couponId)"
                  >{{ $t("temp.modify") }}</div
                >
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('admin:coupon:auditApply') && scope.row.putonStatus > 1 && scope.row.putonStatus < 4"
                  @click="auditEventHandle(scope.row.couponId)"
                  >{{
                    scope.row.putonStatus === 2
                      ? $t("groups.applyForListing")
                      : $t("coupon.waitReview")
                  }}</div
                >
                <div
                  class="default-btn text-btn"
                  v-if="isAuth('admin:coupon:delete')"
                  @click="deleteHandle(scope.row.couponId)"
                  >{{ $t("text.delBtn") }}</div
                >
              </div>
            </template>
          </el-table-column>

        </el-table>
      </div>
      <!-- 分页 -->
      <el-pagination
        v-if="dataList.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total">
      </el-pagination>
    </div>
    <!-- 表格主体end -->

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="refreshChange"
    ></add-or-update>
    <!-- 下线管理弹窗-->
    <offlineEventHandle
      v-if="offlineEventHandleVisible"
      selectUrl="/admin/coupon/getOfflineHandleEventByCouponId"
      applyUrl="/admin/coupon/auditApply"
      ref="offlineEvent"
      @refreshDataList="refreshChange"
    ></offlineEventHandle>
  </div>
</template>

<script>
import AddOrUpdate from './coupon-add-or-update'
import OfflineEventHandle from '@/components/offline-event-handle'

export default {
  name: 'marketing-coupon',
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件
      theParams: null, // 保存上次点击查询的请求条件

      search: {
        slot: ''
      },
      dataForm: {
        orderNumber: '',
        status: null
      },
      dateRange: [],
      overdueOptions: [{
        value: 0,
        label: this.$i18n.t('coupon.exp')
      },
      {
        value: 1,
        label: this.$i18n.t('coupon.notExp')
      }],
      PutonOptions: [{
        value: -1,
        label: this.$i18n.t('coupon.cancelLaunch')
      },
      {
        value: 0,
        label: this.$i18n.t('coupon.waitAutoLaunch')
      },
      {
        value: 1,
        label: this.$i18n.t('coupon.launched')
      },
      {
        value: 2,
        label: this.$i18n.t('coupon.illOff')
      },
      {
        value: 3,
        label: this.$i18n.t('coupon.waitReview')
      },
      {
        value: 4,
        label: this.$i18n.t('coupon.waitLaunch')
      }],
      dataList: [],
      dataListLoading: false,
      offlineEventHandleVisible: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      // 头部搜索表单
      searchForm: {
        couponName: null,
        overdueStatus: null,
        putonStatus: null
      },
      overdueStatusList: [
        {
          value: 1,
          label: this.$i18n.t('coupon.notExp')
        }, {
          value: 0,
          label: this.$i18n.t('coupon.exp')
        }
      ],
      putonStatuList: [
        {
          value: -1,
          label: this.$i18n.t('coupon.cancelLaunch')
        },
        {
          value: 0,
          label: this.$i18n.t('coupon.waitAutoLaunch')
        },
        {
          value: 1,
          label: this.$i18n.t('coupon.launched')
        },
        {
          value: 2,
          label: this.$i18n.t('coupon.illOff')
        },
        {
          value: 3,
          label: this.$i18n.t('coupon.waitReview')
        },
        {
          value: 4,
          label: this.$i18n.t('coupon.waitLaunch')
        }
      ]
    }
  },
  components: {
    AddOrUpdate,
    OfflineEventHandle
  },
  mounted () {
    // this.getDataList()
  },
  activated () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList (page, newData = false) {
      if (this.page) {
        let size = Math.ceil(this.page.total / this.page.pageSize)
        this.page.currentPage = (this.page.currentPage > size ? size : this.page.currentPage) || 1
      }
      this.dataListLoading = true

      if (newData || !this.theData) {
        this.theParams = JSON.parse(JSON.stringify(this.searchForm))
        this.theData = {
          current: page == null ? this.page.currentPage : page.currentPage,
          size: page == null ? this.page.pageSize : page.pageSize,
          'couponName': this.dataForm.couponName,
          'overdueStatus': this.dataForm.overdueStatus,
          'putonStatus': this.dataForm.putonStatus,
          'startTime': this.dateRange === null ? null : this.dateRange[0], // 开始时间
          'endTime': this.dateRange === null ? null : this.dateRange[1] // 结束时间
        }
      } else {
        this.theData.current = page == null ? this.page.currentPage : page.currentPage
        this.theData.size = page == null ? this.page.pageSize : page.pageSize
      }
      this.$http({
        url: this.$http.adornUrl('/admin/coupon/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            this.theData,
            this.theParams
          ), false
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.page.total = data.total
        this.page.currentPage = data.current
        this.dataListLoading = false
      })
    },
    orderStatus () {

    },
    // 新增 / 修改
    addOrUpdateHandle (val) {
      // this.addOrUpdateVisible = true
      // this.$nextTick(() => {
      //   this.$refs.addOrUpdate.init(val)
      // })
      this.$router.push({
        path: '/marketing-new-coupon',
        query: {
          couponId: val
        }
      })
    },
    // 删除
    deleteHandle (id) {
      let ids = id ? [id] : this.dataListSelections.map(item => {
        return item.couponId
      })
      this.$confirm(`${this.$i18n.t('sys.makeSure')}[${id ? this.$i18n.t('text.delBtn') : this.$i18n.t('sys.batchDelete')}]${this.$i18n.t('text.menu')}?`, this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('crud.filter.submitBtn'),
        cancelButtonText: this.$i18n.t('crud.filter.cancelBtn'),
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/admin/coupon'),
            method: 'delete',
            data: this.$http.adornData(id, false)
          }).then(({ data }) => {
            this.page.total = this.page.total - ids.length
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.refreshChange()
              }
            })
          })
        })
        .catch(() => { })
    },
    // 条件查询
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.page.pageSize = 10
      this.getDataList(this.page, newData)
    },
    // 刷新回调用
    refreshChange () {
      // this.page = this.$refs.crud.$refs.tablePage.defaultPage
      this.getDataList(this.page)
    },
    // 多选变化
    selectionChange (val) {
      this.dataListSelections = val
    },
    // 清空自定义数据
    searchReset () {
      this.dateRange = []
    },
    // 下线管理
    auditEventHandle (id) {
      this.offlineEventHandleVisible = true
      this.$nextTick(() => {
        this.$refs.offlineEvent.init(id)
      })
    },
    clearSearch () {
      this.dateRange = []
      this.searchForm.couponName = null
      this.searchForm.overdueStatus = null
      this.searchForm.putonStatus = null
    },
    // 每页数量变更
    handleSizeChange (val) {
      this.page.pageSize = val
      this.getDataList()
    },
    // 页数变更
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.getDataList()
    }
  }
}
</script>
<style lang="scss">

</style>
