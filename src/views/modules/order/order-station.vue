<template>
  <el-dialog
    :title="order.orderMold === 1 ? this.$i18n.t('order.orderWriteOff'):this.$i18n.t('order.orderPickupS')"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="60%"
  >
    <div class="mod-order-orderInfo">
      <el-table
        ref="multipleTable"
        :data="dataList"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column
          prop="changeNum"
          :label="this.$i18n.t('product.pic')"
          fit
          width="100"
        >
          <template slot-scope="scope">
            <ImgShow :src="scope.row.pic" :imgStyle="{width:'50px'}" />
          </template>
        </el-table-column>
        <el-table-column :label="this.$i18n.t('product.prodName')" fit>
          <template slot-scope="scope">
            {{ scope.row.prodName }}
            <div
              class="order-status"
              v-if="
                scope.row.returnMoneySts !== null &&
                scope.row.returnMoneySts > 0 &&
                scope.row.returnMoneySts < 6
              "
            >
              {{ $t("order.reimburse") }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="prodCount"
          :label="this.$i18n.t('order.amountOfGoods')"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="status"
          :label="this.$i18n.t('product.status')"
          show-overflow-tooltip
          width="250"
        >
          <template slot-scope="scope">
            <!-- <template slot-scope="scope">{{ scope.row.status }}</template> -->
            <div  v-if="order.orderMold !== 1">
              <span
                v-if="
                  scope.row.returnMoneySts !== null &&
                  scope.row.returnMoneySts < 6 &&
                  scope.row.returnMoneySts > 0
                "
                class="tag-text"
              >
                {{
                  [
                    "",
                    $t("order.buyerApplication"),
                    $t("order.sellerAccepts"),
                    $t("order.buyShipment"),
                    $t("order.sellerReceipt"),
                    $t("order.refundsuccessfully"),
                  ][scope.row.returnMoneySts]
                }}
              </span>

              <span
                class="tag-text"
                v-else-if="scope.row.status !== 0 && scope.row.status !== -1"
                >{{ $t("order.pendingPickUp") }}
              </span>
              <span class="tag-text" v-else-if="scope.row.status === 0">{{
                $t("order.shipmentCompleted")
              }}</span>
              <span
                class="tag-text"
                v-else-if="scope.row.status === -1"
                >{{ $t("order.toBeShipped") }}
              </span>
            </div>
            <div  v-else>
              <span
                v-if="order.status === 3"
                class="tag-text"
              >{{
                $t("order.waitWriteOff")
              }}</span>
              <span
                v-else
                class="tag-text"
              >{{
                $t("order.commoditful")
              }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- :rules="dataRule" -->
    <el-form @submit.native.prevent
      :model="dataForm"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="100px"
    >
      <div class="detail-cont">
        <div class="detail01">
          <div class="text-width" v-if="order.orderMold !== 1">
            <el-form-item
              :label="this.$i18n.t('order.shippingInformation') + ':'"
            >
              <span
                >{{ $t("order.delType") }}：{{
                  $t("order.selfMention")
                }}</span
              >
            </el-form-item>
            <el-form-item label>
              <span
                >{{ $t("publics.addressee") }}：{{
                  dataForm.stationUserName
                }}</span
              >
            </el-form-item>
            <el-form-item label>
              <span
                >{{ $t("publics.mobilePhone") }}：{{
                  dataForm.stationUserMobile
                }}</span
              >
            </el-form-item>
            <el-form-item label>
              <span
                >{{ $t("station.stationAddr") }}：{{
                  dataForm.stationAddress
                }}</span
              >
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
    <!-- :rules="dataRule" -->
    <el-form @submit.native.prevent
      :model="dataForm"
      ref="dataForm"
      @keyup.enter.native="submitProds()"
      label-width="auto"
      size="small"
      class="code-input-box"
    >
      <div class="detail-cont">
        <el-form-item
          :label="this.$i18n.t('order.selfMentionCode') + '：'"
          prop="code"
        >
          <el-input
            v-model="code"
            :placeholder="this.$i18n.t('order.pleEntPickupCode')"
            @change="checkStationCode"
            class="code-int"
          ></el-input>
          <!-- <el-button size="small" @click="checkStationCode">校验自提码</el-button> -->
          <el-button
            type="success"
            icon="el-icon-check"
            circle
            plain
            size="mini"
            v-if="order.orderMold !== 1 && isStationCode === 1"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-close"
            circle
            plain
            size="mini"
            v-if="order.orderMold !== 1 && isStationCode === 2"
          ></el-button>
          <el-alert
            :title="order.orderMold === 1 ?
              this.$i18n.t('order.doNotEntPickupCode2')
              :this.$i18n.t('order.doNotEntPickupCode1')"
            type="warning"
            :closable="false"
            class="code-int-tips"
          ></el-alert>
        </el-form-item>
      </div>
    </el-form>
    <span slot="footer">
      <div class="default-btn" @click="visible = false">{{
        $t("crud.filter.cancelBtn")
      }}</div>
      <div class="default-btn primary-btn" @click="submitProds()">{{
        order.orderMold === 1 ? $t("order.Writeoffs") : $t("order.pickUp")
      }}</div>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      isDvy: false,
      dataForm: {},
      code: '',
      order: {},
      isStationCode: 0,
      dataList: [],
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL
    }
  },
  components: {},
  mounted () {
  },
  methods: {
    processingStr (str) {
      // str = str.replace(/\u200B/g,'');
      // return str
    },

    /**
     * 获取数据列表
     */
    init (order) {
      this.isSubmit = false
      this.visible = true
      this.code = ''
      this.isStationCode = 0
      this.orderNumber = order.orderNumber
      this.order = order
      this.orderId = order.orderId
      this.clear()
      if (order.orderMold !== 1) {
        // 修改
        this.$http({
          url: this.$http.adornUrl(`/admin/station/getOrderItemAndStationInfo`),
          method: 'get',
          params: this.$http.adornParams({
            orderNumber: order.orderNumber
          })
        }).then(({ data }) => {
          this.dataForm = data
          this.dataList = data.orderItems
        })
      } else {
        // 修改
        this.$http({
          url: this.$http.adornUrl(`/order/order/orderInfo/` + order.orderNumber),
          method: 'get'
        }).then(({ data }) => {
          this.dataForm = data
          this.dataList = data.orderItems
        })
      }
    },
    clear () {
      this.dataForm.dvyFlowId = 0
      this.dataForm.dvyId = ''
    },
    /**
     * 校验自提码
     */
    checkStationCode () {
      if (this.code === this.dataForm.stationCode || !this.code) {
        this.isStationCode = 1
      } else {
        this.isStationCode = 2
      }
    },
    /**
     * 提货事件
     */
    submitProds () {
      this.code = this.code.trim()
      if (this.isStationCode === 2 && this.order.orderMold !== 1) {
        this.errorMsg(this.$i18n.t('order.pickupCodeError'))
        return
      }
      if (this.isSubmit) {
        return
      }
      this.isSubmit = true
      // let param = this.dataForm
      if (this.order.orderMold !== 1) {
        this.$http({
          url: this.$http.adornUrl(`/admin/station/changeStatusAndOrderStation`),
          method: 'put',
          data: this.$http.adornData({
            'orderNumber': this.dataForm.orderNumber,
            'stationId': this.dataForm.stationId
          })
        }).then(({ data }) => {
          this.$message({
            message: this.$i18n.t('publics.operation'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshOrderStationDataList')
            }
          })
        }).catch(({ e }) => {
          this.isSubmit = false
        })
      } else {
        this.virtualProdWriteOff()
      }
    },
    virtualProdWriteOff () {
      this.$http({
        url: this.$http.adornUrl(`/admin/station/orderWriteOffByOrderNumber`),
        method: 'put',
        data: this.$http.adornData({
          'orderNumber': this.dataForm.orderNumber,
          'writeOffCode': this.code
        })
      }).then(({ data }) => {
        this.$message({
          message: this.$i18n.t('publics.operation'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.visible = false
            this.$emit('refreshOrderStationDataList')
          }
        })
      }).catch(({ e }) => {
        this.isSubmit = false
      })
    },
    errorMsg (message) {
      this.$message({
        message: message,
        type: 'error',
        duration: 1500
      })
    }
  }
}
</script>

