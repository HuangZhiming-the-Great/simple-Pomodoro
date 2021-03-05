import SetMinutes from './components/SetMinutes.js';
import CounterMinutes from './components/CounterMinutes.js';


//import the ipcRender from electron
const { ipcRenderer } = require('electron');

// 存储electron-store的文件数据
let musicObject;

// 初始化两个音乐文件
ipcRenderer.on("init-music-files", (event, data)=>{
  musicObject=data;
  //查看音乐信息
  console.log("ipcrender");
  console.log(musicObject);
})

class Pomdoro extends React.Component {
  constructor(props){
    super(props);
    this.state={
      breakMinutes:5,
      sessionMinutes:25,
      state:"work",
      play:true,
      settingTime:false,
      timereboot:false,
      breakMusic: "",
      sessionMusic:""
    }
    this.resetTime=[25,5];
    this.changeSessionMinutes=this.changeSessionMinutes.bind(this);
    this.changeBreakMinutes=this.changeBreakMinutes.bind(this);
    this.changePlay=this.changePlay.bind(this);
    this.reset=this.reset.bind(this);
    this.resetTimer=this.resetTimer.bind(this);
    this.giveTimerTime=this.giveTimerTime.bind(this);
    this.onTime=this.onTime.bind(this);
    this.nextCountLength=this.nextCountLength.bind(this);
    this.handleInput=this.handleInput.bind(this);
  }

  _checkAndReturnNumber(data){
    if(data > 60){
      console.log('wo can\'t set minutes bigger then 60.' );
      return 60;
    }
    if(data <= 0){
      console.log('wo can\'t set minutes smaller then 0.' );
      return 1;
    }
    return data;
  }

  _changeState(){
    const data=this.state.state=="work"?"relax":"work";
    this.setState({
      state:data
    })
  }
  
  _playMusic(){
    const musicPlayer=document.getElementById("beep");
    switch(this.state.state){
      case 'work':
        musicPlayer.src=(this.state.sessionMusic);
        break;
      case 'relax':
        musicPlayer.src=(this.state.breakMusic);
        break;
    }
    musicPlayer.play();
  }

  _pauseMusic(){
    const musicPlayer=document.getElementById("beep");
    musicPlayer.pause();
  }

  _resetMusic(){
    const musicPlayer=document.getElementById("beep");
    musicPlayer.currentTime=0;
    musicPlayer.pause();
  }
  // 增加和减少休息时间的函数
  changeBreakMinutes(step){
    const data=this._checkAndReturnNumber(this.state.breakMinutes+step);
    this.setState({
      breakMinutes:data,
      settingTime:this.state.state==='work'?false:true
    })
  }
  // 增加和减少工作时间的函数
  changeSessionMinutes(step){
    const data=this._checkAndReturnNumber(this.state.sessionMinutes+step);
    this.setState({
      sessionMinutes:data,
      settingTime:this.state.state==='relax'?false:true
    })
  }
  // 重置时间和状态的函数
  reset(){
    this.setState({
      breakMinutes:5,
      sessionMinutes:25,
      state:"work",
      play:true,
      timereboot:true
    });
    this._resetMusic();

  }
  // 让Timer重置的函数
  resetTimer(){
    if(this.state.timereboot===true){
      this.setState({
        timereboot:false
      });
      return this.resetTime;
    }else{
      return [];
    }
  }
  // 设置Timer的时间的函数
  giveTimerTime(){
    if(this.state.settingTime===true){
      this.setState({
        settingTime:false
      });
      switch(this.state.state){
        case 'work':
          return [this.state.sessionMinutes,0];
        case 'relax':
          return [this.state.breakMinutes,0];
        default:
          return [];
      }
    }
    return [];
  }
  // 切换状态时，让声音停止的函数
  changePlay(){
    const data=this.state.play?false:true;
    this.setState({
      play:data
    })
    //修补点击暂停键音乐不停止的问题。
    if(data){
      const musicPlayer=document.getElementById("beep");
      if(musicPlayer.currentTime<musicPlayer.duration){
        this._playMusic();
      }
    }else{
      this._pauseMusic();
    }
  }

