<template>
  <div>
    <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
      <div class="site-navbar__header" :style="{ 'margin-right': '20px'}">
        <div class="site-navbar__brand" style="width: auto;">
          <img style="height: 18px;width:59px;margin-right: 10px" v-if="configuration.bsTopBarIcon" :src="configuration.bsTopBarIcon" alt="">
          <a class="site-navbar__brand-lg" style="text-transform:none;" href="javascript:;">{{ configuration.bsMenuTitleOpen }}</a>
          <a class="site-navbar__brand-mini" v-if="!configuration.bsTopBarIcon" style="text-transform:none;" href="javascript:;" :style="fontCloseSize">{{ configuration.bsMenuTitleClose }}</a>
        </div>
      </div>
      <div class="site-navbar__content clearfix" @click="closeRight;visible = false">
        <el-menu
          class="site-navbar__menu site-navbar__menu--right"
          mode="horizontal"
          style="margin-right: 20px"
        >
          <el-menu-item class="site-navbar__avatar" index="4">
            <div class="decorate-menu is-active" @click.stop="setMenu(4);handleSave();visible=false">{{ $t('crud.saveBtn') }}</div>
          </el-menu-item>
        </el-menu>
        <el-menu
          class="site-navbar__menu site-navbar__menu--right"
          mode="horizontal"
          style="margin-right: 20px"
          v-show="isTemplate === '0'"
        >
          <el-menu-item class="site-navbar__avatar" index="3">
            <div class="decorate-menu is-active" @click.stop="setMenu(3); viewDialog = true;visible=false">{{ $t('pcdecorate.decorateNavbar.setTemplate') }}</div>
          </el-menu-item>
        </el-menu>
        <el-menu
          class="site-navbar__menu site-navbar__menu--right"
          mode="horizontal"
          style="margin-right: 20px"
        >
          <el-menu-item class="site-navbar__avatar" index="2">
            <div class="decorate-menu is-active" @click.stop="setMenu(2);view();visible=false">{{ $t('pcdecorate.decorateNavbar.preview') }}</div>
          </el-menu-item>
        </el-menu>
        <el-menu
          class="site-navbar__menu site-navbar__menu--right"
          mode="horizontal"
          style="margin-right: 20px"
        >
          <el-menu-item class="site-navbar__avatar" index="1">
            <div class="decorate-menu is-active" @click.stop="setMenu(1);handleClickComponent();visible=false">{{$t('pcdecorate.commonModal.component')}}</div>
          </el-menu-item>
        </el-menu>
        <div class="top-tip">{{ $i18n.t('pcdecorate.decorateNavbar.moveTip') }}</div>
      </div>
    </nav>

    <!-- 模板设置 -->
    <el-dialog
      :title="this.$i18n.t('pcdecorate.decorateNavbar.templateInfo')"
      :visible.sync="viewDialog"
      width="30%"
    >
      <el-form @submit.native.prevent :model="dataForm" ref="dataForm" :rules="dataRule" label-width="100px">
        <el-form-item :label="this.$i18n.t('transport.name') + ':'" prop="name" :label-width="labelWidth">
          <el-input size="small" v-model="dataForm.name" maxlength="20" @keyup.enter.native="dataFormSubmit()"></el-input>
        </el-form-item>
        <el-form-item :label="this.$i18n.t('pcdecorate.decorateNavbar.templateRemark') + ':'" prop="remark" :label-width="labelWidth">
          <el-input size="small" type="textarea" rows="5" 
          :placeholder="this.$i18n.t('pcdecorate.decorateNavbar.templateTip')"
          maxlength="100" 
          show-word-limit
          v-model="dataForm.remark"></el-input>
        </el-form-item>
        <el-form-item :label="this.$i18n.t('pcdecorate.decorateNavbar.templateImg') + ':'" prop="imgUrl" :label-width="labelWidth">
          <div class="img-upload">
            <img-upload v-model="dataForm.imgUrl"></img-upload>
            <span v-if="dataForm.imgUrl" class="default-btn text-btn" @click="delTagItemPic()">{{ $t('text.delBtn') }}</span>
          </div>
          <!-- <span v-if="dataForm.imgType === 0">{{$t('admin.recommImgSize')}}710*780</span>
          <span v-if="dataForm.imgType === 1">{{$t('admin.recommImgSize')}}1920*450</span> -->
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div class="primary-btn default-btn" @click="viewDialog = false">{{$t("order.cancel")}}</div>
        <div class="primary-btn default-btn" @click="dataFormSubmit()">{{$t("order.confirm")}}</div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ImgUpload from '@/components/img-upload'
import { formatConfigInfo } from '@/utils/websiteConfig'

