<template>
  <div class="mod-stock stock-list-mod">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form @submit.native.prevent :inline="true" class="search-form" ref="searchForm" :model="searchForm" label-width="auto" size="small">
        <!-- 表单项 -->
        <div class="input-row">
          <el-form-item :label="$t('stock.retailSearch') + ':'">
            <el-select v-model="searchForm.prodKeyType" @change="prodKeyTypeChange">
              <el-option
                v-for="node in prodKeyArr"
                :key="node.key"
                :label="node.label"
                :value="node.key"
              ></el-option>
            </el-select>
            <el-input type="text" v-model="searchForm.prodKey" :placeholder="prodKeyArr[searchForm.prodKeyType - 1].inputTips"/>
          </el-form-item>
          <el-form-item :label="$t('product.shopCategories') + ':'">
            <el-cascader
              expand-trigger="hover"
              :options="categoryList"
              :props="categoryTreeProps"
              :clearable="true"
              v-model="selectedCategory"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
          <el-form-item >
            <div class="default-btn primary-btn" @click="searchChange">{{ $t('crud.searchBtn') }}</div>
            <div class="default-btn" @click="resetForm()">{{ $t('shop.resetMap') }}</div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-container">
      <div class="operation-bar">
        <div v-if="isAuth('multishop:inquireStock:export')" class="default-btn" @click="exportSkuInfo">{{ $t('order.ExportingFiles') }}</div>
      </div>
      <!-- 表格 -->
      <div class="table-con">
        <el-table
          ref="dataListRef"
          :data="dataList"
          header-cell-class-name="table-header"
          @selection-change="handleSelectionChange"
          row-class-name="table-row"
          style="width: 100%"
        >
          <el-table-column
            type="selection"
            align="center"
            fixed="left"
            width="55">
          </el-table-column>
          <el-table-column
            width="380"
            :label="$t('product.prodInfo')"
          >
            <template slot-scope="scope">
              <div class="table-cell-con">
                <div class="table-cell-image">
                  <ImgShow :src="scope.row.pic" :imgStyle="{width:'100px',height:'100px'}" />
                </div>
                <div class="table-cell-text">
                  {{scope.row.name}}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('stock.retailNo')"
            width="240"
          >
            <template slot-scope="scope">
              <div class="table-cell-text">
                {{scope.row.barCode}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="spec"
            :label="$t('stock.spec')"
          >
            <template slot-scope="scope">
              <div class="sku-name-txt">
                {{scope.row.spec || '-'}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('coupon.stock')"
            prop="stocks"
            >
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.stocks}}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('stock.retailUnit')"
            prop="unit"
          >
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.unit || '-'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('stock.costAmount')"
            prop="costPrice"
            width="200">
            <template slot-scope="scope">
              <span class="table-cell-text line-clamp-one">{{scope.row.costPrice}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="page.pageSize"
      :total="page.total"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <!-- 导出入库明细 -->
    <el-dialog
      :title="this.$i18n.t('stock.exportStorageDetails')"
      :visible.sync="exportStockBillLogVisible"
    >
      <el-radio v-model="exportRadio" :label="1">{{ this.$i18n.t('stock.exportOfSearchStorage') }}</el-radio>
      <el-radio v-model="exportRadio" :label="2">{{ this.$i18n.t('stock.exportOfSelectStorage') }}</el-radio>
      <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="exportStockBillLogVisible = false">{{ this.$i18n.t('crud.filter.cancelBtn') }}</div>
      <div class="default-btn primary-btn" @click="confirmExport">{{ this.$i18n.t('crud.filter.submitBtn') }}</div>
    </span>
    </el-dialog>
    <stock-inquire-dialog ref="inquireDialog" v-if="inquireDialogVisible"></stock-inquire-dialog>
  </div>
</template>

<script>
import { treeDataTranslate } from '@/utils'
import stockInquireDialog from './stock-inquire-dialog'

export default {
  components: {
    stockInquireDialog
  },
  data () {
    return {
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      dataForm: {

      },
      isSubmit: false,
      dataListLoading: false,
      dataList: [], // 表格数据
      inquireDialogVisible: false, // 查看同款信息弹窗
      exportStockBillLogVisible: false, // 导出弹窗是否可见
      exportRadio: 1, //  1 按搜索条件导出 2 按选择项导出
      dataListSelections: [], // 已选择的数据项
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      prodKeyArr: [
        { key: 1, label: this.$i18n.t('stock.retailName'), inputTips: this.$i18n.t('takeStock.inputName') },
        { key: 2, label: this.$i18n.t('stock.retailNo'), inputTips: this.$i18n.t('takeStock.inputPartyCode') }
      ],
      brandList: [],
      categoryList: [],
      selectedCategory: [],
      searchForm: {
        prodKeyType: 1, // 1：商品名称 2：商品编码
        prodKey: '', // 搜索商品关键词
        categoryId: null // 店铺分类id
      },
      categoryTreeProps: {
        value: 'categoryId',
        label: 'categoryName'
      },
      prodKeyInputTips: this.$i18n.t('takeStock.inputName')
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.selectedCategory = []
      this.getDataList()
      // 获取品牌列表
      this.getBrandList()
      // 获取分类列表
      this.getCategoryList()
    },
    getDataList (page) {
      this.$http({
        url: this.$http.adornUrl('/shop/retailProd/pageStocks'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize
            },
            this.searchForm
          )
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.page.total = data.total
        this.dataListLoading = false
      }).catch(() => {
        this.dataListLoading = false
      })
    },
    prodKeyTypeChange () {
      this.searchForm.prodKey = ''
    },
    getBrandList () {
      this.$http({
        url: this.$http.adornUrl(`/admin/brand/listSigningBrand`),
        method: 'get',
        params: this.$http.adornParams({
          status: 1 // 签约审核 0 未审核 1已通过 -1未通过
        })
      }).then(({ data }) => {
        this.brandList = data.platformBrandList
      })
    },
    getCategoryList () {
      this.$http({
        url: this.$http.adornUrl('/prod/category/listCategory'),
        method: 'get',
        params: this.$http.adornParams({
          status: 1
        })
      }).then(({ data }) => {
        this.categoryList = treeDataTranslate(data, 'categoryId', 'parentId')
      })
    },
    /**
     * 获取分类id
     */
    handleChange (val) {
      this.searchForm.categoryId = val[val.length - 1]
    },
    searchChange () {
      this.page.currentPage = 1
      this.getDataList()
    },
    exportSkuInfo () {
      this.exportStockBillLogVisible = true
    },
    resetForm () {
      this.searchForm = {
        prodKeyType: 1, // 1：商品名称 2：商品编码
        prodKey: '', // 搜索商品关键词
        supplierId: null, // 供应商id
        brandId: null, // 品牌id
        categoryId: null // 店铺分类id
      }
      this.selectedCategory = []
    },
    logHandle (row) {
      console.log(row)
    },
    queryConditionHandle (row) {
      this.inquireDialogVisible = true
      this.$nextTick(() => {
        this.$refs.inquireDialog.init(row.prodId)
      })
    },
    handleSizeChange (val) {
      this.page.pageSize = val
      this.getDataList(this.page)
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.getDataList(this.page)
    },
    // 多选变化
    handleSelectionChange (val) {
      this.dataListSelections = val
    },
    /**
     * 确定导出
     */
    confirmExport () {
      if (this.exportRadio !== 1 && this.exportRadio !== 2) {
        this.$message({
          message: this.$i18n.t('stock.exportRadioEmptyTips'),
          type: 'error',
          duration: 1500,
          onClose: () => {
            this.isSubmit = false
          }
        })
        return
      }
      if (this.isSubmit) {
        return
      }
      this.isSubmit = true
      // 准备参数
      let params = {}
      if (this.exportRadio === 1) {
        // 导出模式为按搜索条件导出
        if (this.page.total === 0) {
          this.$message({
            message: this.$i18n.t('stock.exportStockLogSearchEmptyTips'),
            type: 'error',
            duration: 1500,
            onClose: () => {
              this.isSubmit = false
            }
          })
          return
        }
        params = this.searchForm
        params.retailProdIds = null
      } else {
        // 导出模式为按选中的数据导出
        if (this.dataListSelections.length === 0) {
          this.$message({
            message: this.$i18n.t('stock.exportStockLogSelectEmptyTips'),
            type: 'error',
            duration: 1500,
            onClose: () => {
              this.isSubmit = false
            }
          })
          return
        }
        params.retailProdIds = this.dataListSelections.map(item => {
          return item.retailProdId
        })
      }
      this.$http({
        url: this.$http.adornUrl('/shop/retailProd/exportRetailStockInfo'),
        method: 'get',
        params: this.$http.adornParams(params),
        responseType: 'blob'
      }).then(({ data }) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
        const fileName = this.$i18n.t('stock.retailStockXls')
        const elink = document.createElement('a')
        if ('download' in elink) {
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else {
          navigator.msSaveBlob(blob, fileName)
        }
        this.$message({
          message: this.$i18n.t('stock.exportSuccess'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.isSubmit = false
            this.exportStockBillLogVisible = false
          }
        })
      }).catch((e) => {
        this.isSubmit = false
      })
    }
  }
}
</script>

