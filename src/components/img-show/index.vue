<template>
  <img v-if="imgPath" :src="imgPath" :style="imgStyle" :class="classList" :alt="imgAlt" @error="imgError" @click="handleClick" />
  <img v-else src="~@/assets/img/def.png" :style="imgStyle" :class="classList" @click="handleClick" />
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: ''
    },
    imgAlt: {
      type: String,
      default: ''
    },
    classList: {
      type: Array,
      default: () => {
        return []
      }
    },
    imgStyle: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      imgPath: '',
      // 图片地址
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL
    }
  },
  watch: {
    src: {
      immediate: true,
      handler (path) {
        if (/^https?:\/\//.test(path)) {
          this.imgPath = path
        } else {
          this.imgPath = this.resourcesUrl + path
        }
      }
    }
  },
  methods: {
    imgError () {
      this.imgPath = ''
    },
    handleClick () {
      this.$emit('handleClick')
    }
  }
}
</script>

<style scoped>
img{
  width: 100%;
  height: 100%;
}
</style>

