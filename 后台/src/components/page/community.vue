<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>社区信息管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入用户编号或姓名" v-model="queryinfo.query" class="search" clearable @clear="getMessageList">
            <el-button slot="append" icon="el-icon-search" @click="getMessageList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加留言信息</el-button>
        </el-col>
      </el-row>
      <el-table :data="messageList" border stripe>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="message_id" label="留言信息编号"></el-table-column>
        <el-table-column prop="user_name" label="留言用户名"></el-table-column>
        <el-table-column prop="text" label="留言内容"></el-table-column>
        <el-table-column prop="time" label="留言时间"></el-table-column>
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
    <el-dialog title="添加留言信息" :visible.sync="addDialogVisible" @close="addCloseDialog">
      <el-form :model="addForm" status-icon :rules="addRules" ref="addRuleFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="留言信息" prop="text">
          <el-input v-model="addForm.text" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="留言时间" prop="time">
          <el-input v-model="addForm.time"></el-input>
        </el-form-item>
        <el-form-item label="点赞量" prop="like">
          <el-input v-model="addForm.like"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="addMessageSubmit()" style="margin-left:200px">确认提交</el-button>
          <el-button type="info" plain @click="addReset()">重置信息</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="编辑留言信息" :visible.sync="editDialogVisible" @close="editCloseDialog">
      <el-form :model="editForm" status-icon :rules="editRules" ref="editRuleFormRef" label-width="100px">
        <el-form-item label="信息编号" prop="messageId">
          <el-input type="text" v-model="editForm.messageId" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="editForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="留言信息" prop="text">
          <el-input v-model="editForm.text" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="留言时间" prop="time">
          <el-input v-model="editForm.time"></el-input>
        </el-form-item>
        <el-form-item label="点赞量" prop="like">
          <el-input v-model="editForm.like"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="editMessageSubmit()" style="margin-left:200px">确认提交</el-button>
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
      queryinfo:{
        query:"",
        pagenum:1,
        pagesize:6
      },
      total:0,
      messageList:[],
      addDialogVisible:false,
      addForm:{
        username:"",
        text:"",
        time:"",
        like:""
      },
      addRules:{
        username:[{required: true, message: '请输入用户名', trigger: 'blur'}],
        text:[{required: true, message: '请输入留言信息', trigger: 'blur'}],
        time:[{required: true, message: '请输入发布时间', trigger: 'blur'}],
        like:[{required: true, message: '请输入点赞量', trigger: 'blur'}]
      },
      editDialogVisible:false,
      editForm:{
        messageId:"",
        username:"",
        text:"",
        time:"",
        like:""
      },
      editRules:{
        username:[{required: true, message: '请输入用户名', trigger: 'blur'}],
        text:[{required: true, message: '请输入留言信息', trigger: 'blur'}],
        time:[{required: true, message: '请输入发布时间', trigger: 'blur'}],
        like:[{required: true, message: '请输入点赞量', trigger: 'blur'}]
      }
    }
  },
  created(){
    this.getMessageList()
  },
  methods:{
    getMessageList(){
      console.log("获取表单数据")
      this.$http.get('/community',{params:this.queryinfo}).then((res)=>{
        console.log(res.data.data)
        this.messageList=res.data.data.slice((this.queryinfo.pagenum-1) * this.queryinfo.pagesize,this.queryinfo.pagenum * this.queryinfo.pagesize)
        this.total=res.data.data.length
        console.log(this.messageList)
      }).catch((error)=>{
        console.log(error)
        this.$message.error(error)
        })
    },
    handleSizeChange(val1) {
        console.log(`每页 ${val1} 条`);
        this.queryinfo.pagesize=val1
        this.getMessageList()
    },
    handleCurrentChange(val2) {
        console.log(`当前页: ${val2}`);
        this.queryinfo.pagenum=val2
        this.getMessageList()
    },
    handleEdit(index, row) {
        console.log(index, row)
        this.editDialogVisible=true
        this.editForm.messageId=row.message_id
        this.editForm.username=row.user_name
        this.editForm.text=row.text
        this.editForm.time=row.time
        this.editForm.like=row._like
    },
    handleDelete(index, row) {
        console.log(index, row);
        this.$confirm('该操作会永久删除该条信息，是否删除？', '确认删除', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        })
          .then(() => {
            this.$http.post('/deleteLiuYan',{messageId:row.message_id}).then((res)=>{
              console.log(res)
              this.$message({
              type: 'success',
              message: res.data.message
              })
              this.getMessageList()
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
    },
    addReset(){
      this.$refs.addRuleFormRef.resetFields()
    },
    addCloseDialog(){
      this.$refs.addRuleFormRef.resetFields()
    },
    addMessageSubmit(){
      this.$refs.addRuleFormRef.validate(async valid=>{
        if(!valid){
          return this.$message.error("验证不通过")
        }
        else{
          this.$http.post('/addMessage',this.addForm).then(res=>{
            console.log(res)
            this.$message.success(res.data.message)
            this.addDialogVisible=false
            this.getMessageList()
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
    editMessageSubmit(){
      this.$refs.editRuleFormRef.validate(async valid=>{
        if(!valid){
          return this.$message.error("验证不通过")
        }
        else{
          this.$http.post('/editMessage',this.editForm).then(res=>{
            console.log(res)
            this.$message.success(res.data.message)
            this.editDialogVisible=false
            this.getMessageList()
          }).catch(err=>{
            console.log(err)
            this.$message.error(err)
          })
        }
      })
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
