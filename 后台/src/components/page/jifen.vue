<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>资源汇总</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div slot="header"><span>所有上传资源汇总</span></div>
      <el-row>
        <el-col :span="12">
          <el-input placeholder="请输入上传音乐编号或音乐名称或上传用户名" v-model="queryinfo.query" class="search" clearable @clear="getMusicList">
            <el-button slot="append" icon="el-icon-search" @click="getMusicList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="musicList" border stripe>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="up_id" label="上传音乐编号"></el-table-column>
        <el-table-column prop="up_name" label="上传用户名"></el-table-column>
        <el-table-column prop="up_url" label="上传音乐"></el-table-column>
        <el-table-column prop="up_time" label="上传时间"></el-table-column>
        <el-table-column prop="_like" label="点赞量"></el-table-column>
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
    <el-dialog title="编辑音乐信息" :visible.sync="editDialogVisible" @close="editCloseDialog">
      <el-form :model="editForm" status-icon :rules="editRules" ref="editRuleFormRef" label-width="100px">
        <el-form-item label="上传编号" prop="up_id">
          <el-input type="text" v-model="editForm.up_id" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="上传用户名" prop="up_name">
          <el-input type="text" v-model="editForm.up_name" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="音乐名称" prop="up_url">
          <el-input v-model="editForm.up_url" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="上传时间" prop="up_time">
          <el-input v-model="editForm.up_time"></el-input>
        </el-form-item>
        <el-form-item label="点赞量" prop="like">
          <el-input v-model="editForm.like"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="editSubmit()" style="margin-left:200px">确认提交</el-button>
          <el-button type="info" plain @click="editReset()">重置信息</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return {
      fileList:[],
      uploadData:{
        upName:"",
        mytime:""
      },
      queryinfo:{
        query:"",
        pagenum:1,
        pagesize:6
      },
      total:0,
      musicList:[],
      editForm:{
        up_id:"",
        up_name:"",
        up_time:"",
        like:"",
        up_url:""
      },
      editRules:{
        up_id:[],
        up_name:[],
        up_time:[{required: true, message: '请输入用户名', trigger: 'blur'}],
        up_url:[],
        like:[]
      },
      editDialogVisible:false
    }
  },
  created(){
    this.getMusicList()
  },
  methods:{
    getMusicList(){
      console.log("获取音乐列表数据")
      this.$http.get('/allMusicList',{params:this.queryinfo}).then((res)=>{
        console.log(res.data.data)
        this.musicList=res.data.data.slice((this.queryinfo.pagenum-1) * this.queryinfo.pagesize,this.queryinfo.pagenum * this.queryinfo.pagesize)
        this.total=res.data.data.length
        console.log(this.musicList)
      }).catch((error)=>{
        console.log(error)
        this.$message.error(error)
        })
    },
    handleSizeChange(val1) {
        console.log(`每页 ${val1} 条`);
        this.queryinfo.pagesize=val1
        this.getMusicList()
    },
    handleCurrentChange(val2) {
        console.log(`当前页: ${val2}`);
        this.queryinfo.pagenum=val2
        this.getMusicList()
    },
    handleEdit(index, row){
      console.log(index, row)
      this.editDialogVisible=true
      this.editForm.up_id=row.up_id
      this.editForm.up_name=row.up_name
      this.editForm.up_time=row.up_time
      this.editForm.up_url=row.up_url
      this.editForm.like=row._like
    },
    editSubmit(){
      this.$refs.editRuleFormRef.validate(async valid=>{
        if(!valid){
          return this.$message.error("验证不通过")
        }
        else{
          this.$http.post('/editMusicList',this.editForm).then(res=>{
            console.log(res)
            this.$message.success(res.data.message)
            this.editDialogVisible=false
            this.getMusicList()
          }).catch(err=>{
            console.log(err)
            this.$message.error(err)
          })
        }
      })
    },
    editCloseDialog(){
      this.$refs.editRuleFormRef.resetFields()
    },
    editReset(){
      this.$refs.editRuleFormRef.resetFields()
    },
    handleDelete(index, row){
      console.log(index, row)
      this.$confirm('该操作会永久删除该条数据，是否删除？', '确认删除', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        })
          .then(() => {
            this.$http.post('/deleteMusic',{upId:row.up_id,url:row.up_url}).then((res)=>{
              console.log(res)
              this.$message({
              type: 'success',
              message: res.data.message
              })
              this.getMusicList()
            }).catch(err=>{
              console.log(err)
              this.$message.error("删除失败！！！")
            })
          })
          .catch(()=> {
            this.$message({
              type: 'info',
              message: "已取消删除"
            })
          });
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
