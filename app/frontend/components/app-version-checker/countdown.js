import React from 'react';
import utils from '~lib/utils';
export default class CountDown extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { time: utils.secondsToTime(this.props.countdown), seconds: this.props.countdown, readableTime: "" };
    this.state.readableTime = this.readableTime();
    this.timer = 0;
    this.startTimer();
  }

  componentDidMount() {
    let timeLeftVar = utils.secondsToTime(this.state.seconds);
    this.setState({ time: timeLeftVar });
  }

  startTimer = () => {
    if (this.timer == 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  countDown = () => {
    let seconds = this.state.seconds - 1;
    this.setState({
      time: utils.secondsToTime(seconds),
      seconds: seconds,
      readableTime: this.readableTime(),
    });
    
    if (seconds == 0) { 
      clearInterval(this.timer);
      window.location.reload(true);
    }
  }

  readableTime() {
    let minutes = this.state.time.m < 10 ? `0${this.state.time.m}` : this.state.time.m; 
    let seconds = this.state.time.s < 10 ? `0${this.state.time.s}` : this.state.time.s;
    return `${minutes} : ${seconds}`; 
  }

  render() {
    return (
      <span className="boss-notification__text-counter">
        {"\u00a0" + this.state.readableTime + "\u00a0"}
      </span>
    )
  }
}