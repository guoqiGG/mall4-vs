<template>
  <el-dialog
    :title="!dataForm.categoryId ? this.$i18n.t('crud.addTitle') : this.$i18n.t('groups.edit')"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="700px"
  >
    <el-form @submit.native.prevent
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="150px"
    >
      <!-- 语言选择 -->
      <el-form-item :label="$t('product.chooseLanguage')" v-if="langItemList.length > 1">
        <el-select v-model="curLang" multiple :placeholder="$t('tip.select')" @change='selectLang' style="width: 100%;">
          <el-option
            v-for="item in langItemList"
            :key="item.lang"
            :label="item.name"
            :value="item.lang">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 分类名称 -->
      <template v-if="dataForm.type !== 2">
        <div v-for="(item,index) in categoryLangList" :key="index">
          <el-form-item
            :label="$t('publics.categoryCn') + (langItemList.length === 1 ? '' : `(${item.langName})`)"
          >
            <el-input
              size="small"
              v-model.trim="item.categoryName"
              maxlength="20"
              show-word-limit
            ></el-input>
          </el-form-item>
        </div>
      </template>

      <el-form-item v-if="dataForm.type !== 2" :label="this.$i18n.t('hotSearch.seq')" prop="seq">
        <el-input v-model.number="dataForm.seq" size="small" maxlength="9" :label="this.$i18n.t('hotSearch.seq')"></el-input>
      </el-form-item>
      <el-form-item :label="this.$i18n.t('product.status')" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">{{$t("live.offline")}}</el-radio>
          <el-radio :label="1">{{$t("publics.normal")}}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="default-btn" @click="visible = false">{{$t("crud.filter.cancelBtn")}}</div>
      <div class="default-btn primary-btn" @click="dataFormSubmit">{{$t("crud.filter.submitBtn")}}</div>
    </span>
  </el-dialog>
</template>
<script>
import { treeDataTranslate, idList } from '@/utils'
// import PicUpload from '@/components/pic-upload'
import ImgUpload from '@/components/img-upload'
export default {
  data () {
    var validateCategoryName = (rule, value, callback) => {
      if (!value.trim()) {
        callback(new Error(this.$i18n.t('publics.categoryNoNull')))
      } else {
        callback()
      }
    }
    var validateSeq = (rule, value, callback) => {
      var reg = /[^-\d]/
      var regs = /^\s+$/g
      if (value == null || value === '') {
        this.$refs.dataForm.clearValidate('seq')
        callback()
      } else if (reg.test(value)) {
        callback(new Error(this.$i18n.t('prodTag.tips')))
      } else if (regs.test(value)) {
        callback(new Error(this.$i18n.t('publics.categoryNoNull')))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      dataForm: {
        categoryId: 0,
        grade: 0,
        categoryName: '',
        categoryNameEn: '',
        seq: 1,
        status: 1,
        parentId: 0,
        pic: ''
      },
      dataRule: {
        // categoryName: [
        //   { required: true, message: this.$i18n.t('publics.categoryNoNull'), trigger: 'blur' },
        //   {validator: validateCategoryName, trigger: 'blur'}
        // ],
        pic: [
          { required: true, message: this.$i18n.t('publics.imageNoNull'), trigger: 'blur' }
        ],
        seq: [
          { validator: validateSeq }
        ]
      },
      categoryList: [],
      selectedCategory: [],
      categoryTreeProps: {
        value: 'categoryId',
        label: 'categoryName'
      },
      // 语言列表
      langItemList: [],
      masterLangInfo: {name: '', lang: ''},
      // 当前所选语言
      curLang: [],
      categoryLangList: []
    }
  },
  components: {
    ImgUpload
  },
  methods: {
    init (id) {
      this.dataForm.categoryId = id || 0
      this.$http({
        url: this.$http.adornUrl('/prod/category/listCategory'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.categoryList = treeDataTranslate(data, 'categoryId', 'parentId')
      }).then(() => {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.selectedCategory = []
        })
      }).then(() => {
        if (this.dataForm.categoryId) {
          // 修改
          this.$http({
            url: this.$http.adornUrl(`/prod/category/info/${this.dataForm.categoryId}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            this.dataForm.categoryId = data.categoryId
            this.dataForm.categoryName = data.categoryName
            this.dataForm.categoryNameEn = data.categoryNameEn
            this.dataForm.seq = data.seq
            this.dataForm.pic = data.pic
            this.dataForm.parentId = data.parentId
            this.dataForm.status = data.status
            this.selectedCategory = idList(this.categoryList, data.parentId, 'categoryId', 'children').reverse()
            this.categoryLangList = data.categoryLangList
            this.getLangList()
          })
        } else {
          this.getLangList()
          this.categoryLangList = []
        }
      })
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

          if (this.dataForm.categoryId) {
            let curLang = []
            let categoryLangList = []
            for (const item of this.langItemList) {
              const fd = this.categoryLangList.find(it => it.lang === item.lang)
              if (fd) {
                fd.langName = item.name
                categoryLangList.push(fd)
                curLang.push(item.lang)
              }
            }
            this.categoryLangList = categoryLangList
            this.selectLang(curLang)
          } else {
            // 设置默认主语言
            this.selectLang([info.lang])
          }
        }
      })
    },
    // 多选框默认选择主语言
    selectLang (value) {
      console.log('当前值', value)
      this.curLang = value
      // 设置主语言不可删除
      if (!this.curLang.includes(this.masterLangInfo.lang)) {
        this.curLang.unshift(this.masterLangInfo.lang)
      }
      // 分类名称
      const tempArr = this.categoryLangList.filter(item => this.curLang.includes(item.lang))
      this.curLang.forEach((item, index) => {
        if (!tempArr.find(f => f.lang == item)) {
          const fd = this.langItemList.find(it => it.lang === item)
          if (fd) {
            tempArr.splice(index, 0, {langName: fd.name, lang: item, categoryId: this.dataForm.categoryId, categoryName: ''})
          }
        }
      })
      this.categoryLangList = tempArr
    },
    // 表单提交
    dataFormSubmit () {
      if (this.selectedCategory.length === 1) {
        this.dataForm.grade = 0
      }
      if (this.selectedCategory.length === 2) {
        this.dataForm.grade = 1
      }
      if (this.selectedCategory.length === 3) {
        this.dataForm.grade = 2
      }
      for (const item of this.categoryLangList) {
        if (!item.categoryName) {
          this.$message.error(this.$i18n.t('category.categoryNameNull'))
          return
        }
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/prod/category`),
            method: this.dataForm.categoryId ? 'put' : 'post',
            data: this.$http.adornData({
              'categoryId': this.dataForm.categoryId || undefined,
              'status': this.dataForm.status,
              'seq': this.dataForm.seq,
              'grade': this.dataForm.grade,
              'parentId': this.dataForm.parentId,
              'pic': this.dataForm.pic,
              categoryLangList: this.categoryLangList
            })
          }).then(({ data }) => {
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
