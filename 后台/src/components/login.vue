<template>
<div id="content">
    <el-form label-width="120px" :model="form" ref="loginForm" :rules="rules">
      <h2>
        <img src="../assets/admin.jpg">
      </h2>
      <el-form-item label="用户名" prop="name">
        <el-input v-model="form.name" prefix-icon="el-icon-user" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" prefix-icon="el-icon-lock" placeholder="请输入密码" type="password"></el-input>
      </el-form-item>
      <el-form-item class="btn">
        <el-button v-on:click="login" type="primary">登录</el-button>
        <el-button type="info" v-on:click="reset">重置</el-button>
      </el-form-item>
    </el-form>
</div>
</template>

<script>
export default {
  data(){
    return {
      form:{name:"",password:""},
      rules:{
        name: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
        password:[
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      }
    }
  },
  methods:{
    reset(){
      this.$refs.loginForm.resetFields()
    },
    login(){
      this.$refs.loginForm.validate(async valid=>{
        console.log(valid)
        if(!valid){
          return;
        }
        else{
          const {data:res}=await this.$http.post('/adminLogin',this.form)
          if(res.code==1){
            this.$message.error(res.message)
          }
          else{
            console.log(res.data)
            this.$message.success("登录成功")
            this.$router.push('/index')
            window.sessionStorage.setItem("username",res.data[0].user_name)
            window.sessionStorage.setItem("password",res.data[0].password)
            window.sessionStorage.setItem("email",res.data[0].email)
            window.sessionStorage.setItem("telphone",res.data[0].telphone)
            console.log(sessionStorage)
          }
        }
      })
    }
  }
}
</script>

<style scoped>
#content{
  width:100%;
  min-height: 800px;
  background-image:url('../assets/login/back_ground.jpg');
  background-repeat: no-repeat;
  background-size:100%;
}
#content .el-form{
  width:600px;
  height:400px;
  background-color:#dfe6e9;
  position:absolute;
  top:50%;
  left:50%;
  margin-left:-300px;
  margin-top:-300px;
  border-radius:10px;
  opacity:0.8
}
#content .el-form .el-input{
  width:400px;
}
#content h2{
  height:100px;
  width:100px;
  border:1px solid #eee;
  border-radius:50%;
  padding:8px;
  box-shadow:0 0 10px #ddd;
  margin-left:230px;
  background-color: #fff;
}
#content h2 img{
  height:100%;
  width:100%;
  border-radius: 50%;
  background-color:#eee;
}
.btn{
  margin-left: 80px;
}
</style>