export default {
  data () {
    var validateName = (rule, value, callback) => {
      if (!value.trim()) {
        callback(new Error(this.$i18n.t('pcdecorate.decorateNavbar.templateNameNotNull')))
      } else {
        callback()
      }
    }
    return {
      configuration: {
        bsLoginLogoImg: null,
        bsLoginBgImg: null,
        bsCopyright: null,
        bsTitleContent: null,
        bsTitleImg: null,
        bsMenuTitleOpen: null,
        bsMenuTitleClose: null
      },
      fontCloseSize: {
        fontSize: '18px'
      },
      fontOpenSize: {
        fontSize: '16px'
      },
      visible: false,
      menuActive: 1,
      viewDialog: false,
      dataForm: this.dataFormL,
      dataRule: {
        name: [
          {required: true, message: this.$i18n.t('pcdecorate.decorateNavbar.templateNameNotNull'), trigger: 'blur'},
          {validator: validateName, trigger: 'blur'}
        ]
      },
      labelWidth: localStorage.getItem('bbcLang') === 'en' ? '140px' : '100px'

      // updatePassowrdVisible: false,
      // newMessage: null,
      // showHidden: true,
      // shopStatus: 1,
      // messageReminding: null, // 控制图标闪烁
      // message: null, // 消息提示数字
      // lockReconnect: false, // 判断有无客服连接上
      // notification: false, // 通知权限判断
      // ortherUser: false, // 别的账号登录判断
      // notificationDebounce: 1, // 防止连续发送的消息导致右下方弹窗不
      // dataList: [],
      // noticeData: {},
      // viewDialog: false
    }
  },
  components: {
    ImgUpload
  },
  props: {
    isTemplate: {
      type: String,
      default: '0'
    },
    dataFormL: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    navbarLayoutType: {
      get () { return this.$store.state.common.navbarLayoutType }
    }
  },
  watch: {
    dataFormL (val) {
      this.dataForm = val
    }
  },

  created () {
  },

  mounted () {
    this.updateWebConfigData()
  },
  methods: {
    delTagItemPic () {
      this.dataForm.imgUrl = ''
    },
    // 预览
    view () {
      this.$emit('view')
    },
    // 模板保存
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return
        }
        this.$emit('handleSaveTemplate', this.dataForm)
        this.viewDialog = false
      })
    },
    // 菜单选择
    setMenu (index) {
      if (index !== this.menuActive) {
        this.menuActive = index
      } else {
        this.menuActive = -1
      }
    },
    // 添加组件
    // addComponent (item) {
    //   this.$emit('addComponent', item)
    // },
    // 组件管理
    handleClickComponent () {
      this.$emit('handleClickComponent')
    },
    // 保存
    handleSave () {
      if (this.isTemplate === '0') {
        this.$emit('handleSave', 2)
      } else {
        this.viewDialog = true
      }
    },
    // 关闭组件设置
    closeRight () {
      this.$emit('closeRight')
    },
    // 关闭组件管理
    // closeComponentManage () {
    //   this.$emit('closeComponentManage')
    // },
    // TODO -lang 适配各语言
    // 更新网站配置信息
    updateWebConfigData () {
      this.$http({
        url: this.$http.adornUrl('/sys/webConfig/getActivity'),
        method: 'get'
      }).then(({data}) => {
        data = formatConfigInfo(data)
        this.$store.commit('webConfig/addData', data)
        this.configuration = data
        if (data.bsMenuTitleOpen.length >= 17) {
          this.fontOpenSize.fontSize = '16px'
        }
        // else if (data.bsMenuTitleOpenCn.length >= 10) {
        //   this.fontOpenSize.fontSize = '16px'
        // }

        if (data.bsMenuTitleClose.length >= 6) {
          this.fontCloseSize.fontSize = '18px'
        }
        // else if (data.bsMenuTitleCloseCn.length >= 4) {
        //   this.fontCloseSize.fontSize = '18px'
        // }
      })
    }
  }
}
</script>

<style scoped>
.site-navbar__brand {
  font-size: 16px;
  white-space: normal;
  display: flex;
  align-items: center;
  font-weight: bold;
  padding: 5px 0;
}
.site-navbar__brand-lg {
  margin: 0 auto;
  word-break: break-all; /* 按字符截断换行 支持IE和chrome，FF不支持*/
  word-wrap: break-word; /* 按英文单词整体截断换行  以上三个浏览器均支持 */
  color: #333333;
}
.site-navbar__brand-lg:hover {
  color: #333;
}
.site-navbar__brand-mini {
   color: #333333;
}
.site-navbar >>> .el-menu.el-menu--horizontal {
  border-bottom: none;
}
.site-navbar >>> .el-menu--horizontal > .el-menu-item {
  height: 50px;
  line-height: 47px;
  padding: 0 !important;
}
.site-navbar__header {
  margin-right: 20px;
}
div >>> .site-navbar__menu--right:not(:first-child) {
  padding-right: 25px;
}
div >>> .site-navbar__menu--right:not(:first-child)::after {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  content: '';
  display: block;
  width: 1px;
  height: 30px;
  background: #DCDFE6;
}
.site-navbar {
  overflow: hidden;
  border-bottom: 1px solid #EBEDF0;
}
.site-navbar__content {
  width: 100%;
}
.site-navbar__content .top-tip {
  float: right;
  height: 50px;
  line-height: 47px;
  color: #858585;
  margin-right: 20px;
}

.decorate-menu {
  font-size: 14px;
  color: #666666;
  padding: 0px 18px;
}
.is-active:hover {
  color: #155BD4;
}
.is-active:hover .el-icon-menu {
  color: #155BD4;
}
.el-icon-menu {
  transform: rotate(45deg);
}
.img-upload {
  display: flex;
  align-items: center;
}
</style>
