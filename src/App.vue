<template>
  <div id="app">
    <div class="musiccontent_warp">
      <div class="header_wrap">
        <div class="header_title">网易云音乐</div>
        <el-button type="success">成功按钮</el-button>
      </div>
      <div class="header_nav">
        <router-link class="nav_text" to="/musicsort">歌单分类</router-link>
        <router-link class="nav_text" to="/ranklist">排行榜</router-link>
        <router-link class="nav_text" to="/radiostation">主播电台</router-link>
        <router-link class="nav_text" to="/vocalist">歌手</router-link>
      </div>
      <div class="content_warp">
        <router-view @currentSong='getCurrentMusicSrc'></router-view>
      </div>
    </div>

    <div class="soundcontrol" v-show="showSound">
      <div class="soundprogress"></div>
      <div class="soundfocus"></div>
    </div>
    <!--底部播放器-->
    <div class="starton_warp">
      <div class="broadcast_warp">
        <div class="songselect" @click="handleLastMusic">
          <img src="./icon/shangyishou.png" alt="">
        </div>
        <div class="songselect broadcast" @click="songPause" v-show="pause">
          <img src="./icon/zanting.png" alt="">
        </div>
        <div class="songselect broadcast" @click="songPause" v-show="play">
          <img src="./icon/bofang.png" alt="">
        </div>
        <div class="songselect iconfont icon-xiayishou" @click="handleNextMusic">
          <img src="./icon/xiayishou.png" alt="">
        </div>
        <div class="musicimg">
          <img src="" alt="">
        </div>
        
        <div class="progress_wrap">
          <div class="progress_bottom" id="progress_bottom" @click="handleProgress"></div>
          <div class="focus" id="focus"></div>
        </div>
        <div class="songtime">{{currentMusicTime}}/{{sumtime}}</div>
        <audio id="playMusic" autoplay="autoplay" :src="currentMusicSrc" controls hidden>
          Your browser does not support the audio element.
        </audio>
        
        <div class="musicsound" @click="handleShowSound">
          <img src="./icon/shengyin.png" alt="">
        </div>
        <div class="musicplay_style" v-show="playstyle===0" @click="handlePlayStyle" title="顺序播放">
          <img src="./icon/shunxubofang.png" alt="">
        </div>
        <div class="musicplay_style" v-show="playstyle===1" @click="handlePlayStyle" title="随机播放">
          <img src="./icon/suijibofang.png" alt="">
        </div>
        <div class="musicplay_style" v-show="playstyle===2" @click="handlePlayStyle" title="列表循环">
          <img src="./icon/xunhuan.png" alt="">
        </div>
        <div class="musicplay_style" v-show="playstyle===3" @click="handlePlayStyle" title="单曲循环">
          <img src="./icon/danquxunhuan.png" alt="">
        </div>
        <div class="musicsong_list_wrap">
          <img src="./icon/bofangliebiao.png" alt="">
          <div class="list_num">{{currentSoftplaylist.length}}</div>
        </div>
      </div>
      
    </div>
  </div>
