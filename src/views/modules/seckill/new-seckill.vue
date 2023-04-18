<template>
  <div class="new-seckill-mod">
    <div class="new-page-title">
      <div class="line" />
      <div class="text">
        {{
          !dataForm.seckillId
          ? this.$i18n.t('seckill.newSeckill')
          : this.$i18n.t('seckill.viewSeckill')
        }}
      </div>
    </div>
    <el-form @submit.native.prevent
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      class="form-box"
      label-width="auto"
      @keyup.enter.native="dataFormSubmit()"
      size="small"
    >
      <el-form-item :label="this.$i18n.t('group.actName')" prop="seckillName" class="seckill-name-input">
        <el-input
          v-model.trim="dataForm.seckillName"
          style="width: 490px"
          maxlength="36"
          show-word-limit
          :disabled="!!dataForm.seckillId"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="this.$i18n.t('marketing.activTime')"
        prop="startTime"
      >
        <!-- <el-date-picker
          v-model="dataForm.dateRange"
          type="datetimerange"
          style="width: 400px"
          :range-separator="this.$i18n.t('time.tip')"
          value-format="yyyy-MM-dd HH:mm:ss"
          :start-placeholder="this.$i18n.t('time.start')"
          :end-placeholder="this.$i18n.t('time.end')"
          :disabled="!!dataForm.seckillId"
          :picker-options="pickerOptions"
        ></el-date-picker> -->
        <el-date-picker
          size="small"
          v-model="dataForm.startTime"
          value-format="yyyy-MM-dd"
          type="date"
          :placeholder="this.$i18n.t('time.start')"
          :disabled="!!dataForm.seckillId"
          style="width:136px"
        />
        <el-time-select
          v-model="startTimeValue"
          :picker-options="{
            start: '00:00',
            step: '00:30',
            end: '23:30'
          }"
          style="width:97px"
          :disabled="!!dataForm.seckillId"
          :placeholder="this.$i18n.t('time.startTime')">
        </el-time-select>
        <span style="margin:0 5px;width:14px;display: inline-block;">{{ this.$i18n.t('time.tip') }}</span>
        <el-date-picker
          size="small"
          v-model="dataForm.endTime"
          value-format="yyyy-MM-dd"
          type="date"
          :placeholder="this.$i18n.t('time.end')"
          :disabled="!!dataForm.seckillId"
          style="width:136px"
        />
        <el-time-select
          v-model="endTimeValue"
          :picker-options="{
            start: '00:00',
            step: '00:30',
            end: '23:30'
          }"
          style="width:97px"
          :disabled="!!dataForm.seckillId"
          :placeholder="this.$i18n.t('time.endTime')">
        </el-time-select>
      </el-form-item>

      <!-- <el-form-item :label="this.$i18n.t('seckill.')活动标签" prop="seckillTag">
        <el-input
          v-model="dataForm.seckillTag"
          style="width:200px"
          :disabled="!!dataForm.seckillId"
        ></el-input>
      </el-form-item>-->
      <el-form-item
        :label="this.$i18n.t('seckill.purcPerPerson')"
        prop="maxNum"
      >
        <el-checkbox
          v-model="hasMaxNum"
          @click="handlerChangeMaxNum"
          :disabled="!!dataForm.seckillId"
          >{{ $t("seckill.openPurchaseLimit") }}</el-checkbox
        >
        <span v-show="hasMaxNum">
          {{ $t("seckill.canBePurcPer") }}
          <el-input-number
            v-model="dataForm.maxNum"
            controls-position="right"
            :min="1"
            :max="1000"
            style="width: 100px"
            :disabled="!!dataForm.seckillId"
            :precision="0"
          ></el-input-number
          >{{ $t("marketing.item") }}
        </span>
      </el-form-item>
      <el-form-item
        :label="this.$i18n.t('seckill.cancelTheOrder')"
        prop="maxCancelTime"
      >
        {{ $t("order.buyer") }}&nbsp;
        <el-input-number
          v-model="dataForm.maxCancelTime"
          :min="2"
          :max="15"
          controls-position="right"
          style="width: 100px"
          :disabled="!!dataForm.seckillId"
          :precision="0"
        ></el-input-number
        >&nbsp;&nbsp;{{ $t("seckill.unpaidnutes") }}
      </el-form-item>
      <el-form-item :label="this.$i18n.t('home.product')">
        <div
          plain
          @click="prodsSelectHandle()"
          style="float: left"
          class="default-btn"
          v-if="!dataForm.seckillId && prod === null"
          >{{ $t("product.select") }}</div>
        <el-alert
          :title="this.$i18n.t('seckill.warning')"
          type="warning"
          :closable="false"
          style="width: 295px; float: left; height: 32px; margin-left: 10px"
        ></el-alert>
      </el-form-item>
      <el-form-item v-if="prod != null">
        <el-card
          :body-style="{ padding: '0px' }"
          style="height: 160px; width: 120px"
        >
          <prod-pic
            height="104px"
            width="100%"
            :pic="prod.pic"
          ></prod-pic>
          <div class="card-prod-bottom">
            <span class="card-prod-name">{{ prod.prodName }}</span>
            <el-button
              v-if="prod.status !== -1 && !dataForm.seckillId"
              type="text"
              class="card-prod-name-button"
              :disabled="!!dataForm.seckillId"
              @click="deleteProd"
              >{{ $t("text.delBtn") }}</el-button
            >
            <el-button
              v-if="prod.status === -1"
              type="text"
              class="card-prod-name-button"
              disabled
              >{{ $t("seckill.productHasBeenDeleted") }}</el-button
            >
          </div>
        </el-card>
      </el-form-item>
      <el-form-item v-if="skuList.length">
        <!--      批量设置-->
        <div>
          <!-- <el-button
            type="text"
            icon="el-icon-document-checked"
            size="small"
            @click="switchSet"
          >{{$t("groups.batchSettings")}}</el-button> -->
          <el-form @submit.native.prevent :inline="true" class="demo-form-inline" v-if="isEdit" size="small">
            <el-form-item :label="this.$i18n.t('product.eventPrice')">
              <el-input-number v-model="dataForm.price"
                controls-position="right"
                :precision="2"
                :max="1000000000"
                :min="0"
              ></el-input-number>
            </el-form-item>
            <el-form-item :label="this.$i18n.t('marketing.activeInventory')">
              <el-input-number v-model="dataForm.stocks"
                  controls-position="right"
                  :disabled="isCompose == 1"
                  size="small"
                  :precision="0"
                  :max="9999999"
                  :min="0"
              ></el-input-number>
            </el-form-item>
            <el-form-item>
              <div class="default-btn primary-btn" @click="batchSet">{{$t("crud.filter.submitBtn")}}</div>
              <div class="default-btn" @click="switchSet">{{$t("crud.filter.cancelBtn")}}</div>
            </el-form-item>
          </el-form>
        </div>
        <el-table
          v-if="skuList.length"
          :data="skuList"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          style="width: 1000px; margin-top: 20px"
        >
          <el-table-column
            prop="prodName"
            :label="this.$i18n.t('product.prodName')"
            width="350"
          >
            <template slot-scope="scope">
              <span class="table-cell-text">{{ scope.row.prodName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="price"
            :label="this.$i18n.t('product.eventPrice')"
            :width="lang === 'en'? '251' : '201'"
          >
            <template slot-scope="scope">
              <el-input-number
                :precision="2"
                :step="0.01"
                :min="0.01"
                size="small"
                :max="!!(!scope.row.status || dataForm.seckillId)?100000000:scope.row.price"
                v-model="scope.row.seckillPrice"
                :disabled="!!(!scope.row.status || dataForm.seckillId)"
              ></el-input-number>
              <div>{{ $t("seckill.price") }}{{ scope.row.price }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="stocks"
            :label="this.$i18n.t('marketing.activeInventory')"
            width="201"
          >
            <template slot-scope="scope">
              <el-input-number
                type="number"
                :step-strictly='true'
                v-model="scope.row.seckillStocks"
                :min="0"
                :max="9999999"
                size="small"
                :disabled="!!(!scope.row.status || dataForm.seckillId)"
              ></el-input-number>
              <div>{{ $t("seckill.exisocks") }}{{ scope.row.stocks }}</div>
            </template>
          </el-table-column>
          <el-table-column :label="!dataForm.seckillId?this.$i18n.t('text.menu'):this.$i18n.t('product.status')">
            <template slot-scope="scope">
              <div v-if="!dataForm.seckillId">
                <el-button
                  type="text"
                  size="small"
                  @click="changeSkuStatus(`${scope.$index}`)"
                  :disabled="!!dataForm.seckillId"
                  v-if="scope.row.status"
                  >{{ $t("publics.disable") }}
                  </el-button
                >
                <el-button
                  type="text"
                  size="small"
                  @click="changeSkuStatus(`${scope.$index}`)"
                  :disabled="!!(scope.row.rawStatus === 0 || dataForm.seckillId)"
                  v-else
                  >{{ $t("shop.ena") }}</el-button
                >
              </div>
              <div v-else>
                <el-button
                  type="text"
                  size="small"
                  @click="changeSkuStatus(`${scope.$index}`)"
                  :disabled="!!dataForm.seckillId"
                  v-if="!scope.row.seckillPrice"
                  >{{ $t("publics.disable") }}
                  </el-button
                >
                <el-button
                  type="text"
                  size="small"
                  @click="changeSkuStatus(`${scope.$index}`)"
                  :disabled="!!dataForm.seckillId"
                  v-else
                  >{{ $t("shop.ena") }}</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <div @click="back()" class="default-btn">{{
        $t("crud.filter.cancelBtn")
        }}</div>
        <div
          type="primary"
          class="default-btn primary-btn"
          :class="[!!dataForm.seckillId?'disabled-btn':'','default-btn primary-btn']"
          @click="dataFormSubmit(!!dataForm.seckillId)"
          >{{ $t("crud.filter.submitBtn") }}</div
        >
      </el-form-item>
    </el-form>
    <!-- 商品选择弹窗 -->
    <!-- 如果要更改dataUrl，在商品选择组件选择商品后的判断处也要更改一下 -->
    <prods-select
      v-if="prodsSelectVisible"
      ref="prodsSelect"
      :isSingle="true"
      :prodType="0"
      @refreshSelectProds="selectSeckillProd"
    ></prods-select>
  </div>
</template>

<script>
import ProdsSelect from '@/components/prods-select'
import ProdPic from '@/components/prod-pic'
import { Debounce } from '@/utils/debounce'
import { getDateTimeRange, getParseTime } from '@/utils/datetime'
export default {
  data () {
    var validatorDateRange = (rule, value, callback) => {
      if (!this.dataForm.startTime || !this.dataForm.endTime || !this.startTimeValue || !this.endTimeValue) {
        callback(new Error(this.$i18n.t('seckill.pleaheyTime')))
      }
      let startTime = this.dataForm.startTime + ' ' + this.startTimeValue + ':00'
      let endTime = this.dataForm.endTime + ' ' + this.endTimeValue + ':00'
      if (!this.dataForm.seckillId && new Date() > Date.parse(endTime)) {
        callback(new Error(this.$i18n.t('groups.endTime')))
      } else if (Date.parse(endTime) <= Date.parse(startTime)) {
        callback(new Error(this.$i18n.t('groups.endTimeIsTooSmall')))
      } else {
        callback()
      }
    }
    return {
      prodsSelectVisible: false,
      hasMaxNum: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      isEdit: false,
      lang: localStorage.getItem('bbcLang'),
      dataForm: {
        dateRange: [],
        seckillId: null,
        seckillName: null,
        startTime: null,
        endTime: null,
        seckillTag: null,
        maxNum: 1,
        hasMaxNum: false,
        maxCancelTime: 2,
        price: null,
        stocks: null
      },
      prod: null,
      skuList: [],
      isError: false,
      value: '',
      dataRule: {
        // startTime: [
        //   { required: true, message: this.$i18n.t('seckill.timeCanEmpty'), trigger: 'blur' }
        // ],
        seckillName: [
          { required: true, message: this.$i18n.t('seckill.evenBeEmpty'), trigger: 'blur' }
        ],
        maxCancelTime: [
          { required: true, message: this.$i18n.t('seckill.theOrionEmpty'), trigger: 'blur' }
        ],
        startTime: [
          { required: true, validator: validatorDateRange, trigger: 'blur' }
        ]
      },
      startTimeValue: '',
      endTimeValue: ''
    }
  },
  components: {
    ProdsSelect,
    ProdPic
  },
  mounted () {
    const seckillId = this.$route.query.seckillId
    this.init(seckillId)
    let title = !seckillId ? this.$i18n.t('seckill.newSeckill') : this.$i18n.t('seckill.viewSeckill')
    this.$store.commit('common/replaceSelectMenu', title)
  },
  methods: {
    init (seckillId) {
      this.$refs['dataForm'].resetFields()
      this.prod = null
      this.skuList = []
      this.dataForm.seckillId = seckillId || 0
      this.hasMaxNum = false
      let datetimeRange = getDateTimeRange()
      this.dataForm.startTime = datetimeRange.startTime
      this.dataForm.endTime = datetimeRange.endTime
      this.startTimeValue = datetimeRange.currentTime
      this.endTimeValue = datetimeRange.currentTime
      if (this.dataForm.seckillId) {
        this.$http({
          url: this.$http.adornUrl('/seckill/seckill/info/' + this.dataForm.seckillId),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          this.dataForm = data.seckill
          this.startTimeValue = this.dataForm.startTime ? this.dataForm.startTime.substring(11, this.dataForm.startTime.length - 3) : ''
          this.endTimeValue = this.dataForm.endTime ? this.dataForm.endTime.substring(11, this.dataForm.endTime.length - 3) : ''
          this.dataForm.startTime = getParseTime(this.dataForm.startTime, '{y}-{m}-{d}')
          this.dataForm.endTime = getParseTime(this.dataForm.endTime, '{y}-{m}-{d}')
            // this.dataForm.hasMaxNum = !!data.seckill.hasMaxNum
          this.hasMaxNum = data.seckill.maxNum > 0
          this.prod = data.prod
          this.getSkuList(data.prod.prodId, data.seckillSkus)
        })
      }
    },
    switchSet () {
      this.isEdit = !this.isEdit
      if (!this.isEdit) {
        this.dataForm.price = 0
        this.dataForm.stocks = 0
      }
    },
    batchSet () {
      this.skuList.forEach(sku => {
        if (this.dataForm.price) {
          sku.seckillPrice = this.dataForm.price
        }
        if (this.dataForm.stocks) {
          sku.seckillStocks = this.dataForm.stocks
        }
      })
      this.isEdit = false
    },
    getSkuList (prodId, seckillSkus) {
      this.$http({
        url: this.$http.adornUrl('/sku/getAllSkuList'),
        method: 'get',
        params: this.$http.adornParams({
          prodId: prodId
        })
      }).then(({ data }) => {
        if (seckillSkus) {
          data.forEach(sku => {
            seckillSkus.forEach(seckillSku => {
              if (sku.skuId === seckillSku.skuId) {
                sku.seckillStocks = seckillSku.seckillStocks
                sku.seckillPrice = seckillSku.seckillPrice
              }
            })
          })
        }
        data.forEach(sku => {
          sku['rawStatus'] = sku.status
        })
        this.skuList = data
      })
    },
    /**
     * 判断sku中的商品价格与库存是否有填写
     */
    checkSku () {
      this.isError = false
      let disableNum = 0
      this.skuList.forEach(element => {
        if (!element.seckillPrice && element.status === 1) {
          this.isError = true
          this.value = this.$i18n.t('seckill.commoBeEmpty')
          return true
        }
        if (!element.seckillStocks && element.seckillStocks !== 0 && element.status === 1) {
          this.isError = true
          this.value = this.$i18n.t('seckill.commodiBeEmpty')
          return true
        }
        if (element.status === 0) {
          disableNum += 1
        }
      })
      if (disableNum === this.skuList.length) {
        this.isError = true
        this.value = this.$i18n.t('seckill.enableMustOne')
        return true
      }
    },
    // 表单提交
    dataFormSubmit: Debounce(function (status) {
      if (status) {
        return
      }
      // 秒杀不能更新
      if (this.dataForm.seckillId) {
        this.back()
        return
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (!this.prod) {
            this.$message({
              message: this.$i18n.t('seckill.pleaSenProc'),
              type: 'error'
            })
            return
          }
          if (!this.hasMaxNum) {
            this.dataForm.maxNum = -1
          }
          // 判断sku中的商品价格与库存是否有填写
          this.checkSku()
          if (this.isError) {
            this.$message.error(this.value)
            return
          }
          let startTime = this.dataForm.startTime
          let endTime = this.dataForm.endTime
          this.dataForm.startTime = this.dataForm.startTime && this.startTimeValue ? this.dataForm.startTime + ' ' + this.startTimeValue + ':00' : ''
          this.dataForm.endTime = this.dataForm.endTime && this.endTimeValue ? this.dataForm.endTime + ' ' + this.endTimeValue + ':00' : ''
          this.dataForm.prodId = this.prod.prodId
          this.dataForm.seckillSkus = this.skuList.filter(sku => sku.status)

          let paramData = Object.assign({}, this.dataForm)
          paramData.hasMaxNum = this.hasMaxNum ? 1 : 0
          this.$http({
            url: this.$http.adornUrl('/seckill/seckill'),
            method: 'post',
            data: this.$http.adornData(paramData)
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.back()
                this.$emit('refreshDataList')
              }
            })
          })
          this.dataForm.startTime = startTime
          this.dataForm.endTime = endTime
        }
      })
    }),
    // 显示添加指定商品弹框
    prodsSelectHandle () {
      this.prodsSelectVisible = true
      this.$nextTick(() => {
        this.$refs.prodsSelect.init(this.dataForm.discountProds)
      })
    },
    handlerChangeMaxNum (val) {
      if (val) {
        this.dataForm.maxNum = 1
      } else {
        this.dataForm.maxNum = -1
      }
    },
    // 添加指定商品
    selectSeckillProd (prods) {
      if (prods.prodId) {
        if (prods.pic) {
          prods.pic = prods.pic.indexOf('http') > -1 ? prods.pic : this.resourcesUrl + prods.pic
        }
        this.prod = prods
        this.getSkuList(prods.prodId)
      } else {
        this.skuList = []
        this.prod = null
      }
    },
    deleteProd () {
      this.prod = null
      this.skuList = []
    },
    changeSkuStatus (tagIndex) {
      this.skuList[tagIndex].status = this.skuList[tagIndex].status ? 0 : 1
    },
    back () {
      this.$router.push('/seckill-seckill')
    }
  }
}
</script>

<style scoped>
div >>>.is-success .el-input-number__decrease,
div >>>.is-success .el-input-number__increase,
div >>>.is-error .el-input-number__decrease,
div >>>.is-error .el-input-number__increase {
  right: 1px !important;
}
div >>>.el-date-editor .el-range-separator {
  width: 8%;
  line-height: 32px;
}
.form-box {
  margin-left: 40px;
}
.seckill-name-input >>>.el-input__inner {
  padding-right: 45px !important;
}
.el-date-editor >>>.el-input__suffix>.el-icon-circle-close {
  display: none
}
.el-date-editor >>>.el-input__suffix>.el-icon-circle-check {
  display: none
}
</style>
