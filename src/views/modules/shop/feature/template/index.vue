<template>
  <div class="template-list">
    <div class="default-btn primary-btn new-page" v-if="isAuth('shop:shopTemplate:saveMove')" @click="goCreatePage">{{$t('shopFeature.template.newTemplate')}}</div>
    <div class="default-btn primary-btn new-page" @click="getMiniPageList">{{$t('shopFeature.template.refresh')}}</div>
    <div class="main-container">
      <div v-if="templateList.length" style="display: flex;flex-wrap: wrap;" >
        <div class="card-item" v-for="(item, index) in templateList" :key="index">
          <div class="template-item">
            <img v-if="item.image" :src="item.image" />
            <img v-else src="~@/assets/img/def.png" />
            <div class="operation is-active">
              <div class="operation-item" v-if="isAuth('shop:shopTemplate:deleteMove')" @click="handleDelete(item.templateId)"><i class="el-icon-delete"></i>{{$t('shopFeature.template.delete')}}</div>
              <div class="operation-item" v-if="isAuth('shop:shopTemplate:copyMove')" @click="copyTemplatePage(item.templateId)"><i class="el-icon-copy-document"></i>{{$t('shopFeature.template.copy')}}</div>
              <div class="operation-item" v-if="isAuth('shop:shopTemplate:updateMove')" @click="handleEdit(item.templateId)"><i class="el-icon-edit"></i>{{$t('shopFeature.template.edit')}}</div>
            </div>
          </div>
          <div class="title">
            {{item.name}}
          </div>
        </div>
      </div>
      <el-empty v-else class="empty-form" :description="$t('shop.noData')"></el-empty>
    </div>
    <div style="clear: both;"></div>
    <el-pagination
      style="margin-right: 5%"
      v-if="templateList.length"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="perProps.pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="perProps.pageSize"
      :total="perProps.total"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>  
  </div>
</template>

<script>
  import List from './index'

  export default List
</script>

<style lang="scss" scoped>
.template-list {
  .new-page:first-child {
    margin-left: 40px;
  }
  .new-page {
    margin-left: 20px;
  }
  .main-container {
    // margin: 20px 0;
    margin-left: 30px;
    // width: 90%;
    .template-item {
      width: 100%;
      position: relative;
    }
    .template-item:hover .operation {
      display: flex;
    }
    .card-item {
      // float: left;
      // height: 408px;
      width: 14.7%;
      margin: 1.28%;
      background: #FFFFFF;
      img {
        width: 100%;
        border-radius: 4px;
        height: 37.4vh;
        object-fit: fill;
      }
      .operation {
        position: absolute;
        bottom: 0;
        display: none;
        background-color: #000;
        opacity: .7;
        height: 10%;
        width: 100%;
        color: #fff;
        border-radius: 0 0 4px 4px;
        .operation-item {
          flex: 1;
          display: flex;
          position: relative;
          font-size: 14px;
          cursor: pointer;
          justify-content: center;
          align-items: center;
        }
        .operation-item:hover {
          color: #155BD4;
        }
        .operation-item:not(:last-child)::after {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          content: '';
          display: block;
          width: 1px;
          height: 30px;
          background: #fff;
        }
      }
      .is-active {
        // display: block;
      }
      .title {
        color: #000000;
        font-size: 14px;
        margin-top: 16px;
        text-align: center;
        display: -webkit-box;
        word-break: break-all;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        max-width: 229.5px;
      }
    }
  }

}
  .empty-form {
    margin-top: 150px;
  }
</style>
