import SetMinutes from './components/SetMinutes.js';
import CounterMinutes from './components/CounterMinutes.js';

class Pomdoro extends React.Component {
  constructor(props){
    super(props);
    this.state={
      breakMinutes:5,
      sessionMinutes:0,
      state:"work",
      play:true,
      settingTime:false,
      timereboot:false,
      breakMusic:"/home/huang/音乐/十三月.mp3",
      sessionMusic:"/home/huang/音乐/十三月.mp3"
    }
    this.resetTime=[25,0];
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
  _fileToURL(f){
    //如果没有选择音乐，就返回一个默认的音乐地址
    if(f==={}){
      return "/home/huang/音乐/十三月.mp3";
    }
    let url;
    if(window.createObjectURL){
      url = window.createObjectURL(f)
    }else if(window.createBlobURL){
      url = window.createBlobURL(f)
    }else if(window.URL && window.URL.createObjectURL){
      url = window.URL.createObjectURL(f)
    }else if(window.webkitURL && window.webkitURL.createObjectURL){
      url = window.webkitURL.createObjectURL(f)
    }
    return url;
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
  
  changeBreakMinutes(step){
    const data=this._checkAndReturnNumber(this.state.breakMinutes+step);
    this.setState({
      breakMinutes:data,
      settingTime:this.state.state==='work'?false:true
    })
  }

  changeSessionMinutes(step){
    const data=this._checkAndReturnNumber(this.state.sessionMinutes+step);
    this.setState({
      sessionMinutes:data,
      settingTime:this.state.state==='relax'?false:true
    })
  }

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

  // 获得用户设置的本地音乐文件
  handleInput(file,propName){
    propName==="breakMusic"? this.setState({
      breakMusic:file.path
    }) : this.setState({
      sessionMusic:file.path
    })
  }

  nextCountLength(){
    return this.state.state==='work'? this.state.sessionMinutes:this.state.breakMinutes;
  }

  onTime(){
    this._changeState();
    this._playMusic();
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