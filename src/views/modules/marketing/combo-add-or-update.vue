<template>
  <div class="mod-coupon-add-or-update">
    <div class="new-page-title">
      <div class="line" />
      <div class="text">
        {{
          dataForm.comboId
            ? (pageType === 1 ? this.$i18n.t('combo.editCombo') : this.$i18n.t('combo.viewCombo'))
            : this.$i18n.t('combo.addCombo')
        }}
      </div>
    </div>
    <el-form @submit.native.prevent
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      class="form-box"
      label-width="auto"
    >
      <!--套餐名称-->
      <el-form-item
        :label="this.$i18n.t('combo.name') + ':'"
        prop="name"
      >
        <el-input
          :disabled="pageType === 2"
          v-model="dataForm.name"
          maxlength="20"
          show-word-limit
          style="width: 514px"
          size="small"
          class="coupon-input"
          :placeholder="this.$i18n.t('combo.name')"
        ></el-input>
      </el-form-item>
      <!--活动时间-->
      <el-form-item :label="this.$i18n.t('marketing.activTime')+':'" :required="true">
        <div class="date-picker">
          <!--开始时间-->
          <el-form-item prop="startTime">
            <el-date-picker
              :disabled="pageType === 2"
              v-model="dataForm.startTime"
              type="date"
              size="small"
              :placeholder="this.$i18n.t('live.chooseStartDate')"
              value-format="yyyy-MM-dd"
              style="width:140px"
            ></el-date-picker>
            <el-time-select
              v-model="startTimeValue"
              :picker-options="{
                start: '00:00',
                step: '00:30',
                end: '23:30'
              }"
              size="small"
              style="width:100px"
              :disabled="pageType === 2"
              :placeholder="this.$i18n.t('time.startTime')">
            </el-time-select>
          </el-form-item>
          <span style="margin: 0 10px">{{ this.$i18n.t('time.tip') }}</span>
          <!--结束时间-->
          <el-form-item prop="endTime">
            <el-date-picker
              :disabled="pageType === 2"
              v-model="dataForm.endTime"
              type="date"
              size="small"
              :placeholder="this.$i18n.t('live.chooseEndDate')"
              value-format="yyyy-MM-dd"
              style="width:140px"
            ></el-date-picker>
            <el-time-select
              v-model="endTimeValue"
              :picker-options="{
                start: '00:00',
                step: '00:30',
                end: '23:30'
              }"
              size="small"
              style="width:100px"
              :disabled="pageType === 2"
              :placeholder="this.$i18n.t('time.startTime')">
            </el-time-select>
          </el-form-item>
        </div>
      </el-form-item>
      <!--活动状态-->
<!--      <el-form-item-->
<!--        :label="this.$i18n.t('combo.comboStatus')+':'"-->
<!--        prop="status"-->
<!--        v-if="dataForm.status === 1 || dataForm.status === 0"-->
<!--        :required="true"-->
<!--      >-->
<!--        <el-radio-group v-model="dataForm.status">-->
<!--          <el-radio :label="1">{{ $t("groups.turnOn") }}</el-radio>-->
<!--          <el-radio :label="0">{{ $t("station.close") }}</el-radio>-->
<!--        </el-radio-group>-->
<!--      </el-form-item>-->
      <!--套餐主商品-->
      <el-form-item
        :label="this.$i18n.t('combo.comboMainProd') + ':'"
        size="mini"
        :required="true"
      >
        <!--主商品表格-->
        <comboProdTable
          ref="mainProdTable"
          :pageType="pageType"
          :type="1"
          :limit="1"
          :mold="1"
          :mainProdId="matchProdId"
          @refreshSelectProds="selectMainProd"
          @refreshDeleteHandle="deleteHandle"
        ></comboProdTable>
      </el-form-item>
      <!--套餐搭配商品-->
      <el-form-item
        :label="this.$i18n.t('combo.comboMatchingProd') + ':'"
        size="mini"
      >
        <!--搭配商品表格-->
        <comboProdTable
          ref="matchingProdTable"
          :pageType="pageType"
          :type="2"
          :limit="4"
          :isActive="1"
          :ban-sku-ids="mainSkuIds"
          :mainProdId="mainProdId"
          @refreshSelectProds="selectMatchingProds"
          @refreshDeleteHandle="deleteMatchHandle"
        ></comboProdTable>
      </el-form-item>
      <el-form-item>
        <div class="default-btn" @click="back()">{{
            $t("shopFeature.edit.back")
          }}</div>
        <div v-if="pageType === 1" class="default-btn primary-btn" @click="dataFormSubmit()">{{
            $t("crud.filter.submitBtn")
          }}</div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import comboProdTable from './combo-prod-table'
