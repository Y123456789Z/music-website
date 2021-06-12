import Vue from 'vue'
import Router from 'vue-router'
import login from '../components/login'
import index from '../components/page/index'
import main from '../components/page/main'
import message from '../components/page/message'
import resource from '../components/page/resource'
import personal from '../components/page/personalManage'
import upload from '../components/page/upload'
import user from '../components/page/userManage'
import check from '../components/page/check'
import gongGao from '../components/page/gongGao'
import community from '../components/page/community'
import jifen from '../components/page/jifen'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      redirect:'/login'
    },
    {
      path:'/login',
      name:'login',
      component:login,
      meta:{
        // 页面标题title
        title: '登录页'
    }
    },
    {
      path:'/index',
      name:'index',
      component:index,
      redirect:'/main',
      //页面子组件
      children:[{
        path:'/main',
        name:'main',
        component:main,
        meta:{
          // 页面标题title
          title: '概览'
        }
      },{
        path:'/message',
        name:'message',
        component:message,
        meta:{title:'留言信息报表'}
      },{
        path:'/resource',
        name:'resource',
        component:resource,
        meta:{title:'资源信息报表'}
      },{
        path:'/personal',
        name:'personal',
        component:personal,
        meta:{title:'个人信息管理'}
      },{
        path:'/upload',
        name:'upload',
        component:upload,
        meta:{title:'上传资源'}
      },{
        path:'/user',
        name:'user',
        component:user,
        meta:{title:'用户管理'}
      },{
        path:'/check',
        name:'check',
        component:check,
        meta:{title:'审核中心'}
      },{
        path:'/gongGao',
        name:'gongGao',
        component:gongGao,
        meta:{title:'公告发布'}
      },{
        path:'/community',
        name:'community',
        component:community,
        meta:{title:'社区信息管理'}
      },{
        path:'/jifen',
        name:'jifen',
        component:jifen,
        meta:{title:'资源汇总'}
      }]
    }
  ]
})
