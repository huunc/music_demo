import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import About from '@/components/views/About'
import Musicsort from '@/components/views/Musicsort'
import Ranklist from '@/components/views/Ranklist'
import Radiostation from '@/components/views/Radiostation'
import Vocalist from '@/components/views/Vocalist'
import MusicsortInfo from '@/components/views/MusicsortInfo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
      redirect:'/musicsort'
    },
    {
      path: '/musicsort',
      name: 'Musicsort',
      component: Musicsort
    },
    {
      path: '/ranklist',
      name: 'Ranklist',
      component: Ranklist
    },
    {
      path: '/radiostation',
      name: 'Radiostation',
      component: Radiostation
    },
    {
      path: '/vocalist',
      name: 'Vocalist',
      component: Vocalist
    },
    {
      path: '/musicsortinfo',
      name: 'MusicsortInfo',
      component: MusicsortInfo
    }
  ]
})
