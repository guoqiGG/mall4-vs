<template>
  <div>
    <el-form :inline="true" :model="form" size="small" ref="form" class="search-form">
      <el-form-item label="团长" prop="parentId">
        <el-select v-model="dataForm.parentId" filterable remote reserve-keyword placeholder="请输入团长手机号查询"
          :remote-method="remoteMethod" :loading="loading">
          <el-option v-for="item in parentOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间" prop="time">
        <el-date-picker v-model="dataForm.time" type="datetimerange" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss"
          :start-placeholder="$t('text.startTime')" :end-placeholder="$t('date.end')"
          :range-separator="$t('date.tip')"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <div class="default-btn primary-btn" @click="search()">搜索</div>
        <div class="default-btn" @click="reset()">重置</div>
        <div class="default-btn" @click="getSoldExcel()">导出</div>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" style="width: 100%">
      <el-table-column prop="score" label="豆数" :formatter="formatScore"></el-table-column>
      <el-table-column prop="createTime" label="时间"></el-table-column>
      <el-table-column prop="source" label="消息来源"></el-table-column>
    </el-table>
    <div class="total-row">合计: <span>{{ totalScore }}</span></div>
    <el-pagination v-if="dataList.length" @size-change="sizeChangeHandle" @current-change="currentChangeHandle"
      :current-page="page.currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="page.pageSize" :total="page.total"
      layout="total, sizes, prev, pager, next, jumper"></el-pagination>
  </div>
</template>

<script>
import { debounce } from 'lodash'

export default {
  data() {
    return {
      theData: null, // 保存上次点击查询的请求条件
      dataForm: {
        parentId: undefined,
        time: [],
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      dataList: [],
      dataListLoading: false,
      totalScore: 0,
      loading: false,
      parentOptions: []
    }
  },
  created() {
    // 携带参数查询
    this.getDataList(this.page)
    this.getDataTotal()
  },
  methods: {
    /**
     * 获取数据列表
     */
    getDataList(page) {
      page = (page === undefined ? this.page : page)
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/user/integral-flow/scoreflowInfo'),
        method: 'post',
        params: this.$http.adornParams(
          Object.assign(
            {
              parentId: this.dataForm.parentId,
              startTime: this.dataForm.time[0],
              endTime: this.dataForm.time[1]
            },
            {
              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize
            }
          ), false
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.page.total = data.total
      }).finally(() => {
        this.dataListLoading = false
      })
    },
    // 获取合计
    getDataTotal() {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/user/integral-flow/scoreflowTotal'),
        method: 'post',
        params: this.$http.adornParams(
          Object.assign(
            {
              parentId: this.dataForm.parentId,
              startTime: this.dataForm.time[0],
              endTime: this.dataForm.time[1]
            }
          ), false
        )
      }).then(({ data }) => {
        this.totalScore = data
      }).finally(() => {
        this.dataListLoading = false
      })
    },
    // 导出
    getSoldExcel() {
      this.$confirm(this.$i18n.t('order.exportReport'), this.$i18n.t('remindPop.remind'), {
        confirmButtonText: this.$i18n.t('remindPop.confirm'),
        cancelButtonText: this.$i18n.t('remindPop.cancel'),
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          target: '.main-container',
          customClass: 'export-load',
          background: 'transparent',
          text: this.$i18n.t('shop.exportIng')
        })
        this.$http({
          url: this.$http.adornUrl('/user/integral-flow/excelScoreflowInfo'),
          method: 'get',
          params: this.$http.adornParams({
            parentId: this.dataForm.parentId,
            startTime: this.dataForm.time[0],
            endTime: this.dataForm.time[1]
          }),
          responseType: 'blob' // 解决文件下载乱码问题
        }).then(({ data }) => {
          loading.close()
          var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
          const fileName = this.$i18n.t('order.orderInfCollationXls')
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
      })
    },
    // 每页数
    sizeChangeHandle(val) {
      this.page.pageSize = val
      this.page.currentPage = 1
      this.getDataList(this.page)
    },
    // 当前页
    currentChangeHandle(val) {
      this.page.currentPage = val
      this.getDataList(this.page)
    },
    search() {
      this.page.currentPage = 1
      this.getDataList(this.page)
      this.getDataTotal()
    },
    reset() {
      this.dataForm = {
        parentId: undefined,
        time: [],
      }
    },
    formatScore(row, column, cellValue) {
      if (row.ioType === 0) {
        return `-${cellValue}`
      }
      return cellValue
    },
    remoteMethod: debounce(function (value) {
      this.loading = true

      this.$http({
        url: this.$http.adornUrl('/distribution/distributionUser/page/achievement'),
        method: 'get',
        params: this.$http.adornParams(Object.assign({
          size: 50,
          current: 1,
          sortParam: 1,
          sortType: 2,
          userMobile: value
        }, this.theParams))
      }).then(({ data }) => {
        this.parentOptions = data.records.map(item => ({
          ...item,
          label: `${item.nickName}(${item.userMobile})`,
          value: item.distributionUserId
        }))
        this.loading = false
      })
    }, 300)
  }
}
</script>
<style lang="scss" scoped>
.search-form {
  .el-form-item.el-form-item--small {
    margin-right: 20px;
    margin-bottom: 20px;
    margin-bottom: 20px;
  }
}

.total-row {
  height: 46px;
  padding-left: 20px;
  line-height: 46px;
  color: #606266;
  background-color: #F5F7FA;

  span {
    display: inline-block;
    margin-left: 16px;
    font-weight: bold;
  }
}
</style>
