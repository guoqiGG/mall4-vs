<template>
  <div class="mod-marketing-distribution">
    <sku-stock-inquire :isStockWarning="isStockWarning"></sku-stock-inquire>
  </div>
</template>

<script>
import skuStockInquire from './components/sku-stock-inquire'

export default {
  components: {
    skuStockInquire
  },
  data () {
    return {
      isStockWarning: null
    }
  },
  created () {
    this.isStockWarning = this.$route.query.isStockWarning ? Number(this.$route.query.isStockWarning) : null
    console.log(this.isStockWarning)
  }
}
</script>

<style scoped>
/* div ::v-deep .el-tabs__item.is-active{
  color:#000;
  font-weight: 800;
}
div ::v-deep .el-col-md-6{
  width:30%
} */
</style>
