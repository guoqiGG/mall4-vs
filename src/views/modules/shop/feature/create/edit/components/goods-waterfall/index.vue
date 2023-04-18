<template>
  <div class="micro-goods-box">
    <div class="design-preview-controller">
      <div class="goods-list">
        <template v-if="goodsList.length">
          <div 
            class="goods-li" 
            v-for="(item, index) in goodsList" 
            :key="index" 
            :class="{isGoodCell3:formData.size === 3, isGoodCell1:formData.size === 1}">
            <div class="goods-li-box" :class="{'no-goods-price':!formData.showContent.find(x=>x===3)&&formData.showContent.find(x=>x===4)}">
              <div class="goods-item" :class="{goodsItem1:formData.size === 1}">
                <!--图片-->
                <el-image 
                  :style="{width: formData.size===3 ? 90 + 'px' : 152 + 'px', height: formData.size!==1 ? (formData.size===3 ? 90 + 'px' : 152 + 'px') : '', margin: formData.size!==1?'0 auto' : ''}"
                  class="goods-img-one" 
                  :class="{goodsImgOne1:formData.size === 1, 'goods-empty': !goodsList[0].prodId}"
                  :src="item.pic" fit="fill">
                    <div slot="error" class="image-slot">
                        <img src="@/assets/img/pc-micro-page/show-default.png" fit="fill">
                    </div>
                </el-image>
                <!-- 下架商品蒙版 start -->
                <div class="imgs_shelves" v-if="item.status != 1">
                    <img class="been_imgs" src="@/assets/img/pc-micro-page/been_shelves.png" >
                </div>
                
                <div class="goods-box-info" :class="{goodsBoxInfo1:formData.size === 1}">
                  <div v-if="formData.showContent.find(x=>x===1)" class="goods-info-title">{{ item.prodName }}</div>
                  <div v-if="formData.showContent.find(x=>x===2)" class="goods-info-desc">{{ item.brief }}</div>
                  <div 
                    v-if="formData.showContent.find(x=>x===3)||formData.showContent.find(x=>x===4)"
                    class="goods-info-price "
                    :class="{'goods-cell-3':formData.showContent.find(x=>x===4)}">
                    <div v-if="formData.showContent.find(x=>x===3)" class="price-info"><span>¥</span>{{ item.price }}</div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </template>
        <template v-else>
          <div v-for="(item,index) in goodsList" :key="index" class="goods-li"
             :class="{isGoodCell3:formData.size === 3, isGoodCell1:formData.size === 1}">
            <div class="goods-li-box" :class="{'no-goods-price':!formData.showContent.find(x=>x===3)&&formData.showContent.find(x=>x===4)}">
                <div class="goods-item" :class="{goodsItem1:formData.size === 1}">
                <!--图片-->
                <div class="goods-img-one"
                    :class="{goodsImgOne1:formData.size === 1, 'goods-empty': !goodsList[0].prodId}"
                    :style="{backgroundImage:'url('+(item.pic || defImg)+')'}"></div>
                <!--end 图片-->
                <div class="goods-box-info"
                    :class="{goodsBoxInfo1:formData.size === 1}">
                  <div v-if="formData.showContent.find(x=>x===1)"
                      class="goods-info-title">{{ item.prodName }}
                  </div>
                  <div v-if="formData.showContent.find(x=>x===2)&&item.brief"
                      class="goods-info-desc">
                    {{ item.brief }}
                  </div>
                  <div v-if="formData.showContent.find(x=>x===3)||formData.showContent.find(x=>x===4)"
                      class="goods-info-price "
                      :class="{'goods-cell-3':formData.showContent.find(x=>x===4)}">
                    <div v-if="formData.showContent.find(x=>x===3)"
                        class="price-info"><span>¥</span>{{ item.price }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <!-- <div class="empty-tips"
             v-if="goodsList.length==0">
          {{$t('shopFeature.goods.pleaseAddProd')}}
        </div> -->
      </div>
    </div>

    <div v-if="isShowEdit"
         class="design-editor-item design-hide-class">
      <div class="design-config-editor">
        <div class="design-editor-component-title">{{$t('shopFeature.allCanUse.goodsWaterfall')}}</div>
        <!--选择商品-->
        <div class="design-editor-component-container">
          <el-form @submit.native.prevent ref="formData" :model="formData" label-position="left" class="goods-select-form">
            <el-form-item :label="$i18n.t('shopFeature.goods.listStyle')">
              <el-radio-group v-model="formData.size">
                <el-radio v-for="(count, index) in lineSize" :label="count.value" :key="index">{{count.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$i18n.t('shopFeature.goods.showContent')" class="goods-show-container">
              <div class="goods-show-content">
                <el-checkbox-group v-model="formData.showContent">
                <el-checkbox v-for="(showItem, index) in goodsShowContent" :key="index" :label="showItem.value">{{showItem.label}}</el-checkbox>
              </el-checkbox-group>
              </div>
            </el-form-item>
            <el-form-item :label="$i18n.t('shopFeature.goodsWaterfall.sortType')">
              <el-radio-group v-model="formData.sortType" @input="changeSortType">
                <el-radio v-for="(item, index) in sortTypeList" :label="item.value" :key="index">{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="formData.sortType !== 0" :label="$i18n.t('shopFeature.goodsWaterfall.timeType')" class="goods-show-container">
              <el-radio-group v-model="formData.timeType" @input="changeTimeType">
                <el-radio v-for="(item, index) in timeList" :label="item.value" :key="index">{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$i18n.t('shopFeature.goodsWaterfall.timeStatus')">
              <el-radio-group v-model="formData.sortStatus" @input="changeSortStatus">
                <el-radio v-for="(item, index) in sortStatus" :label="item.value" :key="index">{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * 创建新组件之后，在all-can-use-components中添加
 * 必须应用 microCreateMinis
 * 数据必须以formData包含
 * */
import { microCreateMinis } from '../../minis'
/** 商品组件 */
export default {
  name: 'micro-goods-box',
  mixins: [microCreateMinis],
  data () {
    return {
      commonCheckFieldRules: 'checkData', // 当前组件默认的规则判断函数
      // dialogChooseGoods: false,
      isGetChooseData: false, // 是否该是获取选择的数据
      formData: {
        size: 2, // 一行多少个
        showContent: [1, 2, 3],
        sortType: 0,
        timeType: 0,
        sortStatus: 1
        // buy_btn_type: 1, // 购买按钮的样式
        // button_text: '马上抢'// 购买按钮的文本
      },
      // 商品显示内容
      goodsShowContent: [
        {
          value: 1,
          label: this.$i18n.t('shopFeature.goods.prodName')
        },
        {
          value: 2,
          label: this.$i18n.t('shopFeature.goods.prodDesc')
        },
        {
          value: 3,
          label: this.$i18n.t('shopFeature.goods.prodPrice')
        }],
      // 一行几个
      lineSize: [
        {
          value: 1,
          label: this.$i18n.t('shopFeature.goods.oneLineItem1')
        },
        {
          value: 2,
          label: this.$i18n.t('shopFeature.goods.oneLineItem2')
        },
        {
          value: 3,
          label: this.$i18n.t('shopFeature.goods.oneLineItem3')
        }
      ],
      sortTypeList: [
        {
          value: 0,
          label: this.$i18n.t('shopFeature.goodsWaterfall.shelfTime')
        },
        {
          value: 1,
          label: this.$i18n.t('shopFeature.goodsWaterfall.salesVolume')
        },
        {
          value: 2,
          label: this.$i18n.t('shopFeature.goodsWaterfall.commentCount')
        }
      ],
      timeList: [
        {
          value: 0,
          label: this.$i18n.t('stock.all')
        },
        {
          value: 1,
          label: this.$i18n.t('shopFeature.goodsWaterfall.lastYear')
        },
        {
          value: 2,
          label: this.$i18n.t('shopFeature.goodsWaterfall.threeMonths')
        },
        {
          value: 3,
          label: this.$i18n.t('shopFeature.goodsWaterfall.lastMonth')
        },
        {
          value: 4,
          label: this.$i18n.t('shopFeature.goodsWaterfall.lastWeek')
        }
      ],
      sortStatus: [
        {
          value: 0,
          label: this.$i18n.t('shopFeature.goodsWaterfall.ascendingOrder')
        },
        {
          value: 1,
          label: this.$i18n.t('shopFeature.goodsWaterfall.descendingOrder')
        }
      ],
      // 获取的接口数据
      goodsList: [],
      // 默认数据
      demoGoods: [],
      // dialogVisible: false, // 商品弹窗
      echoDataList: [] // 回显商品数据
    }
  },
  props: {
    current: {
      type: Number
    }
  },
  watch: {
    'formData.sortType' () {
      if (this.isFirst) this.getGoodsInfo()
    },
    'formData.sortStatus' () {
      if (this.isFirst) this.getGoodsInfo()
    },
    'formData.timeType' () {
      if (this.isFirst) this.getGoodsInfo()
    }
  },
  filters: {
    buy_btn_type (val) { // 标题
      let str = ''
      switch (val) {
        case 6:
          str = 'danger'
          break
        case 8:
          str = 'danger'
          break
      }
      return str
    }
  },
  components: {
  },
  computed: {
    theme () {
      return this.$store.getters.theme
    }
  },
  mounted () {
    // 变更数据，保存初始装修数据
    this.formData.sortStatus = 0
    this.getGoodsInfo()
  },
  methods: {
    changeSortType (val) {
      if (val === 0) {
        this.formData.timeType = 0
      }
      this.getGoodsInfo()
    },
    changeTimeType () {
      this.getGoodsInfo()
    },
    changeSortStatus () {
      this.getGoodsInfo()
    },
    /** 批量获取商品详情 */
    getGoodsInfo () {
      // this.goodsList = []
      this.$http({
        url: this.$http.adornUrl('/admin/search/prod/renovationPage'),
        method: 'get',
        params: this.$http.adornParams({
          current: 1,
          size: 20,
          mustNotProdTypes: 3,
          status: 1,
          isActive: 1,
          esRenovationSpuSort: this.dealSortType(this.formData.sortType, this.formData.sortStatus),
          showSpuType: 1, // 展示商品类型 0.展示指定的商品ids 1.展示瀑布流商品集合
          esTimeRange: this.formData.timeType
        })
      }).then(({ data }) => {
        // this.goodsList = this.sortList(data)
        this.goodsList = data.records
        this.goodsList.forEach(item => {
          if (item.pic && !item.pic.includes('http')) {
            item.pic = process.env.VUE_APP_RESOURCES_URL + item.pic
          }
        })
      })
    },
    // 处理升降序
    dealSortType (type, status) {
      let res = 0
      switch (type) {
        case 0:
          res = status === 0 ? 0 : 1
          break
        case 1:
          res = status === 0 ? 3 : 2
          break
        case 2:
          res = status === 0 ? 5 : 4
          break
      }
      return res
    },
    /**
     * 按照添加的顺序排序
     */
    sortList (goodsList) {
      let showArr = this.dataField.goods
      goodsList.forEach(item => {
        item.sortId = showArr.indexOf(item.prodId)
      })
      return goodsList.sort((a, b) => { return a.sortId - b.sortId })
    },
    /* 校验 */
    checkData () {
      // if (this.formData.goods.length > 0) {
      this.myCheckResult(true)
      // } else {
      //   this.$newMessage.error(this.$i18n.t('shopFeature.allCanUse.goodsList') + this.current + this.$i18n.t('shopFeature.goods.pleaseAddProd'))
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