import ImgUpload from '@/components/img-upload'
import { getDateTimeRange, getParseTime } from '@/utils/datetime'
export default {
  data () {
    var validName = (rule, value, callback) => {
      if (!value.trim()) {
        callback(new Error(this.$i18n.t('combo.nameNotEmpty')))
      } else {
        callback()
      }
    }
    var validateTime = (rule, value, callback) => {
      if (rule.field === 'startTime' && (!this.startTimeValue || !this.dataForm.startTime)) {
        callback(new Error(this.$i18n.t('formData.startTimeCannotBeEmpty')))
      }
      if (rule.field === 'endTime' && (!this.endTimeValue || !this.dataForm.endTime)) {
        callback(new Error(this.$i18n.t('formData.endTimeCannotBeEmpty')))
      }
      let startTime = this.dataForm.startTime + ' ' + this.startTimeValue + ':00'
      let endTime = this.dataForm.endTime + ' ' + this.endTimeValue + ':00'
      if (rule.field === 'startTime' && Date.parse(startTime) >= Date.parse(endTime)) {
        callback(new Error(this.$i18n.t('marketing.timeCanThanOrEqualTo')))
      }
      if ((this.dataForm.comboId === 0 || this.dataForm.status === 1) && rule.field === 'endTime' && new Date() > Date.parse(endTime)) {
        callback(new Error(this.$i18n.t('groups.endTime')))
      } else {
        callback()
      }
    }
    return {
      dataForm: {
        comboId: 0,
        name: '',
        startTime: '',
        endTime: '',
        mainProd: '',
        matchingProds: []
      },
      pageType: 1, // 1：新增/编辑 2：查看
      mainSkuIds: [], // 主商品skuId列表
      mainProdId: [], // 主商品id
      mainProdIds: [],
      matchProdId: [], // 搭配商品id
      matchingSkuIds: [], // 搭配商品skuId列表
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      errorTip: false,
      dataListSelections: [],
      prodsSelectVisible: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      dataRule: {
        name: [
          { required: true, message: this.$i18n.t('combo.nameNotEmpty'), trigger: 'blur' },
          { validator: validName, trigger: 'blur' }
        ],
        activityDate: [
          { required: true, message: this.$i18n.t('shop.titCanNoBlank'), trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: this.$i18n.t('formData.startTimeCannotBeEmpty'), trigger: 'blur' },
          { validator: validateTime, trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: this.$i18n.t('formData.endTimeCannotBeEmpty'), trigger: 'blur' },
          { validator: validateTime, trigger: 'blur' }
        ]
      },
      startTimeValue: '',
      endTimeValue: ''
    }
  },
  components: {
    ImgUpload,
    comboProdTable
  },
  mounted () {
    const comboId = this.$route.query.comboId ? this.$route.query.comboId : 0
    const pageType = this.$route.query.pageType ? this.$route.query.pageType : 1
    this.init(parseInt(comboId))
    this.pageType = parseInt(pageType)
    let title = parseInt(comboId) ? (this.pageType === 1 ? this.$i18n.t('combo.editCombo') : this.$i18n.t('combo.viewCombo')) : this.$i18n.t('combo.addCombo')
    this.$store.commit('common/replaceSelectMenu', title)
  },
  methods: {
    // 获取数据列表
    init (comboId) {
      this.dataForm.comboId = comboId || 0
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
        let datetimeRange = getDateTimeRange()
        this.dataForm.startTime = datetimeRange.startTime
        this.dataForm.endTime = datetimeRange.endTime
        this.startTimeValue = datetimeRange.currentTime
        this.endTimeValue = datetimeRange.currentTime
        if (this.dataForm.comboId && this.dataForm.comboId !== '0') {
          this.getDataInfo()
        }
      })
    },
    // 获取套餐信息
    getDataInfo () {
      this.$http({
        url: this.$http.adornUrl(`/shop/combo/info/${this.dataForm.comboId}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.dataForm = data
        this.startTimeValue = this.dataForm.startTime ? this.dataForm.startTime.substring(11, this.dataForm.startTime.length - 3) : ''
        this.endTimeValue = this.dataForm.endTime ? this.dataForm.endTime.substring(11, this.dataForm.endTime.length - 3) : ''
        this.dataForm.startTime = getParseTime(this.dataForm.startTime, '{y}-{m}-{d}')
        this.dataForm.endTime = getParseTime(this.dataForm.endTime, '{y}-{m}-{d}')
        if (data.matchingProds.length) {
          data.matchingProds.forEach(item => {
            this.matchProdId.push(item.prodId)
          })
        }
        this.mainProdId.push(data.mainProdId)

        this.$forceUpdate()
        this.$refs.mainProdTable.init([data.mainProd])
        this.$refs.matchingProdTable.init(data.matchingProds)
      })
    },
    // 主商品选择更新回调
    selectMainProd (prodItems) {
      if (!prodItems.length) {
        return
      }
      if (this.mainProdId.length) {
        let id = this.mainProdId.find((value) => {
          return value === prodItems[0].prodId
        })
        if (id === undefined) { this.mainProdId.push(prodItems[0].prodId) }
      } else {
        this.mainProdId.push(prodItems[0].prodId)
      }
    },
    // 主删除商品回调
    deleteHandle (id) {
      let findIndex = this.mainProdId.findIndex(item => { return item === id })
      this.mainProdId.splice(findIndex, 1)
    },
    // 搭配删除商品回调
    deleteMatchHandle (id) {
      let findIndex = this.matchProdId.findIndex(item => { return item === id })
      this.matchProdId.splice(findIndex, 1)
    },
    // 搭配商品选择更新回调
    selectMatchingProds (prodItems) {
      if (this.matchProdId.length) {
        // prodItems.forEach(item => {
        //   let flag = this.matchProdId.some(itemC => {
        //     return item.prodId === itemC
        //   })
        //   if (!flag) { this.matchProdId.push(item.prodId) }
        // })
        this.matchProdId = prodItems.map(x => x.prodId)
      } else {
        prodItems.forEach(item => {
          this.matchProdId.push(item.prodId)
        })
      }
    },
    // 表单提交
    dataFormSubmit () {
      if (this.isSubmit) {
        return
      }
      this.isSubmit = true
      this.$refs['dataForm'].validate((valid) => {
        let mainProds = this.$refs.mainProdTable.verifyDataForm()
        let matchingProds = this.$refs.matchingProdTable.verifyDataForm()
        if (!mainProds || !matchingProds) {
          this.isSubmit = false
          return
        }
        if (mainProds[0].leastNum <= 1 && matchingProds.length === 0) {
          this.$message({
            message: this.$i18n.t('tip.select') + this.$i18n.t('combo.comboMatchingProd'),
            type: 'warning',
            duration: 1500
          })
          this.isSubmit = false
          return
        }
        if (valid) {
          let startTime = this.dataForm.startTime
          let endTime = this.dataForm.endTime
          this.dataForm.startTime = this.dataForm.startTime && this.startTimeValue ? this.dataForm.startTime + ' ' + this.startTimeValue + ':00' : ''
          this.dataForm.endTime = this.dataForm.endTime && this.endTimeValue ? this.dataForm.endTime + ' ' + this.endTimeValue + ':00' : ''
          this.$http({
            url: this.$http.adornUrl(`/shop/combo`),
            method: this.dataForm.comboId && this.dataForm.comboId !== '0' ? 'put' : 'post',
            data: this.$http.adornData({
              'comboId': this.dataForm.comboId || undefined,
              'name': this.dataForm.name,
              'startTime': this.dataForm.startTime,
              'endTime': this.dataForm.endTime,
              'status': this.dataForm.status,
              'mainProd': mainProds[0],
              'matchingProds': matchingProds
            })
          }).then(({ data }) => {
            this.$message({
              message: this.$i18n.t('publics.operation'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.isSubmit = false
                this.back()
              }
            })
          }).catch(({ e }) => {
            this.isSubmit = false
          })
          this.dataForm.startTime = startTime
          this.dataForm.endTime = endTime
        } else {
          this.isSubmit = false
        }
      })
    },
    back () {
      this.$router.push('/marketing-combo')
    }
  }
}
</script>
<style lang="scss" scoped>
.mod-coupon-add-or-update {
  .el-col{
    width: 130px;
  }
  .coupon-input {
    width: 220px;
  }
  .coupon-input1 {
    width: 220px;
  }
  .form-box {
    margin-left: 40px;
  }
}
.date-picker {
  display: flex;
  .el-form-item.el-form-item--small {
    margin-bottom: 0;
  }
}
.el-date-editor >>>.el-input__suffix>.el-icon-circle-close {
  display: none
}
.el-date-editor >>>.el-input__suffix>.el-icon-circle-check {
  display: none
}
</style>
