import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/dataOriginManagement' // 从定向
    },
    {
      path: '/home',
      name: '首页',
      component: Home,
      children: [
        {
          path: '/dataOriginManagement',
          name: '数据源管理',
          component: () => import('./views/dataOriginManagement.vue')
        },
        {
          path: '/instrumentPanelMake',
          name: '仪表盘制作',
          component: () => import('./views/instrumentPanelMake.vue')
        },
        {
          path: '/statementManagement',
          name: '报表管理',
          component: () => import('./views/statementManagement.vue')
        },
        {
          path: '/statementMake',
          name: '报表制作',
          component: () => import('./views/statementMake.vue')
        },
        {
          path: '/reportTable',
          name: '报表表格',
          component: () => import('./views/reportTable.vue')
        },
        {
          path: '/modelManagement',
          name: '模型管理',
          component: () => import('./views/modelManagement.vue')
        },
        {
          path: '/fieldManagement',
          name: '字段管理',
          component: () => import('./views/fieldManagement.vue')
        },
        {
          path: '/roleManagement',
          name: '角色管理',
          component: () => import('./views/roleManagement.vue')
        },
        {
          path: '/accountManagement',
          name: '账号管理',
          component: () => import('./views/accountManagement.vue')
        },
        {
          path: '/menuManagement',
          name: '菜单管理',
          component: () => import('./views/menuManagement.vue')
        }
      ]
    }
  ]
})
/* {
  path: '/BigScreenSchool',
  name: 'BigScreenSchool',
  component: () => import('./views/BigScreenSchool.vue')
},
{
  path: '/APIList',
  name: 'APIList',
  component: () => import('./views/APIList.vue')
} */
