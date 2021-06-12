<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户信息管理</el-breadcrumb-item>
      <el-breadcrumb-item>审核中心</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入用户编号或姓名" v-model="queryinfo.query" class="search" clearable @clear="getCheckList">
            <el-button slot="append" icon="el-icon-search" @click="getCheckList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="checkList" border stripe>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="message_id" label="上传文件编号"></el-table-column>
        <el-table-column prop="user_name" label="上传用户名"></el-table-column>
        <el-table-column prop="text" label="描述内容"></el-table-column>
        <el-table-column prop="time" label="上传时间"></el-table-column>
        <el-table-column prop="like" label="点赞量"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template v-slot="sw">
            <el-switch v-model="status" @change="changeStatus(sw.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template v-slot="scope">
            <!-- {{scope.row}} -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope.$index, scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(scope.$index, scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination @size-change="handleSizeChange"  @current-change="handleCurrentChange" :current-page="queryinfo.pagenum" :page-sizes="[2, 4, 6, 8]" :page-size="queryinfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data(){
    return {
      queryinfo:{
        query:"",
        pagenum:1,
        pagesize:6
      },
      total:0,
      checkList:[],
      status:false
    }
  }
}
</script>

<style scoped>
.el-card{
  margin-top:40px;
}
.el-table{
  margin-top:20px;
}
.el-pagination{
  margin-top:20px;
}
</style>
