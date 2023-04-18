<template>
  <el-dialog
    :title="!dataForm.stockChangeReasonId ? this.$i18n.t('crud.addTitle') : this.$i18n.t('crud.updateBtn')"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="150px">
      <!-- 出入库类别 -->
      <el-form-item :label="this.$i18n.t('stock.stockType')" prop="type">
        <el-radio v-model="dataForm.type" :label="1" :value="1">{{ this.$i18n.t('stock.sendStock') }}</el-radio>
        <el-radio v-model="dataForm.type" :label="2" :value="2">{{ this.$i18n.t('stock.receiveStock') }}</el-radio>
      </el-form-item>
      <!-- 语言选择 -->
      <el-form-item :label="$t('product.chooseLanguage')" v-if="langItemList.length > 1">
        <el-select v-model="curLang" multiple :placeholder="$t('tip.select')" @change='selectLang' style="width: 100%;">
          <el-option  v-for="item in langItemList" :key="item.lang" :label="item.name" :value="item.lang"></el-option>
        </el-select>
      </el-form-item>
      <!-- 出入库原因 -->
      <template>
        <div v-for="item in stockChangeReasonLangList">
          <el-form-item :label="$i18n.t('stock.stockBillReason') + (langItemList.length === 1 ? '' : `(${item.langName})`)">
            <el-input v-model="item.reason" maxlength="10" type="text"></el-input>
          </el-form-item>
        </div>
      </template>
      <!-- 备注 -->
      <template>
        <div v-for="(item,index) in stockChangeReasonLangList" :key="index">
          <el-form-item :label="$i18n.t('stock.remark') + (langItemList.length === 1 ? '' : `(${item.langName})`)">
            <el-input v-model="item.remark" maxlength="10" type="text"></el-input>
          </el-form-item>
        </div>
      </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{ this.$i18n.t('order.cancel') }}</div>
      <div class="default-btn primary-btn" @click="dataFormSubmit()">{{ this.$i18n.t('order.confirm') }}</div>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          type: 1,
          reasonCn: null,
          reasonEn: null,
          status: null,
          remarkCn: null,
          remarkEn: null
        },
        // 语言列表
        langItemList: [],
        masterLangInfo: {name: '', lang: ''},
        // 当前所选语言
        curLang: [],
        stockChangeReasonLangList: [],
        dataRule: {
          type: [
            { required: true, message: this.$i18n.t('stock.stockTypeNotEmpty'), trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (stockChangeReasonId, type) {
        this.dataForm.stockChangeReasonId = stockChangeReasonId || 0
        this.dataForm.reasonCn = null
        this.dataForm.reasonEn = null
        this.dataForm.status = null
        this.dataForm.remarkCn = null
        this.dataForm.remarkEn = null
        this.visible = true
        this.stockChangeReasonLangList = []
        if (!stockChangeReasonId) {
          this.dataForm.type = type === 2 ? 2 : 1
          this.getLangList()
        } else {
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
            if (this.dataForm.stockChangeReasonId) {
              this.$http({
                url: this.$http.adornUrl('/shop/stockChangeReason/info/' + this.dataForm.stockChangeReasonId),
                method: 'get',
                params: this.$http.adornParams()
              }).then(({data}) => {
                this.dataForm.type = data.type
                this.dataForm.status = data.status
                this.stockChangeReasonLangList = data.stockChangeReasonLangList
                this.getLangList()
              })
            } else {
              this.getLangList()
            }
          })
        }
      },
      getLangList () {
        this.$http({
          url: this.$http.adornUrl('/sys/lang'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          console.log('初始化国际化配置', data)
          if (data) {
            const info = data
            this.masterLangInfo.name = info.name
            this.masterLangInfo.lang = info.lang
            this.langItemList = info.langItemList
            // 设置默认主语言
            if (!this.stockChangeReasonLangList) {
              this.selectLang([info.lang])
            } else {
              // 初始化所选语言
              let curLang = []
              let stockChangeReasonLangList = []
              for (const item of this.langItemList) {
                const fd = this.stockChangeReasonLangList.find(it => it.lang === item.lang)
                if (fd) {
                  fd.langName = item.name
                  stockChangeReasonLangList.push(fd)
                  console.log(item, fd)
                  curLang.push(item.lang)
                }
              }
              this.stockChangeReasonLangList = stockChangeReasonLangList
              this.selectLang(curLang)
            }
          }
        })
      },
      /**
     * 选择语言(主语言信息必填)
     */
      selectLang (value) {
        this.curLang = value
        // 设置主语言不可删除
        if (!this.curLang.includes(this.masterLangInfo.lang)) {
          this.curLang.unshift(this.masterLangInfo.lang)
        }
        console.log('当前的curLang', this.curLang)
        // 所选语言改变
        const tempArr = this.stockChangeReasonLangList.filter(item => this.curLang.includes(item.lang))

        this.curLang.forEach((item, index) => {
          if (!tempArr.find(f => f.lang == item)) {
            const fd = this.langItemList.find(it => it.lang === item)
            if (fd) {
              tempArr.splice(index, 0, {langName: fd.name, lang: item, stockChangeReasonId: this.dataForm.stockChangeReasonId, reason: '', remark: ''})
            }
          }
        })
        this.stockChangeReasonLangList = tempArr
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          for (var i = 0; i < this.stockChangeReasonLangList.length; i++) {
            if (!this.stockChangeReasonLangList[i].reason) {
              this.$message({
                message: this.$i18n.t('stock.stockBillReasonNotEmpty'),
                type: 'error',
                duration: 1500
              })
              return false
            }
          }
          this.dataForm.stockChangeReasonLangList = this.stockChangeReasonLangList
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/shop/stockChangeReason'),
              method: this.dataForm.stockChangeReasonId ? 'put' : 'post',
              data: this.$http.adornData(this.dataForm)
            }).then(({data}) => {
              this.$message({
                message: this.$i18n.t('publics.operation'),
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            })
          }
        })
      }
    }
  }
</script>
