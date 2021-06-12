<template>
  <div>
    <div class="headCount">
      <i class="el-icon-user-solid" style="font-size:60px;color:#70a1ff"></i>
      <div class="count">
        <p class="userCount">注册用户数</p>
        <p class="number">124</p>
      </div>
    </div>
    <div class="headCount">
      <i class="el-icon-chat-dot-round" style="font-size:60px;color:#ff6b81"></i>
      <div class="count">
        <p class="userCount">留言信息数</p>
        <p class="number">465</p>
      </div>
    </div>
    <div class="headCount">
      <i class="el-icon-present" style="font-size:60px;color:#2ed573"></i>
      <div class="count">
        <p class="userCount">音乐资源数</p>
        <p class="number">132</p>
      </div>
    </div>

    <div style="clear:both"></div>
    <div style="background-color:#f1f2f6;"><div id="main" :style="{width:'100%',height:'400px'}"></div></div>
    <div style="width:460px;background-color:#f1f2f6;float:left"><div id="chart1" :style="{width:'100%',height:'200px'}"></div></div>
    <div style="width:460px;background-color:#f1f2f6;float:left;margin:auto 10px;"><div id="chart2" :style="{width:'100%',height:'200px'}"></div></div>
    <div style="width:460px;background-color:#f1f2f6;float:left"><div id="chart3" :style="{width:'100%',height:'200px'}"></div></div>
  </div>
</template>

<script>
export default {
mounted(){
    this.drawLine();
  },
  methods: {
    drawLine(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.echarts.init(document.getElementById('main'),'light')
        // 绘制图表
        myChart.setOption({
            title: { text: '用户注册数与时间' },
            tooltip: {},
            legend: {
                data:['2020年','2021年']
            },
            xAxis: {
                data: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']
            },
            yAxis: {},
            series: [{
                name: '2020年',
                type: 'line',
                data: [52, 20, 36, 10, 10, 20,12,23,12,23,22,32],
                smooth : true,
            },{
              name:'2021年',
              type:'line',
              smooth:'ture',
              data:[12,22,12,2,2,23,36, 10, 10, 20,12,23]
            }]
        });
        let chart1 = this.echarts.init(document.getElementById('chart1'),'light')
        // 绘制图表
        chart1.setOption({
            title: { text: '歌曲上传' },
            tooltip: {},
            series: [{
                type: 'pie',
                data: [{value:235, name:'管理员上传歌曲数量'},
                {value:274, name:'用户上传歌曲数量'}]
            }]
        });
        let chart2 = this.echarts.init(document.getElementById('chart2'),'light')
        // 绘制图表
        chart2.setOption({
            title: { text: '社区信息' },
            tooltip: {},
            series: [{
                type: 'pie',
                data: [{value:235, name:'留言信息'},
                {value:274, name:'评论信息'},
                {value:310, name:'资源条数'},
                {value:335, name:'文章篇数'},
                {value:400, name:'教学视频数'}],
                roseType: 'angle',
            }]
        });
        let chart3 = this.echarts.init(document.getElementById('chart3'),'light')
        // 绘制图表
        chart3.setOption({
            title: { text: '' },
            tooltip: {},
            legend: {
                data:['音乐上传数量']
            },
            xAxis: {
              data: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']
            },
            yAxis: {},
            series: [{
                name: '音乐上传数量',
                type: 'bar',
                data: [1,2,12,3,13,21,23,1,2,12,3,13]
            }]
        });
    }
  }
}
</script>

<style scoped>
.headCount{
  background-color:#f1f2f6;
  width:300px;
  height:100px;
  float:left;
  padding:20px;
  margin:0 60px;
  border-radius:20px;
}
.count{
  display:inline-block;
  margin-left:150px;
}
.userCount{
  font-size:16px;
  font-weight: bold;
  color:#747d8c;
}
.number{
  text-align: center;
  color:#57606f;
  font-weight: 800;
}
#main{
  margin:20px auto;
}
</style>
