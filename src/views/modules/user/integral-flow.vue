<template>
  <div>
    <el-form :inline="true" :model="form" size="small" ref="form" class="search-form">
      <el-form-item label="团长" prop="parentName">
        <el-input v-model="dataForm.parentName" placeholder="请输入团长"></el-input>
      </el-form-item>
      <el-form-item label="时间" prop="time">
        <el-date-picker v-model="dataForm.time" type="datetimerange" placeholder="选择日期"
          value-format="yyyy-MM-dd HH:mm:ss" :start-placeholder="$t('text.startTime')"
                :end-placeholder="$t('date.end')" :range-separator="$t('date.tip')"></el-date-picker>
      </el-form-item>
      <el-form-item label="主播" prop="anchorName">
        <el-input v-model="dataForm.anchorName" placeholder="请输入主播"></el-input>
      </el-form-item>
      <el-form-item>
        <div class="default-btn primary-btn" @click="search()">{{ $t("searchBar.search") }}</div>
        <div class="default-btn" @click="reset()">{{ $t("shop.resetMap") }}</div>
        <div class="default-btn" @click="getSoldExcel()">{{ $t("formData.export") }}</div>
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
export default {
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件
      dataForm: {
        parentName: '',
        time: [],
        anchorName: ''
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      dataList: [],
      dataListLoading: false,
      totalScore: 0
    }
  },
  created () {
    // 携带参数查询
    this.getDataList(this.page)
    this.getDataTotal()
  },
  methods: {
    /**
     * 获取数据列表
     */
    getDataList (page) {
      page = (page === undefined ? this.page : page)
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/user/integral-flow/scoreflowInfo'),
        method: 'post',
        params: this.$http.adornParams(
          Object.assign(
            {
              parentName: this.dataForm.parentName,
              anchorName: this.dataForm.anchorName,
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
        this.totalScore = data.totalScore
      }).finally(() => {
        this.dataListLoading = false
      })
    },
    // 获取合计
    getDataTotal () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/user/integral-flow/scoreflowInfo'),
        method: 'post',
        params: this.$http.adornParams(
          Object.assign(
            {
              parentName: this.dataForm.parentName,
              anchorName: this.dataForm.anchorName,
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
    getSoldExcel () {
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
            scoreFlowDto: {
              parentName: this.dataForm.parentName,
              anchorName: this.dataForm.anchorName,
              startTime: this.dataForm.time[0],
              endTime: this.dataForm.time[1]
            }
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
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.currentPage = 1
      this.getDataList(this.page)
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.currentPage = val
      this.getDataList(this.page)
    },
    search () {
      this.page.currentPage = 1
      this.getDataList(this.page)
      this.getDataTotal()
    },
    reset () {
      this.$refs.form.resetFields()
    },
    formatScore (row, column, cellValue) {
      if (row.ioType === 0) {
        return `-${cellValue}`
      }
    }
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
