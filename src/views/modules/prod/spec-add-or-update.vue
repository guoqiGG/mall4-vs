<template>
  <el-dialog
    :title="!this.dataForm.propId ? $t('crud.addTitle') : $t('temp.modify')"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >

    <el-form @submit.native.prevent ref="form" label-width="80px" >
      <el-form-item :label="$t('product.chooseLanguage')" v-if="langItemList.length > 1">
        <el-select v-model="curLang" multiple :placeholder="$t('tip.select')" @change='selectLang' style="width: 450px;">
          <el-option
            v-for="item in langItemList"
            :key="item.lang"
            :label="item.name"
            :value="item.lang">
          </el-option>
        </el-select>
        <p style="font-size:12px;color:#999999;line-height:20px;">{{$t('product.skuLangTips')}}</p>
      </el-form-item>

      <!-- 规格名称 -->
      <el-form-item :label="$t('product.attributeName')">
        <div v-for="item in prodPropLangList" class="attr-name">
          <el-input :placeholder="$t('product.attributeName') + (langItemList.length === 1 ? '' : `(${item.langName})`)" v-model.trim="item.propName" maxlength="10"
                    size="small"
                    show-word-limit
                    clearable
                    @blur="item.propName = handleInputSpaces(item.propName, 0)"
          ></el-input>
        </div>
        <p style="font-size:12px;color:#999999;line-height:20px;">{{$t('product.attributeTips')}}</p>
      </el-form-item>

      <el-form-item :label="$t('product.attributeValue')">
        <div class="default-btn primary-btn" @click="add">{{$t('admin.add')}}</div>
        <p style="font-size:12px;color:#999999;line-height:20px;">{{$t('product.attributeValueTips')}}</p>
      </el-form-item>

      <!-- 规格值 -->
      <el-form-item >
        <div class="attr-value-box" v-for="(item,index) in prodPropValues">
          <div class="left-box">
            <div class="attr-value" v-for="prop in item.prodPropValueLangList">
              <el-input
                size="small"
                maxlength="20"
                clearable
                :placeholder="$t('product.attributeValue') + (langItemList.length === 1 ? '' : `(${prop.langName})`)"
                v-model.trim="prop.propValue"
                @blur="prop.propValue = handleInputSpaces(prop.propValue, 1)"
              ></el-input>
            </div>
          </div>
          <div class="value-del-btn" @click="deleteRow(index)">{{$t('resource.Delete')}}</div>
        </div>
      </el-form-item>
    </el-form>


    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{$t("crud.filter.cancelBtn")}}</div>
      <div class="default-btn primary-btn" @click="dataFormSubmit()">{{$t("crud.filter.submitBtn")}}</div>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      visible: false,
      isSubmit: false,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      // 表单数据
      dataForm: {
        propId: 0
      },
      // 语言列表
      langItemList: [],
      masterLangInfo: {name: '', lang: ''},
      // 当前所选语言
      curLang: [],
      prodPropLangList: [],
      prodPropValues: []
    }
  },
  methods: {
    init (val) {
      this.isSubmit = false
      if (val) {
        this.dataForm = JSON.parse(JSON.stringify(val))
        this.prodPropLangList = this.dataForm.prodPropLangList
        this.prodPropValues = this.dataForm.prodPropValues
      } else {
        this.prodPropLangList = []
        this.prodPropValues = [{
          propId: this.dataForm.propId,
          prodPropValueLangList: [],
          propValue: '',
          propValueEn: ''
        }]
      }
      // 获取国际化配置语言
      this.getLangList()
      this.visible = true
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
          // this.curLang = [info.lang]
          if (!this.prodPropLangList.length) {
            this.selectLang([info.lang])
          } else {
            let curLang = []
            // 初始化所选语言
            console.log('this.prodPropLangList', this.prodPropLangList)
            // for (const item of this.prodPropLangList) {
            //   console.log('1')
            //   const fd = this.langItemList.find(it => it.lang === item.lang)
            //   if (fd) {
            //     item.langName = fd.name
            //     curLang.push(item.lang)
            //   }
            // }
            let prodPropLangList = []
            for (const item of this.langItemList) {
              const fd = this.prodPropLangList.find(it => it.lang === item.lang)
              if (fd) {
                fd.langName = item.name
                prodPropLangList.push(fd)
                curLang.push(item.lang)
              }
            }
            this.prodPropLangList = prodPropLangList
            console.log('this.prodPropValues', this.prodPropValues)
            // 初始化规格值
            for (const item of this.prodPropValues) {
              for (const prop of item.prodPropValueLangList) {
                const fd = this.langItemList.find(it => it.lang === prop.lang)
                if (fd) {
                  prop.langName = fd.name
                }
              }
            }
            // let prodPropValues = []
            // for (const item of this.langItemList) {
            //   const fd = this.prodPropValues.find(it => it.lang === item.lang)
            //   if (fd) {
            //     fd.langName = item.name
            //     prodPropValues.push(fd)
            //     curLang.push(item.lang)
            //   }
            // }
            // this.prodPropValues = prodPropValues
            this.selectLang(curLang)
          }
        }
      })
    },

    /**
     * 输入框纯空格处理
     */
    handleInputSpaces (value, type) {
      if (!value) { return }
      value = this.specInputLimit(value, type)
      return value.trim()
    },
    /**
     * 输入特殊字符处理
     */
    specInputLimit (value, type = 0) {
      const reg = /[\\;\\:\\；\\：]/g
      const regVal = /[\\;\\；]/g
      if (type === 0) {
        if (reg.test(value)) {
          this.$message.error(this.$i18n.t('product.specName') + this.$i18n.t('product.specialWordSymbolTips') + ':;')
          return ''
        }
      } else {
        if (regVal.test(value)) {
          this.$message.error(this.$i18n.t('product.specValue') + this.$i18n.t('product.specialWordSymbolTips') + ';')
          return ''
        }
      }
      return value
    },

    // 多选框默认选择中文
    selectLang (value) {
      console.log('当前值', value)
      this.curLang = value
      // 设置主语言不可删除
      if (!this.curLang.includes(this.masterLangInfo.lang)) {
        this.curLang.unshift(this.masterLangInfo.lang)
      }
      // 规格名
      console.log('aaaaaaaaaaa')
      const tempArr = this.prodPropLangList.filter(item => this.curLang.includes(item.lang))
      this.curLang.forEach((item, index) => {
        if (!tempArr.find(f => f.lang == item)) {
          const fd = this.langItemList.find(it => it.lang === item)
          if (fd) {
            tempArr.splice(index, 0, {langName: fd.name, lang: item, propId: this.dataForm.propId, propName: ''})
          }
        }
      })
      this.prodPropLangList = tempArr

      // 规格值
      this.prodPropValues.forEach(prop => {
        const flList = prop.prodPropValueLangList.filter(item => this.curLang.includes(item.lang))
        this.curLang.forEach((item, index) => {
          if (!flList.find(f => f.lang == item)) {
            const fd = this.langItemList.find(it => it.lang === item)
            if (fd) {
              flList.splice(index, 0, {langName: fd.name, lang: item, propValue: ''})
            }
          }
        })
        prop.prodPropValueLangList = flList
      })
    },

    // 表单提交
    dataFormSubmit () {
      // 是否存在未填的规格
      for (const item of this.prodPropValues) {
        for (const propItem of item.prodPropValueLangList) {
          // propItem.propValue = propItem.propValue.trim()
          if (!propItem.propValue) {
            this.$message.error(this.$i18n.t('product.specValueCannotBeEmpty'))
            return
          }
        }
      }

      // 判断是否有相同的属性值
      for (let i = 0; i < this.prodPropValues.length; i++) {
        for (let j = i + 1; j < this.prodPropValues.length; j++) {
          // 规格
          for (let k = 0; k < this.prodPropValues[i].prodPropValueLangList.length; k++) {
            if (this.prodPropValues[i].prodPropValueLangList[k]['propValue'] === this.prodPropValues[j].prodPropValueLangList[k]['propValue']) {
              this.$message.error(this.$i18n.t('product.same'))
              return
            }
          }
        }
      }

      for (const item of this.prodPropLangList) {
        if (!item.propName) {
          this.$message.error(this.$i18n.t('product.attributeNameNoNull'))
          return
        }
      }
      if (this.isSubmit) {
        return false
      }
      this.isSubmit = true

      const params = {
        propId: this.dataForm.propId || 0,
        propName: this.prodPropLangList[0].propName,
        prodPropLangList: this.prodPropLangList,
        prodPropValues: this.prodPropValues
        // propNameEn: ''
      }
      console.log('提交的参数', params)

      this.$http({
        url: this.$http.adornUrl(`/prod/spec`),
        method: this.dataForm.propId ? 'put' : 'post',
        data: this.$http.adornData(params)
      }).then(({ data }) => {
        this.$message({
          message: this.$i18n.t('publics.operation'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.visible = false
            this.$emit('refreshDataList', this.page)
          }
        })
      }).catch((e) => {
        this.isSubmit = false
      })
    },
    /**
     * 添加一行规格
     */
    add () {
      for (const item of this.prodPropValues) {
        for (const prop of item.prodPropValueLangList) {
          if (!prop.propValue) {
            this.$message.error(this.$i18n.t('product.specValueCannotBeEmpty'))
            return
          }
        }
      }
      // 添加行
      const prodPropValueLangList = []
      this.curLang.forEach((item, index) => {
        const fd = this.langItemList.find(it => it.lang === item)
        prodPropValueLangList.push({langName: fd.name, lang: item, propValue: ''})
      })
      this.prodPropValues.unshift({
        propId: this.dataForm.propId,
        propValue: '',
        propValueEn: '',
        prodPropValueLangList
      })
    },
    /**
     * 删除一行规格
     */
    deleteRow (index) {
      if (this.prodPropValues.length <= 1) {
        this.$message.error(this.$i18n.t('product.attributeNotDel'))
        return
      }
      this.prodPropValues.splice(index, 1)
    }
  }
}
</script>

<style scoped>
.attr-name{
  width: 230px;
  display: inline-block;
  padding: 6px 12px;
  border: 1px solid #e8eef5;
}

.attr-value-box{
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e8eef5;
}
.attr-value-box .left-box{
  max-width: 500px;
}
.attr-value-box .left-box .attr-value{
  width: 230px;
  display: inline-block;
  padding-right: 12px;
}
.attr-value-box .value-del-btn{
  color: #447cdd;
  cursor: pointer;
}
</style>
