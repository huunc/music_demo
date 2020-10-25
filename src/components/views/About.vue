<template>
  <div class="about">
    <el-button @click="getWangyi">获取热门歌单</el-button>
  </div>
</template>

<script>
import axios from '@/axios/axios.js' /*引入封装的axios*/

export default {
  name:'About',
  methods: {
    getWangyi () {
      axios({
        url: '/playlist/hot',  /*热门歌单接口地址*/
        method: 'post'
      })
        .then(res => {
          console.log("我拿到的数据：", res.data.tags)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