  // 获得用户设置的本地音乐文件，并上传到electron-store的文件中
  handleInput(file,propName){
    if(propName==="breakMusic"){
      this.setState({
        breakMusic:file.path
      }) 
      musicObject.breakMusic=file.path;
      ipcRenderer.send("change-breakMusic",file.path);
    }else{
      this.setState({
        sessionMusic:file.path
      })
      musicObject.sessionMusic=file.path;
      ipcRenderer.send("change-sessionMusic",file.path);
    } 
  }
  // 传递设置时间的函数
  nextCountLength(){
    return this.state.state==='work'? this.state.sessionMinutes:this.state.breakMinutes;
  }
  // 状态转换时的动作函数
  onTime(){
    this._changeState();
    this._playMusic();
  }

  // at this point the musicObject variable is not changed.
  componentDidMount(){
    // console.log("componentDidMount:")
    // console.log(musicObject);
  }
  
  componentWillUpdate(nextProps,nextState){
    // 下面是判断是否为第一次使用，还没有设置音乐。
    if(musicObject.sessionMusic=="" || musicObject.breakMusic==""){
      alert("至少缺少一个音乐文件，请设置:-)");
      return;
    }else{
      // 因为还对React组件的生命周期
      // 和electron的信息流通的前后把控不够，
      // 所以初始音乐文件只能事后在运行时加载
      // 在这个地方，使用setState()只能用一次！！！
      let check=0; // bit 00
      if(nextState.breakMusic == ""){
        check=check | 2; //bit 10
      } 
      if(nextState.sessionMusic == ""){
        check=check | 1; //bit 01
      }
      // 如果已经配置好了音乐文件就忽略下面的问题。
      if(check==0){
        return;
      }
      console.log(check);
      switch(check){
        case 1:
          this.setState({
            sessionMusic:musicObject.sessionMusic
          })
        break;
        case 2:
          this.setState({
            breakMusic:musicObject.breakMusic,
          })
        break;
        case 3:
          this.setState({
            breakMusic:musicObject.breakMusic,
            sessionMusic:musicObject.sessionMusic
          })
        break;
        case 0:
          default:
        break;
      }
    }
    
  }

  render(){
    return (
      React.createElement("div",{
        id:"App",
        className:"promoro-app-container"
      },
        React.createElement(SetMinutes,{
          container:{
            id:"set-break-minutes-container",
            className:"container"},
          label:{
            id:"break-label",
            text:"Break"},
          setDiv:{
            id:"set-break-div",
            className:"inner-container"},
          upButton:{
            id:"break-increment",
            className:"updown-button",
            text:"increase",
            onClick:()=>this.changeBreakMinutes(1)},
          showP:{
            id:"break-length",
            className:"show-length",
            text:this.state.breakMinutes},
          downButton:{
            id:"break-decrement",
            className:"updown-button",
            text:"decrease",
            onClick:()=>this.changeBreakMinutes(-1)},
          input:{
            onChange:(file)=>{this.handleInput(file,"breakMusic")}
          }
        }),
        React.createElement(SetMinutes,{
          container:{
            id:"set-session-minutes-container",
            className:"container"},
          label:{
            id:"session-label",
            text:"Session"},
          setDiv:{
            id:"set-session-div",
            className:"inner-container"},
          upButton:{
            id:"session-increment",
            className:"updown-button",
            text:"increase",
            onClick:()=>this.changeSessionMinutes(1)},
          showP:{
            id:"session-length",
            className:"show-length",
            text:this.state.sessionMinutes},
          downButton:{id:"session-decrement",
          className:"updown-button",
          text:"decrease",
          onClick:()=>this.changeSessionMinutes(-1)},
          input:{
            onChange:(file)=>{this.handleInput(file,"sessionMusic")}
          }
        }),

        React.createElement(CounterMinutes,{
          container:{
            id:"show-timer-container",
            className:"container"},
          label:{
            id:"timer-label",
            text:this.state.state},
          setDiv:{
            id:"show-timer-div",
            className:"inner-container"},
          showP:{
            id:"time-left",
            className:"timer",
            go:this.state.play,
            setTime:this.resetTimer,
            giveTimerTime:this.giveTimerTime,
            noTime:this.onTime,
            nextCountLength:this.nextCountLength},
          play:{
            id:"start_stop",
            className:"start-stop-button",
            text:"run-pause",
            onClick:this.changePlay
          },
          reset:{
            id:"reset",
            className:"reset-button",
            text:"reset",
            onClick:this.reset
          }
        })
      )
    );
  }
}

ReactDOM.render(React.createElement(Pomdoro,null),document.getElementById("root"));