<template>
  <div class="musicsort_warp">
    <div class="nav_wrap">
      <div class="nav_title">
        <button @click="handleSortSelect('全部')">全部</button>
      </div>
      <div class="sort_warp" v-for="(item1,index1) in categories" :key="index1">
        <div class="sort_title">{{item1}}</div>
        <div class="sort_content_wrap">
          <div class="sort_content" 
            v-for="(item2,index2) in sub.filter(obj=>obj.category==index1)" 
            :key="index2">
            <a :class="['sort_name',item2.name===currentSort?'actived':'']" @click="handleSortSelect(item2.name)">{{item2.name}}</a>
          </div>
        </div>
      </div>
    </div>
    <div class="sort_select">
      <div class="sort_text">
        当前选择：{{currentSort}}</div>
    </div>
    <div class="musicsort_content_wrap">
      <div class="musicsort_content" v-for="(item,index) in playlists" :key="index">
        <div class="musicsort_img">
          <img :src="item.coverImgUrl" alt="" :title="item.name">
        </div>
        <div class="musicsort_info">
          <div class="musicsort_name" @click="getPlaylistDetail(item.id)">{{item.name}}</div>
  
          <div class="musicsort_creator">by{{item.creator.nickname}}</div>
        </div>
      </div>
    </div>
    <div class="paging_wrap">
      <div class="paging_once" >&lt;上一页</div>
      <div :class="['paging_list',currentPage===1?'selected':'']" @click="handlePages(1)">1</div>
      <div class="paging_list" v-if="currentFirstPage >= 3">···</div>
      <div :class="['paging_list',currentPage===currentFirstPage?'selected':'']" @click="handlePages(currentFirstPage)">{{currentFirstPage}}</div>
      <div :class="['paging_list',currentPage===currentFirstPage+1?'selected':'']" @click="handlePages(currentFirstPage+1)">{{currentFirstPage+1}}</div>
      <div :class="['paging_list',currentPage===currentFirstPage+2?'selected':'']" @click="handlePages(currentFirstPage+2)">{{currentFirstPage+2}}</div>
      <div :class="['paging_list',currentPage===currentFirstPage+3?'selected':'']" @click="handlePages(currentFirstPage+3)">{{currentFirstPage+3}}</div>
      <div :class="['paging_list',currentPage===currentFirstPage+4?'selected':'']" @click="handlePages(currentFirstPage+4)">{{currentFirstPage+4}}</div>
      <div :class="['paging_list',currentPage===currentFirstPage+5?'selected':'']" @click="handlePages(currentFirstPage+5)">{{currentFirstPage+5}}</div>
      <div :class="['paging_list',currentPage===currentFirstPage+6?'selected':'']" @click="handlePages(currentFirstPage+6)">{{currentFirstPage+6}}</div>
      <div class="paging_list" v-if="currentFirstPage < total-8">···</div>
      <div :class="['paging_list',currentPage===total?'selected':'']" @click="handlePages(total)">{{total}}</div>
      <div class="paging_once" >下一页&gt;</div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios/axios.js'

