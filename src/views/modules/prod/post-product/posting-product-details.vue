<template>
<!-- 发布商品：03、编辑商品详情 -->
  <div class="posting-product-details">
     <el-tabs>
      <el-tab-pane v-for="(item,index) in prodLangList" :key="index" :label="`${item.langName}详情`">
        <div class="prod-det-box">
          <div class="prod-content">
            <tiny-mce
              ref="content"
              :id="`detail${index}`"
              v-model="item.content"
              tinymceUploadType="prod"
            ></tiny-mce>
          </div>
          <!-- 详情预览 -->
          <div class="details-preview">
            <div class="preview-box-title">{{ $t('product.detailPagePreviewImage') }}</div>
            <div v-html="item.content" class="preview-con"></div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TinyMce from '@/components/tiny-mce'
import { formatHtml } from '@/utils/index.js'
export default {
  components: {
    TinyMce
  },
  props: {
    value: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      prodLangList: []
    }
  },
  watch: {
    prodLangList: {
      handler (val) {
        console.log('详情变化的值', val)
        this.$emit('updateContent', val)
      },
      deep: true,
      immediate: true
    }
  },
  created () {
    this.prodLangList = JSON.parse(JSON.stringify(this.value.prodLangList))
    this.prodLangList.forEach(item => {
      if (item.content) {
        item.content = item.content ? this.DOMPurify.sanitize(formatHtml(item.content)) : ''
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.posting-product-details {
  .prod-det-box {
    display: flex;
    justify-content: space-between;
    .prod-content {
      width: 60%;
      margin-right: 30px;
      // 富文本编辑框样式修改
      & ::v-deep .tinymce-container {
        .mce-panel,
        .mce-container-body.mce-flow-layout {
          border-color: #DCDCDC !important;
        }
        .mce-edit-area {
          border-top: 0;
        }
      }
    }

    // 详情预览
    .details-preview {
      width: 40%;
      border: 1px solid #DCDCDC;
      box-sizing: border-box;
      .preview-box-title {
        height: 45px;
        line-height: 45px;
        background: #f9f9f9;
        text-align: center;
        border-bottom: 1px solid #DCDCDC;
      }
      .preview-con {
        height: auto;
        // max-height: 580px;
        overflow-y: auto;
        padding: 0 10px;
        box-sizing: border-box;
      }
    }

    @media only screen and (min-width: 1470px){//当屏幕最小1470时
      .preview-con{
        max-height: 580px;
      }
    }
    @media only screen and (max-width:1469px){//当屏幕最大1469时
      .preview-con{
        max-height: 623px;
      }
    }

  }
}
</style>