<template>
  <div>
    <el-select
      v-model="selDvyId"
      :style="selStyle"
      size="small"
      v-loadmore="loadmore"
      filterable
      remote
      :remote-method="remoteMethod"
      :placeholder="placeTips"
      :disabled="disabled"
      @change="change"
    >
      <el-option
        v-for="item in devList"
        :key="item.dvyId"
        :label="item.dvyName"
        :value="item.dvyId"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  directives: {
    'loadmore': {
      bind (el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
        SELECTWRAP_DOM.addEventListener('scroll', function () {
          const condition = this.scrollHeight - this.scrollTop <= this.clientHeight
          if (condition) {
            binding.value()
          }
        })
      }
    }
  },
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    selStyle: {
      type: Object,
      default: () => {}
    },
    placeTips: {
      type: String,
      default: '请选择'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value: {
      handler (val) {
        console.log('当前的值', val)
        this.selDvyId = val
      },
      immediate: true
    }
  },
  data () {
    return {
      selDvyId: '', // 当前选择的值
      size: 20,
      current: 1,
      dvyName: '',
      pages: 0,
      devList: [],
      isSearch: false
    }
  },
  created () {
    this.getDeliveryList()
    console.log('created')
  },
  methods: {
    change () {
      this.$emit('input', this.selDvyId)
    },
    remoteMethod (name) {
      console.log('搜索', name)
      this.isSearch = true
      this.current = 1
      this.dvyName = name
      this.getDeliveryList()
    },
    // 获取物流列表
    getDeliveryList () {
      this.$http({
        url: this.$http.adornUrl('/admin/delivery/page'),
        method: 'get',
        params: this.$http.adornParams({
          size: this.size,
          current: this.current,
          dvyName: this.dvyName
        })
      }).then(({ data }) => {
        this.current = data.current
        this.pages = data.pages
        if (data.current === 1) {
          this.devList = data.records
          if (this.selDvyId && !this.isSearch) {
            this.checkCurSel(this.devList, this.selDvyId)
          }
        } else {
          const fList = data.records.filter(r => r.dvyId !== this.selDvyId)
          this.devList.push(...fList)
        }
      })
    },
    // 获取当前id的物流
    getDeliveryById (dvyId) {
      this.$http({
        url: this.$http.adornUrl('/admin/delivery/page'),
        method: 'get',
        params: this.$http.adornParams({
          dvyId
        })
      }).then(({ data }) => {
        console.log('当前id的物流列表', data)
        this.devList.unshift(...data.records)
      })
    },
    // 分页加载
    loadmore () {
      console.log('加载更多')
      if (this.current < this.pages) {
        this.current++
        this.getDeliveryList()
      }
    },
    // 筛查出当前所选的对象
    checkCurSel (curList, curId) {
      for (const item of curList) {
        if (item.dvyId === curId) {
          return
        }
      }
      this.getDeliveryById(curId)
    }
  }
}
</script>

<style>

</style>