export default {
    data(){
        return{
            sub:{},
            categories:{},
            playlists:{},
            currentSort:'全部',
            offset:0,
            limit:35,
            total:0,
            currentPage:1,
            currentFirstPage:2,
            privileges:{}
        }
    },
    mounted: function (){
      this.getCategories();
      this.getMusicSort();
    },
    methods: {
    //歌单分类
    getCategories () {
      axios({
        url: '/playlist/catlist',  /*热门歌单接口地址*/
        method: 'post'
      })
        .then(res => {
          console.log(this.currentSort);
          this.categories = res.data.categories;
          this.sub = res.data.sub;
        })
        .catch(err => {
          console.log(err)
        })
    },
    //显示歌单
    getMusicSort(){
      axios({
        url: '/top/playlist?limit='+this.limit,  
        method: 'post'
      })
        .then(res => {
          this.playlists = res.data.playlists;
          this.total = Math.ceil(res.data.total/this.limit);
          console.log("total:"+ this.total+";res.data.total:"+res.data.total+";this.limit:"+this.limit);
        })
        .catch(err => {
          console.log(err)
        })
    },
    //按分类显示歌单
    handleSortSelect(name){
      this.offset = 0;
      axios({
        url: '/top/playlist?cat='+name+'&limit='+this.limit+'&offset='+this.offset,  
        method: 'post'
      })
        .then(res => {
          this.currentSort = name;
          this.playlists = res.data.playlists;
          this.total = Math.ceil(res.data.total/this.limit);
          
          this.currentPage = 1;
          this.currentFirstPage = 2;
        })
        .catch(err => {
          console.log(err)
        })
    },
    //获取歌曲详情
    getPlaylistDetail(id){
      this.$router.push({  
        path:'/musicsortinfo',   
        query:{           
          id:id
        }
      })
     
    },
    //分页
    handlePages(num){
      if(num > 0 && num < 6){
        this.currentFirstPage = 2;
      }
      if(num >= 6 && num < this.total-4){
        this.currentFirstPage = num - 3;
      }
      if(num > this.total-4){
        this.currentFirstPage = this.total - 8;
      }
      this.currentPage = num;
      this.offset = (num-1)*this.limit;
      axios({
        url: '/top/playlist?cat='+name+'&limit='+this.limit+'&offset='+this.offset,  
        method: 'post'
      })
        .then(res => {
          this.playlists = res.data.playlists;
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style>

.musicsort_warp{
  background-color: #f5f5f5;
}
.nav_wrap{
  margin: 0 180px;
  border-bottom: 1px solid #ddd;
  background-color: #fff;
  border-right: 1px solid #d3d3d3;
  border-left: 1px solid #d3d3d3;
}
.nav_title{
  text-align: right;
  border-bottom: 1px solid #ddd;
  padding: 10px 60px;
}
.sort_warp{
  display: flex;
  justify-content: center;
  align-items: center;
}
.sort_title{
  flex: 1;
  font-weight: 600;
}
.sort_name{
  color: #000;
}
.sort_content_wrap{
  flex: 5;
  display: flex;
  flex-wrap: wrap;
  padding: 10px 10px;
  border-left: 1px solid #ddd;
}
.sort_content_wrap > .sort_content{
  padding: 0 8px;
  font-size: 15px;
}
.sort_content:after{ 
  content:"|";
  color: black;
  margin-left: 8px;
}
.sort_select{
  overflow: hidden;
  margin: 0 180px;
  background-color: #fff;
  text-align: left;
  border-right: 1px solid #d3d3d3;
  border-left: 1px solid #d3d3d3;
}
.sort_text{
  font-size: 20px;
  font-weight: 600;
  padding: 10px 50px;
  margin: 0 10px;
  border-bottom: 2px solid #c20c0c;
}
.musicsort_content_wrap{
  display: flex;
  flex-wrap: wrap;
  margin: 0 180px;
  background-color: #fff;
  border-right: 1px solid #d3d3d3;
  border-left: 1px solid #d3d3d3;
}
.musicsort_content{
  margin: 10px 26px;
  
}
.musicsort_img{
  width: 140px;
  height: 140px;
}
.musicsort_img > img{
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
}
.musicsort_info{
  width: 140px;
  margin-top: 10px;
}
.musicsort_name{
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  font-size: 15px;
  margin-bottom: 5px;
}
.musicsort_creator{
  font-size: 13px;
  color: #ccc;
}
.actived{
  color: #c20c0c;
}
.paging_wrap{
  display: flex;
  justify-content: center;
  align-items: center;
}
.paging_list{
  margin: 2% 0.5%;
  border: 1px solid #ccc;
  width: 2%;
  font-size: 5%;
}
.selected{
  color: #fff;
  background-color: #c20c0c;
  border: 1px solid #A2161B;
}
.paging_once{
  width: 4%;
  margin: 2% 1%;
  border: 1px solid #ccc;
  font-size: 5%;
}
</style>