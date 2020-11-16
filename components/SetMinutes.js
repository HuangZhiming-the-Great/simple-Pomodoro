/* Global React */

class SetMinutes extends React.Component {
  constructor(props){
    super(props);

  }

  render(){
    return (
      React.createElement("div",{
        id:this.props.container.id,
        className:this.props.container.className
      },
        React.createElement("label",{
          id:this.props.label.id,
          className:this.props.label.className,
        },this.props.label.text),

        React.createElement("div",{
          id:this.props.setDiv.id,
          className:this.props.setDiv.className
        },
          React.createElement("button",{
            id:this.props.upButton.id,
            className:this.props.upButton.className,
            onClick:this.props.upButton.onClick
          },this.props.upButton.text),
          React.createElement("p",{
            id:this.props.showP.id,
            className:this.props.showP.className,
          },this.props.showP.text),
          React.createElement("button",{
            id:this.props.downButton.id,
            className:this.props.downButton.className,
            onClick:this.props. downButton.onClick
          },this.props.downButton.text)

        )

      )
    );
  }
}

export default SetMinutes;