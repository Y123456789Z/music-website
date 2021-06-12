<template>
  <el-container id="page">
    <el-header height="80px">
      <img src="../../assets/music_logo.png" alt="后台管理" width="60px" height="60px">
      <span class="sysName">论坛后台管理系统</span>
      <img class="adminHeader" src="../../assets/admin.jpg" alt="个人信息" width="60px" height="60px">
      <el-dropdown width="100px">
          <span class="down">
            欢迎你，{{username}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-circle-plus"><span @click="logout">登录</span></el-dropdown-item>
            <el-dropdown-item icon="el-icon-remove"><span @click="logout">退出</span></el-dropdown-item>
          </el-dropdown-menu>
      </el-dropdown>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <h3>菜单选项</h3>
        <el-menu router unique-opened default-active="/main">
          <el-menu-item index="/main">
            <i class="el-icon-s-home"></i>
            <span slot="title">概览</span>
          </el-menu-item>

          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-s-data"></i>
              <span>统计报表</span>
            </template>
            <el-menu-item index="/message"><i class="el-icon-menu"></i>留言信息报表</el-menu-item>
            <el-menu-item index="/resource"><i class="el-icon-menu"></i>资源信息报表</el-menu-item>
          </el-submenu>

          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-s-custom"></i>
              <span>个人中心</span>
            </template>
            <el-menu-item index="/personal"><i class="el-icon-menu"></i>个人信息管理</el-menu-item>
            <el-menu-item index="/upload"><i class="el-icon-menu"></i>资源上传</el-menu-item>
          </el-submenu>


          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-s-check"></i>
              <span>用户信息管理</span>
            </template>
            <el-menu-item index="/user"><i class="el-icon-menu"></i>用户管理</el-menu-item>
            <!-- <el-menu-item index="/check"><i class="el-icon-menu"></i>审核中心</el-menu-item> -->
          </el-submenu>

          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-s-tools"></i>
              <span>系统管理</span>
            </template>
            <el-menu-item index="/gongGao"><i class="el-icon-menu"></i>公告发布</el-menu-item>
            <el-menu-item index="/community"><i class="el-icon-menu"></i>社区信息管理</el-menu-item>
          </el-submenu>

          <el-menu-item index="/jifen">
            <i class="el-icon-s-opportunity"></i>
            <span slot="title">资源汇总</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data(){
    return {
      username:sessionStorage.username
    }
  },
  methods:{
    // handleCommand(command) {
    //     this.$message('click on item ' + command);
    //   }
    logout(){
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
#page{
  height:100%;
}
#page .el-header{
  background-color: #7bed9f;
  color:#ffffff;
}
#page .el-header img{
  border-radius:50%;
  margin-top:10px;
  background-color: #ffffff;
}
.adminHeader{
  position:absolute;
  right:220px;
}
.sysName{
  position:absolute;
  font-size:20px;
  top:30px;
  margin-left:10px;
}
#page .el-header .el-dropdown{
  position:absolute;
  width:200px;
  right:0;
  font-size:18px;
}
.down{
  color:#ffffff;
  line-height:80px;
}
#page .el-container{
  height:100%;
  background-color:#FFFFFF;
}
#page .el-container .el-aside{
  background-color: #f1f2f6;
}
#page .el-container .el-aside h3{
  text-align: center;
}
</style>
