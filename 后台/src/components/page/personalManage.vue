<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
      <el-breadcrumb-item>个人信息管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="ruleForm.username" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model.number="ruleForm.email" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" prop="telphone">
          <el-input v-model.number="ruleForm.telphone" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dialogVisible = true">修改信息</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-dialog title="修改信息" :visible.sync="dialogVisible" @close="closeDialog">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" prop="telphone">
          <el-input v-model="ruleForm.telphone"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="change()" style="margin-left:200px">确认修改</el-button>
          <el-button type="info" plain @click="reset()">重置信息</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return {
      ruleForm:{
        username:sessionStorage.username,
        password:sessionStorage.password,
        email:sessionStorage.email,
        telphone:sessionStorage.telphone
      },
      rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password:[
            {required: true, message: '请输入密码', trigger: 'blur'}
          ],
          email:[
            {required: false, message: '请输入email', trigger: 'blur'}
          ],
          telphone:[
            {required: true, message: '请输入电话号码', trigger: 'blur'}
          ],
        },
      dialogVisible: false
    }
  },
  created(){
    this.getAdmininfo()
  },
  methods:{
    getAdmininfo(){
      this.$http.post('/admininfo',{name:this.ruleForm.username}).then((res)=>{
        console.log(res.data.data[0].user_name)
        sessionStorage.username=res.data.data[0].user_name
        sessionStorage.password=res.data.data[0].password
        sessionStorage.password=res.data.data[0].email
        sessionStorage.password=res.data.data[0].telphone
      }).catch(err=>{console.log(err)})
    },
    reset(){
      this.$refs.ruleFormRef.resetFields()
    },
    change(){
      this.$refs.ruleFormRef.validate(async valid=>{
        if(!valid){
          return this.$message.error("验证不通过")
        }
        else{
          //服务器请求修改管理员信息
          const {data:res}=await this.$http.post('changeAdminInfo',this.ruleForm)
          console.log(res)
          this.dialogVisible=false
          this.$message.success(res.message)
          this.getAdmininfo()
        }
      })
    },
    closeDialog(){
      this.$refs.ruleFormRef.resetFields()
    }
  }
}
</script>

<style scoped>
.el-card{
  margin-top:40px;
}
.el-card .el-button{
  width:300px;
  margin-left:400px;
}
</style>
