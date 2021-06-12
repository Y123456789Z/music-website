<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>公告发布</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form ref="addGongGaoFormRef" status-icon :rules="rules" :model="addGongGaoForm" label-width="200px">
        <el-form-item label="发布公告" prop="gongGaoText">
          <el-input type="textarea" placeholder="请输入公告内容" v-model="addGongGaoForm.gongGaoText" :rows="4"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="addGongGao()" style="margin-left:200px">立即发布</el-button>
          <el-button type="info" plain @click="GongGaoReset()">重置信息</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入管理员编号或姓名或公告编号" v-model="queryinfo.query" class="search" clearable @clear="getGongGaoList">
            <el-button slot="append" icon="el-icon-search" @click="getGongGaoList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="gongGaoList" border stripe>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="anounce_id" label="公告编号"></el-table-column>
        <el-table-column prop="admin_id" label="管理员编号"></el-table-column>
        <el-table-column prop="admin_name" label="管理员姓名"></el-table-column>
        <el-table-column prop="text" label="公告内容"></el-table-column>
        <el-table-column prop="time" label="发布时间"></el-table-column>
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

    <el-dialog title="编辑公告信息" :visible.sync="dialogVisible" @close="closeDialog">
      <el-form :model="editGongGao" status-icon :rules="editRules" ref="editGongGaoRef" label-width="100px">
        <el-form-item label="公告编号" prop="gongGaoId">
          <el-input type="text" v-model="editGongGao.gongGaoId" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="管理员编号" prop="adminId">
          <el-input type="text" v-model="editGongGao.adminId" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="公告信息" prop="text">
          <el-input type="text" v-model="editGongGao.text" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="发布时间" prop="time">
          <el-input v-model="editGongGao.time"></el-input>
        </el-form-item>
        <el-form-item label="管理员名称" prop="name">
          <el-input v-model="editGongGao.name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="editGongGaoSubmit()" style="margin-left:200px">确认修改</el-button>
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
      addGongGaoForm:{
        gongGaoText:"",
        mytime:""
      },
      rules:{
        gongGaoText:[{required: true, message: '请输入公告信息', trigger: 'blur'}]
      },
      editGongGao:{
        gongGaoId:"",
        adminId:"",
        text:"",
        time:"",
        name:""
      },
      editRules:{
        adminId:[],
        text:[{required: true, message: '请输入公告信息', trigger: 'blur'}],
        time:[{required: true, message: '请输入发布时间', trigger: 'blur'}],
        name:[]
      },
      queryinfo:{
        query:"",
        pagenum:1,
        pagesize:2
      },
      gongGaoList:[],
      total:0,
      dialogVisible:false
    }
  },
  created(){
    this.getGongGaoList()
    this.getTime()
  },
  methods: {
    getTime(){
      let time=new Date()
      let time1=time.getFullYear()
      let time2=time.getMonth()
      let time3=time.getDate()
      this.addGongGaoForm.mytime=time1+"年"+time2+"月"+time3+"日"
      console.log(this.addGongGaoForm.mytime)
    },
    addGongGao(){
      //发布公告
      this.$refs.addGongGaoFormRef.validate(valid=>{
        if(!valid){return this.$message.error("验证不通过！！！")}
        else{
          this.$http.post('/addGongGao',{adminName:sessionStorage.username,text:this.addGongGaoForm.gongGaoText,time:this.addGongGaoForm.mytime}).then(res=>{
            this.$message.success(res.data.message)
            this.$refs.addGongGaoFormRef.resetFields()
          }).catch(err=>{this.$messsage.error(err)})
        }
      })
    },
    GongGaoReset(){
      this.$refs.addGongGaoFormRef.resetFields()
    },
    getGongGaoList(){
      console.log("获取公告信息列表")
      this.$http.get('/gongGaoList',{params:this.queryinfo}).then((res)=>{
        console.log(res.data)
        this.gongGaoList=res.data.data.slice((this.queryinfo.pagenum-1) * this.queryinfo.pagesize,this.queryinfo.pagenum * this.queryinfo.pagesize)
        this.total=res.data.data.length
        console.log(this.gongGaoList)
      }).catch((err)=>{
        console.log(err)
        this.$message.error(err)
      })
    },
    handleSizeChange(val1) {
        console.log(`每页 ${val1} 条`);
        this.queryinfo.pagesize=val1
        this.getGongGaoList()
    },
    handleCurrentChange(val2) {
        console.log(`当前页: ${val2}`);
        this.queryinfo.pagenum=val2
        this.getGongGaoList()
    },
    handleEdit(index, row) {
        console.log(index, row)
        this.dialogVisible=true
        this.editGongGao.gongGaoId=row.anounce_id
        this.editGongGao.adminId=row.admin_id
        this.editGongGao.text=row.text
        this.editGongGao.time=row.time
        this.editGongGao.name=row.admin_name
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
            this.$http.post('/deleteGongGao',{messageId:row.message_id}).then((res)=>{
              console.log(res)
              this.$message({
              type: 'success',
              message: res.data.message
              })
              this.getGongGaoList()
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
    editGongGaoSubmit(){
      this.$refs.editGongGaoRef.validate(async valid=>{
        if(!valid){
          return this.$message.error("验证不通过")
        }
        else{
          this.$http.post('/editGongGao',this.editGongGao).then(res=>{
            console.log(res)
            this.$message.success(res.data.message)
            this.dialogVisible=false
            this.getGongGaoList()
          }).catch(err=>{
            console.log(err)
            this.$message.error(err)
          })
        }
      })
    },
    reset(){
      this.$refs.editGongGaoRef.resetFields()
    },
    closeDialog(){
      this.$refs.editGongGaoRef.resetFields()
    }
  },
}
</script>

<style scoped>
.el-card{
  margin-top:40px;
}
.gongGao{
  width:600px;
}
.el-table{
  margin-top:20px;
}
.el-pagination{
  margin-top:20px;
}
</style>
