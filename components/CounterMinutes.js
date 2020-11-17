/* Global React */

import Timer from './Timer.js';

class CounterMinutes extends React.Component {
  constructor(props){
    super(props);

  }

  render(){
    return (
      React.createElement("div",{
        id:this.props.container.id,
        className:this.props.container.className
      },React.createElement("label",{
          id:this.props.label.id,
          className:this.props.label.className
        },this.props.label.text),
        React.createElement(Timer,{
          id:this.props.showP.id,
          className:this.props.showP.className,
          go:this.props.showP.go,
          setTime:this.props.showP.setTime,
          giveTimerTime:this.props.showP.giveTimerTime,
          noTime:this.props.showP.noTime,
          nextCountLength:this.props.showP.nextCountLength
        }),
        React.createElement("div",{
          id:this.props.setDiv.id,
          className:this.props.setDiv.className,
        },
          React.createElement("button",{
            id:this.props.play.id,
            className:this.props.play.className,
            onClick:this.props.play.onClick
          },this.props.play.text),        React.createElement("button",{
            id:this.props.reset.id,
            className:this.props.reset.className,
            onClick:this.props.reset.onClick
          },this.props.reset.text)
        )
      
      )
    );
  }
}
export default CounterMinutes;