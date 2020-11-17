/* Global React ReactDOM */

class Timer extends React.Component {
  constructor(props){
    super(props);
    this.state={
      minutes:25,
      seconds:0,
      go:true
    }
    this.originTime=[25,0];
    this.timer=this.timer.bind(this);
    this.format=this.format.bind(this);
    this.timeInt=null;
  }

  format(num){
    // check the number.
    if(num<0){
      console.log("Wrong! the timer can't display a negative time number!");
      return "";
    }

    if(num<10){
      return '0'+num;
    }
    return num.toString();
  }

  timer(){
    let minutes=this.state.minutes;
    let seconds=this.state.seconds;
    if(minutes > 0 || seconds > 0){
      if(seconds===0){
        this.setState({
          minutes:minutes-1,
          seconds:59
        })
      }else{
        this.setState({
          seconds:seconds-1
        })
      }
    }else{
      
      this.props.noTime();
      this.setState({
        minutes:this.props.nextCountLength() || this.originTime[0]});
      //console.log("play('music')");
      /*
      this.setState({
        minutes:this.props.minutes || this.state.minutes,
        seconds:0
      })
      */
    }
  }

  componentWillMount(){
    console.log("before render");
    this.setState({
      minutes:this.props.nextCountLength() || this.originTime[0],
    })
  }

  componentDidMount(){
    console.log("mount");
    this.timeInt=setInterval(this.timer,1000);
    console.log(this.timeInt);
  }


  componentWillUpdate(){
    const time=this.props.setTime();
    if(time.length!==0){
      this.setState({
        minutes:time[0],
        seconds:time[1]
      })
    }
    const set=this.props.giveTimerTime();
    if(set.length!==0){
      this.setState({
        minutes:set[0],
        seconds:set[1]
      })
    }
  }

  componentDidUpdate(){
    if(this.props.go!==this.state.go){
      this.setState({
        go:this.props.go
      })
    }
    
    if(this.state.go===false){
      clearInterval(this.timeInt);
      this.timeInt=null;
    }else{
      if(this.timeInt===null){
        this.timeInt=setInterval(this.timer,1000);
        console.log(this.timeInt);
      }
    }
  }

  componentWillUnmount(){
    console.log("unmount");
    clearInterval(this.timeInt);
  }

  render(){
    return (
      React.createElement("p",{
        id:this.props.id,
        className:this.props.className
      },`${this.format(this.state.minutes)}:${this.format(this.state.seconds)}`)
    );
  }
}

/*
class App extends React.Component {
  constructor(props){
    super(props);
    this.state={
      go:true
    }
    this.handleClick=this.handleClick.bind(this);
  }


  handleClick(){
    this.setState({
      go:this.state.go? false : true
    }) 
  }

  render(){
    return (
      React.createElement("div",{},
        React.createElement(Timer,{
          minutes:1,
          go:this.state.go,
          beep:()=>{console.log("beep!")}
        }),
        React.createElement("button",{
          onClick:this.handleClick
        },"change go")
      )
    );
  }
}

ReactDOM.render(React.createElement(App,null),document.getElementById("root"));
*/

export default Timer;
