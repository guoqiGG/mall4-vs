<template>
  <div class="mod-shop-notice">
    <div class="search-bar">
      <el-form @submit.native.prevent :inline="true" class="search-form" ref="searchForm" :model="searchForm" label-width="auto" size="small">
          <div class="input-row">
            <el-form-item prop="keywords" :label="$t('imMsgBizSkills.keyword') + ':'" class="search-form-item">
              <el-input type="text" v-model="searchForm.keywords" :placeholder="$t('imMsgBizSkills.keyword')"></el-input>
            </el-form-item>
            <el-form-item prop="content" :label="$t('imMsgBizSkills.content') + ':'" class="search-form-item">
              <el-input type="text" v-model="searchForm.content" :placeholder="$t('imMsgBizSkills.content')"></el-input>
            </el-form-item>
            <el-form-item >
              <div class="default-btn primary-btn" @click="searchChange(true)">{{ $t('crud.searchBtn') }}</div>
              <div class="default-btn" @click="resetForm('searchForm')">{{ $t('shop.resetMap') }}</div>
            </el-form-item>
          </div>
        </el-form>
    </div>
    <div class="main-container">
      <div class="operation-bar">
        <div 
          v-if="isAuth('multishop:imMsgBizSkills:save')"
          class="default-btn primary-btn"
          @click="addOrUpdateHandle()">
          {{ $t('crud.addBtn') }}
        </div>
      </div>
      <div class="table-con">
        <el-table
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
        >
          <el-table-column
            :label="$t('number')"
            type="index"
            align="left"
            width="80"
          />
          <el-table-column
            prop="keywords"
            width="210"
            :label="$t('imMsgBizSkills.keyword')"
          >
           <template #defult="scope">
              {{scope.row.keywords}}
           </template>
          </el-table-column>
          
          <el-table-column
            prop="content"
            width="380"
            :label="$t('imMsgBizSkills.content')"
          />
          <el-table-column
            prop="remark"
            :label="$t('publics.remark')"
            min-width="200">
          </el-table-column>
          <el-table-column
            align="center"
            :label="$t('crud.menu')"
            width="230"
            >
            <template slot-scope="scope">
              <div class="text-btn-con">
                <div  v-if="isAuth('multishop:imMsgBizSkills:update')" class="default-btn text-btn" @click="addOrUpdateHandle(scope.row.id)">{{$t('text.editBtn')}}</div>
                <div  v-if="isAuth('multishop:imMsgBizSkills:delete')" class="default-btn text-btn" @click="deleteHandle(scope.row.id)">{{$t('text.delBtn')}}</div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
          v-if="dataList.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="page.pageSize"
          :total="page.total"
          layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="refreshChange"></add-or-update>
  </div>
</template>

<script>
import addOrUpdate from './add-or-update.vue'
export default {
  components: {
    addOrUpdate
  },
  data () {
    return {
      theData: null, // 保存上次点击查询的请求条件
      theParams: null, // 保存上次点击查询的请求条件
      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      searchForm: {
        keywords: '',
        content: ''
      },
      dateRange: [],
      dataListLoading: false,

      dataForm: {},
      addOrUpdateVisible: false
    }
  },
  created () {
  },
  mounted () {
    this.getDataList(this.page)
    // let title = this.$t('notice.plaNotice')
    // this.$store.commit('common/replaceSelectMenu', title)
  },
  methods: {
    // 查看单个平台公告
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl('/shop/notice/info/' + this.dataForm.id),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            data.content = this.DOMPurify.sanitize(data.content)
            this.dataForm = data
          })
        }
      })
    },
    getDataList (page, newData = false) {
      if (newData || !this.theData) {
        this.theParams = JSON.parse(JSON.stringify(this.searchForm))
        this.theData = {
          current: page == null ? this.page.currentPage : page.currentPage,
          size: page == null ? this.page.pageSize : page.pageSize
        }
      } else {
        this.theData.current = page == null ? this.page.currentPage : page.currentPage
        this.theData.size = page == null ? this.page.pageSize : page.pageSize
      }
      this.$http({
        url: this.$http.adornUrl('/multishop/imMsgBizSkills/page'),
        method: 'get',
        params: this.$http.adornParams(Object.assign(this.theData, this.theParams))
      }).then(({data}) => {
        this.dataList = data.records
        this.page.total = data.total
        this.dataListLoading = false
      })
    },
    // 查看
    viewNotice (id) {
      this.viewDialog = true
      this.$nextTick(() => {
        this.init(id)
      })
    },
     // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle (id) {
      let ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      this.$confirm(this.$i18n.t('admin.isDeleOper'), this.$i18n.t('text.tips'), {
        confirmButtonText: this.$i18n.t('shopProcess.confirm'),
        cancelButtonText: this.$i18n.t('shopProcess.cancel'),
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/multishop/imMsgBizSkills/' + id),
          method: 'delete',
          data: this.$http.adornData({})
        }).then(({ data }) => {
          if (this.dataList.length === 1 && this.page.currentPage > 1) {
            this.page.currentPage --
          }
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
      }).catch(() => { })
    },
    // 清空自定义数据
    searchReset () {
      this.dateRange = []
    },
    // 刷新回调用
    refreshChange () {
      this.getDataList(this.page)
    },
    searchChange (newData = false) {
      this.page.currentPage = 1
      this.page.pageSize = 10
      this.getDataList(this.page, newData)
    },
    handleSizeChange (val) {
      this.page.pageSize = val
      this.getDataList()
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.getDataList()
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.dateRange = []
    }
  }
}
</script>

<style lang="scss" scoped>
.mod-shop-notice {
  .notice-html-con {
    max-height: 370px;
    overflow-x: hidden;
    word-break: break-word;
  }
  .notice-html-con::-webkit-scrollbar {
    width: 6px;
    height: 1px;
    border-radius: 4px;
    background: #f7f8fa;
  }
  .notice-html-con::-webkit-scrollbar-thumb {
    background: #e9ecf3;
    border-radius: 4px;
  }
}
</style>

