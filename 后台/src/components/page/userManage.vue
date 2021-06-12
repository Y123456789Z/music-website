<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户信息管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入用户编号或姓名" v-model="queryinfo.query" class="search" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="user_id" label="用户编号"></el-table-column>
        <el-table-column prop="user_name" label="姓名"></el-table-column>
        <el-table-column prop="password" label="密码"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="sex" label="性别"></el-table-column>
        <el-table-column prop="qq" label="qq"></el-table-column>
        <el-table-column prop="wx" label="微信"></el-table-column>
        <el-table-column prop="wb" label="微博"></el-table-column>
        <el-table-column prop="qianming" label="签名"></el-table-column>
        <el-table-column prop="person_website" label="个人网站"></el-table-column>
        <el-table-column prop="github" label="github"></el-table-column>
        <el-table-column prop="jifen" label="积分"></el-table-column>
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
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" @close="addCloseDialog">
      <el-form :model="addForm" status-icon :rules="addRules" ref="addRuleFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="addUserChange()" style="margin-left:200px">确认提交</el-button>
          <el-button type="info" plain @click="reset()">重置信息</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="修改用户信息" :visible.sync="changeDialogVisible" @close="changeCloseDialog">
      <el-form :model="changeForm" status-icon :rules="changeRules" ref="changeRuleFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="changeForm.username" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="changeForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="changeForm.email"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-input v-model="changeForm.sex"></el-input>
        </el-form-item>
        <el-form-item label="qq" prop="qq">
          <el-input v-model="changeForm.qq"></el-input>
        </el-form-item>
        <el-form-item label="微信" prop="wx">
          <el-input v-model="changeForm.wx"></el-input>
        </el-form-item>
        <el-form-item label="微博" prop="wb">
          <el-input v-model="changeForm.wb"></el-input>
        </el-form-item>
        <el-form-item label="个性签名" prop="qianming">
          <el-input v-model="changeForm.qianming"></el-input>
        </el-form-item>
        <el-form-item label="个人网站" prop="person_website">
          <el-input v-model="changeForm.person_website"></el-input>
        </el-form-item>
        <el-form-item label="github" prop="github">
          <el-input v-model="changeForm.github"></el-input>
        </el-form-item>
        <el-form-item label="积分" prop="jifen">
          <el-input v-model="changeForm.jifen"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="changeUserInfo()" style="margin-left:200px">确认修改</el-button>
          <el-button type="info" plain @click="changeUserReset()">重置信息</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return {
      //用户列表
      queryinfo:{
        query:"",
        pagenum:1,
        pagesize:6
      },
      userList:[],
      total:0,
      //添加用户信息对话框
      addDialogVisible:false,
      //修改用户信息对话框
      changeDialogVisible:false,
      addForm:{
        username:"",
        password:"",
        email:""
      },
      addRules:{
        username:[{required: true, message: '请输入用户名', trigger: 'blur'}],
        password:[{required: true, message: '请输入密码', trigger: 'blur'}],
        email:[{required: false, message: '请输入email', trigger: 'blur'}]
      },
      changeForm:{
        username:"",
        password:"",
        email:"",
        sex:"",
        qq:"",
        wx:"",
        wb:"",
        qianming:"",
        person_website:"",
        github:"",
        jifen:""
      },
      changeRules:{
        username:[{required: true, message: '请输入用户名', trigger: 'blur'}],
        password:[{required: true, message: '请输入密码', trigger: 'blur'}],
        email:[{required: false, message: '请输入email', trigger: 'blur'}]
      }
    }
  },
  created(){
    this.getUserList()
  },
  methods: {
    async getUserList(){
      const {data:res}=await this.$http.get('/userTableList',{params:this.queryinfo})
      console.log(res)
      //if(res.meta.status!=200) return this.$message.console.error("获取列表数据失败");
      // this.userList=res.data.slice((this.queryinfo.pagenum-1) * this.queryinfo.pagesize,this.queryinfo.pagenum * this.queryinfo.pagesize)
      if(res.code==5){
        this.$message.error(res.message)
      }
      else{
        this.userList=res.data.slice((this.queryinfo.pagenum-1) * this.queryinfo.pagesize,this.queryinfo.pagenum * this.queryinfo.pagesize)
        this.total=res.data.length
        console.log(this.total)
      }
    },
    handleSizeChange(val1) {
        console.log(`每页 ${val1} 条`);
        this.queryinfo.pagesize=val1
        this.getUserList()
    },
    handleCurrentChange(val2) {
        console.log(`当前页: ${val2}`);
        this.queryinfo.pagenum=val2
        this.getUserList()
    },
    handleEdit(index, row) {
        console.log(index, row)
        this.changeDialogVisible=true
        this.changeForm.username=row.user_name
        this.changeForm.password=row.password
        this.changeForm.email=row.email
        this.changeForm.sex=row.sex
        this.changeForm.qq=row.qq
        this.changeForm.wx=row.wx
        this.changeForm.wb=row.wb
        this.changeForm.qianming=row.qianming
        this.changeForm.person_website=row.person_website
        this.changeForm.github=row.github
        this.changeForm.jifen=row.jifen
    },
    handleDelete(index, row) {
        console.log(index, row);
        this.$confirm('该操作会永久删除该用户，是否删除？', '确认删除', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        })
          .then(() => {
            this.$http.post('/deleteUser',{userId:row.user_id}).then((res4)=>{
              console.log(res4)
              this.$message({
              type: 'success',
              message: res4.data.message
              })
              this.getUserList()
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
    addUserChange(){
      this.$refs.addRuleFormRef.validate(async valid=>{
        if(!valid){
          return this.$message.error("验证不通过")
        }
        else{
          //服务器请求添加用户信息
          const {data:res2}=await this.$http.post('/addUserInfo',this.addForm)
          console.log(res2)
          this.addDialogVisible=false
          this.$message.success(res2.message)
          this.getUserList()
        }
      })
    },
    reset(){
      this.$refs.addRuleFormRef.resetFields()
    },
    addCloseDialog(){
      this.$refs.addRuleFormRef.resetFields()
    },
    changeCloseDialog(){
      this.$refs.changeRuleFormRef.resetFields()
    },
    changeUserInfo(){
      this.$refs.changeRuleFormRef.validate(async valid=>{
        if(!valid){
          return this.$message.error("验证不通过")
        }
        else{
          //服务器请求修改用户信息
          const {data:res3}=await this.$http.post('/changeUserInfo',this.changeForm)
          console.log(res3)
          this.changeDialogVisible=false
          this.$message.success(res3.message)
          this.getUserList()
        }
      })
    },
    changeUserReset(){
      this.$refs.changeRuleFormRef.resetFields()
    }
  },
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