</template>
<script>
import axios from '@/axios/axios.js';
export default {
  name: 'App',
   data(){
        return{
          currentMusicSrc:'',
          index:0,
          play:false,
          pause:true,
          currentMusicTime:'00:00',
          sumtime:'00:00',
          currentSoftplaylist:{},
          showSound:false,
          playstyle:0
        }
    },
    mounted: function (){
      var obj = document.getElementById('focus');
      //obj.style.cssText = "animation: myfirst 5s;animation-fill-mode:forwards;";
      var music = document.getElementById("playMusic");
      music.volume = 0.5;
    },
    methods:{
      getCurrentMusicSrc(src,softplaylist,id){
        console.log('src就绪');
        this.currentMusicSrc = src;
        this.currentSoftplaylist = softplaylist;
        this.index = id;
        console.log(this.currentSoftplaylist);
        console.log('src就绪完毕');

        var music = document.getElementById("playMusic");
        if (music.paused) { //判读是否播放 
          this.play = true;
          this.pause = false;
          console.log('music播放');
          music.play();
          let that = this;
          music.addEventListener("canplay", function(){//监听audio是否加载完毕，如果加载完毕，则读取audio播放时间
            console.log('music播放成功');
            console.log(music.duration);
            let duration = music.duration;
            let currentTime = music.currentTime;
            that.sumtime = that.getMTime(duration);
            that.currentMusicTime = that.getMTime(currentTime);
            music.addEventListener("timeupdate", function(){
              that.currentMusicTime = that.getMTime(music.currentTime);
            });
          });
        }
          
      },
      songPause(){
        var music = document.getElementById("playMusic");
        if(music.paused){
          this.pause = false;
          this.play = true;
          music.play();
        }else{
          this.pause = true;
          this.play = false;
          music.pause();
        }
      },
      getMTime(dt){
        let hour = Math.floor(dt/3600) <= 1 ? '' : Math.floor(dt/3600) + ':';
        let min = Math.floor(dt/60 % 60) < 10 ? '0' + Math.floor(dt/60 % 60) + ':':Math.floor(dt/60 % 60) + ':';
        let sec = Math.floor(dt % 60) < 10 ? '0' + Math.floor(dt % 60) : Math.floor(dt % 60);
        return hour+min+sec;
      },
      handleProgress(e){
        console.log(e);
        if(this.play == true){
          var music = document.getElementById("playMusic");
          let focusX = document.getElementById('focus').clientWidth; 
          let clickX = e.offsetX;
          let progressW = document.getElementById('progress_bottom').offsetWidth;  
          console.log(focusX);
          console.log(clickX);
          let dict = clickX - focusX/2;
          /**
           * transform:translateX(-50%);
            -ms-transform:translateX(-50%);
            -webkit-transform:translateX(-50%);
          */
          var obj = document.getElementById('focus');
          obj.style.cssText = "transform:translateX("+dict+"px);";
          let time = music.duration * clickX/progressW;
          console.log(time);
          console.log(music.seekable.end(0));
          console.log(music.seekable.end(music.seekable.length - 1));
          if(time < music.seekable.end(music.seekable.length - 1)){
            music.currentTime = time;
            this.currentMusicTime = this.getMTime(time);
          }else{
            music.currentTime = music.buffered.end(music.buffered.length -1);
          }
        }
      },
      handleShowSound(e){
        this.showSound = !this.showSound;
        var music = document.getElementById("playMusic");
        let sound = e.clientX;
        console.log(sound);
        
      },
      handlePlayStyle(){
        if(this.playstyle == 3){
          this.playstyle = 0;
        }else{
          this.playstyle++;
        }
      },
      handleLastMusic(){
        for(let i=0;i<this.currentSoftplaylist.length;i++){
          if(this.index ==this.currentSoftplaylist[i].id){
            if(i==0){
              axios({
                url: '/song/url?id='+this.currentSoftplaylist[this.currentSoftplaylist.length-1].id,  
                method: 'post'
              })
                .then(res => {
                  this.getCurrentMusicSrc(res.data.data[0].url,this.currentSoftplaylist,this.currentSoftplaylist[this.currentSoftplaylist.length-1].id);
                })
                .catch(err => {
                  console.log(err)
                })
            }else{
              axios({
                url: '/song/url?id='+this.currentSoftplaylist[i-1].id,  
                method: 'post'
              })
                .then(res => {
                  this.getCurrentMusicSrc(res.data.data[0].url,this.currentSoftplaylist,this.currentSoftplaylist[i-1].id);
                })
                .catch(err => {
                  console.log(err)
                })
            }
          }
        }
      },
      handleNextMusic(){
        for(let i=0;i<this.currentSoftplaylist.length;i++){
          if(this.index ==this.currentSoftplaylist[i].id){
            if(i==this.currentSoftplaylist.length-1){
              axios({
                url: '/song/url?id='+this.currentSoftplaylist[0].id,  
                method: 'post'
              })
                .then(res => {
                  this.getCurrentMusicSrc(res.data.data[0].url,this.currentSoftplaylist,this.currentSoftplaylist[0].id);
                })
                .catch(err => {
                  console.log(err)
                })
            }else{
              axios({
                url: '/song/url?id='+this.currentSoftplaylist[i+1].id,  
                method: 'post'
              })
                .then(res => {
                  this.getCurrentMusicSrc(res.data.data[0].url,this.currentSoftplaylist,this.currentSoftplaylist[i+1].id);
                })
                .catch(err => {
                  console.log(err)
                })
            }
          }
        }
      },
    }
}

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
a {
    color: #fff;
    text-decoration: none;
}
.header_wrap{
  background-color: #242424;
  display: flex;
  justify-content: center;
  align-items: center;
}
.header_title{
  color: #fff;
  padding-right: 60%;
  font-size: 34px;
  font-weight: 600;
}
.header_nav{
  background-color: #c20c0c;
}
.nav_text{
  margin: 0 10px;
}

.content_warp{
}
.musiccontent_warp{
  margin-bottom: 60px;
}
.starton_warp{
  position: fixed;
  height: 45px;
  background-color: #fff;
  left: 0;
  right: 0;
  bottom: 0;
}
.broadcast_warp{
  display: flex;
  justify-content: center;
  align-items: center;
}
.songselect{
  width: 30px;
  height: 30px;
  margin: 5px 5px;
}
.songselect > img {
  width: 100%;
  height: 100%;
}
.progress_wrap{
  width: 300px;
  height: 10px;
}
.progress_bottom{
  width: 300px;
  height: 5px;
  background-color: #000;
  border-radius: 25px;
  position:absolute;
  margin-top: 2px;
}
.songtime{

}
@keyframes myfirst
{
    from {}
    to {transform:translateX(290px)}
}
.focus{
  width: 10px;
  height: 10px;
  border-radius: 25px;
  background-color: red;
  position:absolute;
  
}
.musicsound{
  width: 20px;
  height: 20px;
  margin: 5px 5px;
}
.musicsound > img{
  width: 100%;
  height: 100%;
}
.soundcontrol{
  position: fixed;
  width: 20px;
  height: 80px;
  opacity: 0.7;
  background-color: #000;
  bottom: 45px;
  left: 65.5%;
}
.soundprogress{
  width: 5px;
  height: 70px;
  background-color: #fff;
  border-radius: 25px;
  margin: auto;
  margin-top: 5px;
}
.soundfocus{
  width: 5px;
  height: 5px;
  border-radius: 25px;
  background-color: red;
  position:absolute;
  margin-top: 5px;
  margin: auto;
}
.musicplay_style{
  width: 20px;
  height: 20px;
  margin: 5px 5px;
}
.musicplay_style > img{
  width: 100%;
  height: 100%;
}
.musicsong_list_wrap{
  width: 20px;
  height: 20px;
  margin: 5px 5px;
}
.musicsong_list_wrap > img{
  width: 100%;
  height: 100%;
}
.list_num{}
</style>
