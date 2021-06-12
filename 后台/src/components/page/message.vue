<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>统计报表</el-breadcrumb-item>
      <el-breadcrumb-item>留言信息报表</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="width:700px;background-color:#f1f2f6;float:left;margin-right:40px;margin-top:40px;"><div id="chart1" :style="{width:'100%',height:'400px'}"></div></div>
    <div style="width:700px;background-color:#f1f2f6;float:left;margin-top:40px;"><div id="chart2" :style="{width:'100%',height:'400px'}"></div></div>
  </div>
</template>

<script>
export default {
mounted(){
    this.drawLine();
  },
  methods:{
    drawLine(){
      let chart1 = this.echarts.init(document.getElementById('chart1'),'light')
      chart1.setOption({
            title: { text: '留言数量饼图' },
            tooltip: {trigger: 'item'},
            legend: {
                top: '5%',
                left: 'center'
            },
            series: [{
                name: '2021年',
                type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
            },
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '40',
                    fontWeight: 'bold'
                }
            },
                labelLine: {
                  show: false
                },
                data: [{value: 1048, name: '过去一年'},
                {value: 735, name: '过去半年'},
                {value: 580, name: '过去一月'},
                {value: 200, name: '过去一周'},
                {value: 60, name: '今天'}]
            }]
        });

      let chart2 = this.echarts.init(document.getElementById('chart2'),'light')
      chart2.setOption({
        title:{text:'留言数量线形图'},
        xAxis: {
        type: 'category',
        data: ['过去一年', '过去半年', '过去一月', '过去一周', '今天']
    },
        tooltip: {},
        legend: {
          data:['2021年']
        },
    yAxis: {
        type: 'value'
    },
    series: [{
        name:'2021年',
        data: [1048, 735, 580, 200, 60],
        type: 'line',
        smooth: true
    }]
      })
    }
  }
}
</script>

<style>

</style>
