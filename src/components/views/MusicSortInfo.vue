<template>
  <div class="musicsort_info_warp">
      <div class="musicinfo_wrap">
        <div class="header_contain">
          <div class="header_img">
            <img :src="softplaylist.coverImgUrl" alt="">
          </div>
          <div class="header_info">
            <div class="musicsoft_name">{{softplaylist.name}}</div>
            <div class="musicsoft_creator_wrap">
              <div class="musicsoft_creator_img">
                <img :src="softplaylist.creator.avatarUrl" alt="">
              </div>
              <div class="musicsoft_creator_name">{{softplaylist.creator.nickname}}</div>
            </div>
            <div class="musicsoft_tags_wrap">
              <div class="softtags">标签：</div>
              <div class="softtags_text" v-for="(item,index) in softplaylist.tags" :key="index">{{item}}</div>
            </div>
            <div :class="['musicsoft_description',openorclose?'openorclose':'']">介绍：{{softplaylist.description}}</div>
            <div class="description_show" @click="handleOpenClose">{{openorclose?'展开':'收回'}}</div>
          </div>
        </div>
        <div class="musicsoft_list_wrap">
          <div class="musicsoft_list_header">
            <div class="musicsoft_list_header_title">
              <div class="title">歌曲列表</div>
              <div class="songcount">{{softplaylist.trackCount}}首歌</div>
            </div>
            <div class="musicsoft_playcount">播放：<div class="musicsoft_playcount_text">{{softplaylist.playCount}}</div>次</div>
          </div>
          <div class="musicsoft_list_content">
            <div class="musiclist_title">
              <div class="index"></div>
              <div class="songsname m_title">歌曲标题</div>
              <div class="songstime m_title" >时长</div>
              <div class="singer m_title">歌手</div>
              <div class="special_edition m_title">专辑</div>
            </div>
            <div @dblclick="currentSongClick(item.id)" class="musicesoft_list" v-for="(item,index) in softplaylist.tracks" :key="index">
              <div class="index">{{index+1}}</div>
              <div class="songsname">{{item.name}}</div>
              <div class="songstime">{{getSoftSongsTime(item.dt)}}</div>
              <div class="singer">
                <div class="singername" :title="getSongerName(item.ar)">{{getSongerName(item.ar)}}</div>
              </div>
              <div class="special_edition">{{item.al.name}}</div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import axios from '@/axios/axios.js' 
export default {
  name:'About',
  data(){
    return{
      softplaylist:{},
      openorclose:true,
      currentSongId:'',
      currentMusicSrc:''
    }
  },
  mounted:function(){
    this.getww();
    this.getPlaylistDetail();
  },
  methods: {
    getPlaylistDetail(){
      axios({
        url: '/playlist/detail?id='+this.$route.query.id,  
        method: 'post'
      })
        .then(res => {
          this.softplaylist = res.data.playlist;
        })
        .catch(err => {
          console.log(err)
        })
    },
    getww(){
      axios({
        url: '/playlist/detail?id='+this.$route.query.id,  
        method: 'post'
      })
        .then(res => {
          console.log(res);
          
        })
        .catch(err => {
          console.log(err)
        })
    },
    
    handleOpenClose(){
      this.openorclose = !this.openorclose;
    },
    getSoftSongsTime(time){
      let dt = Math.round(time/1000);
      let hour = Math.floor(dt/3600) <= 1 ? '' : Math.floor(dt/3600) + ':';
      let min = Math.floor(dt/60 % 60) < 10 ? '0' + Math.floor(dt/60 % 60) + ':':Math.floor(dt/60 % 60) + ':';
      let sec = Math.floor(dt % 60) < 10 ? '0' + Math.floor(dt % 60) : Math.floor(dt % 60);
      return hour+min+sec;
    },
    currentSongClick(id){
      axios({
        url: '/song/url?id='+id,  
        method: 'post'
      })
        .then(res => {
          console.log(res);
          this.currentMusicSrc = res.data.data[0].url;
          console.log(this.currentMusicSrc);
          
        }).then(res => {
          this.$emit('currentSong',this.currentMusicSrc,this.softplaylist.tracks,id);
        })
        .catch(err => {
          console.log(err)
        })
    },
    getSongerName(ar){
      let name = '';
      for(let i = 0;i < ar.length;i++){
        if(i < ar.length-1){
          name += ar[i].name + '/';
        }else{
          name += ar[i].name;
        }
      }
      return name;
    }
        
}
}
</script>