<style>
.el-input__inner {
  border: 1px solid #dcdfe6 !important;
}
</style>
<style scoped>
.mod-order-orderInfo {
  height: 100%;
  width: 100%;
  font: 14px Arial, "PingFang SC", "Hiragino Sans GB", STHeiti,
    "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
  color: #495060;
}

.element.style {
  border-top: 1px solid #eeeeee;
  border-right: 1px solid #eeeeee;
  border-bottom: 1px solid #eeeeee;
}

.prods-select-body {
  height: auto;
  overflow: auto;
  border-top: 1px solid #eeeeee;
  border-right: 1px solid #eeeeee;
  border-bottom: 1px solid #eeeeee;
}

.mod-order-order .contprod-:last-child {
  border-bottom: 0;
  border-left: 0;
}

.mod-order-order .prod-cont.prod-bottom,
.mod-order-order .prod-cont {
  border-bottom: 1px solid #dddee1;
  border-left: 1px solid #dddee1;
}

.code-input-box {
  margin-top: 20px;
}
.code-input-box .code-int {
  max-width: 60%;
}
.code-input-box .code-int-tips {
  max-width: 60%;
  line-height: 1em;
  margin-top: 5px;
}
.code-input-box .code-int-tips.el-alert {
  padding: 15px;
}
.code-input-box .code-int-tips >>> .el-alert__content {
  padding: 0;
}
</style>
