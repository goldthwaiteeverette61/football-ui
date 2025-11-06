import { createWebHistory, createRouter, RouteRecordRaw } from 'vue-router';
/* Layout */
import Layout from '@/layout/index.vue';

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 * // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 * // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 * // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */

// 公共路由
export const constantRoutes: RouteRecordRaw[] = [
  {
        path: '/biz',
        component: Layout,
        hidden: true, // 父路由在菜单中隐藏
        children: [
            {
                path: 'user-follows/scheme-editor', // 定义访问路径
                name: 'SchemeEditor', // 定义一个唯一的路由名称
                component: () => import('@/views/biz/userFollows/SchemeEditor.vue'), // 指向您的组件文件
                meta: {
                    title: '方案赔率编辑器',
                    activeMenu: '/biz/user-follows' // 高亮跟投列表菜单
                },
                hidden: true // 这个页面不在菜单中直接显示
            }
        ]
    },
  {
    // 定义父级路由“系统管理”
    path: '/system',
    component: Layout, // 这里通常是你的主布局组件
    hidden: true, // 这个父路由本身不需要显示在菜单中
    // 子路由数组
    children: [
      {
        // 子路由的路径，会拼接在父级路径之后，最终访问地址为 /system/oss
        path: 'oss',
        name: 'Oss',
        component: () => import('@/views/system/oss/index.vue'),
        meta: {
          title: '对象存储',
          icon: 'system/oss',
        }
      },
      {
        // 配置管理页面，访问地址为 /system/oss/config
        path: 'oss/config',
        name: 'OssConfig',
        component: () => import('@/views/system/oss/config.vue'),
        meta: {
          title: 'OSS配置管理',
          // icon: 'system/oss', // 如有需要可加
        }
      },
      // 【【【【【 核心修正：在此处添加字典数据页面的路由定义 】】】】】
      {
        path: 'dict-data/index/:dictId', // 匹配 /system/dict-data/index/1 这样的路径
        name: 'Data',
        // 【核心修正】導入路徑已根據您的文件結構進行修正
        component: () => import('@/views/system/dict/data.vue'), // 指向字典数据的组件
        meta: {
          title: '字典数据',
          activeMenu: '/system/dict' // 保持“字典管理”菜单的高亮
        }
      }
    ]
  },
  {
    // 找到或创建一个父路由，它负责提供 Layout 框架
    path: '/tool',
    component: Layout,
    hidden: true, // 这个父路由本身不需要显示在菜单中
    children: [
      {
        name: 'GenEdit', // 强烈建议添加一个唯一的路由名称
        path: 'gen/edit-table/:tableId', // 这是相对于父路径 /tool 的路径
        // 这里正确指向你的页面组件
        component: () => import('@/views/tool/gen/editTable.vue'),
        meta: {
          title: '修改生成配置',
          // activeMenu 会让侧边栏的 /tool/gen 菜单保持高亮，用户体验更好
          activeMenu: '/tool/gen'
        }
      }
    ]
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/social-callback',
    hidden: true,
    component: () => import('@/layout/components/SocialCallback/index.vue')
  },
  {
    path: '/login',
    component: () => import('@/views/login.vue'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register.vue'),
    hidden: true
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/error/404.vue'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401.vue'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: '/index',
        component: () => import('@/views/index.vue'),
        name: 'Index',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: () => import('@/views/system/user/profile/index.vue'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  }
];

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes: RouteRecordRaw[] = [

];

/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_CONTEXT_PATH),
  routes: constantRoutes,
  // 刷新时，滚动条位置还原
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  }
});

export default router;