<style>
.musicsort_info_warp{
  background-color: #f5f5f5;
}
.musicinfo_wrap{
  margin: 0 180px;
  border-bottom: 1px solid #ddd;
  background-color: #fff;
  border-right: 1px solid #d3d3d3;
  border-left: 1px solid #d3d3d3;
  padding: 50px 50px;
}
.header_contain{
  width: 90%; 
  display: flex;
}
.header_img{
  flex: 2;
  justify-content: center;
  align-items: center;
  padding: 2px;
  width: 240px;
  height: 240px;
  border: 1px solid #cccccc;
  margin-bottom: 34px;
}
.header_img > img{
  width: 100%;
  height: 100%;
}
.header_info{
  flex: 5;
  margin-left: 40px;
  text-align: left;
}
.musicsoft_name{
  width: 80%;
  font-size: 25px;
  margin-bottom: 3%;
}
.musicsoft_creator_wrap{
  display: flex;
  align-items: center;
  margin-bottom: 2%;
}
.musicsoft_creator_img{
  width: 35px;
  height: 35px;
}
.musicsoft_creator_img > img{
  width: 100%;
  height: 100%;
}
.musicsoft_creator_name{
  font-size: 12px;
  color: #0C73C2;
  margin-left: 2%;
}
.musicsoft_tags_wrap{
  display: flex;
  align-items: center;
  margin-bottom: 1%;
  color: #666666;
  font-size: 12px;
}
.softtags{
  color: #666666;
}
.softtags_text{
  border: 1px solid #d1d1d1;
  background-color: #f7f7f7;
  border-radius: 25px;
  padding: 0 10px;
  color: #666666;
}
.musicsoft_description{
  width: 50%;
  color: #666666;
  font-size: 12px;
  white-space:normal;
}
.openorclose{
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}
.description_show{
  text-align: right;
  width: 50%;
  font-size: 11px;
  color: #0C73C2;
}

.musicsoft_list_wrap{
  width: 80%;
  color: #4d4d4d;
}
.musicsoft_list_header{
  display: flex;
  margin-bottom: 1%;
  justify-content: space-between;
}
.musicsoft_list_header_title{
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: 20%;
}
.title{
  font-size: 20px;
}
.songcount{
  font-size: 10px;
}
.musicsoft_playcount{
  display: flex;
  font-size: 14px;
  color: #666666;
  padding-top: 1.2%;
  align-items: center;
}
.musicsoft_playcount_text{
  color: #A2161B;
  font-weight: 600;
}
.musicsoft_list_content{
  border: 1px solid #d9d9d9;
  border-top: 2px solid #C20C0C;
  text-align: left;
}
.musiclist_title{
  display: flex;
  border-bottom: 1px solid #d9d9d9;
  background-image: linear-gradient(#fff, #e3e3e3);
  font-size: 14px;
}
.musicesoft_list:nth-child(odd){
  background-color: #eee;
}
.m_title{
  border-left: 1px solid #d9d9d9;
  padding: 0.5% 0;
  padding-left: 1%;
}
.musicesoft_list{
  display: flex;
  font-size: 15px;
  align-items: center;
}
.index{
  flex: 1;
  padding: 0.5% 0;
  padding-left: 1%;
}
.songsname{
  flex: 3;
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  padding-left: 1%;
}
.songstime{
  flex: 1;
  padding-left: 1%;
}
.singer{
  flex: 1;
  padding-left: 1%;
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.special_edition{
  flex: 2;
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  padding-left: 1%;
}
</style>
