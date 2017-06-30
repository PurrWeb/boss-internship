import React from 'react';
import Timer from './timer.styled';

export default class CountDown extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { time: {}, seconds: this.props.countdown, readableTime: "" };
    this.timer = 0;
    this.startTimer();
  }

  secondsToTime(secs){
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      "m": minutes,
      "s": seconds
    };
    return obj;
  }

  componentDidMount() {
    let timeLeftVar = this.secondsToTime(this.state.seconds);
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
      time: this.secondsToTime(seconds),
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
      <p>
        <Timer>{this.state.readableTime}</Timer>
      </p>
    )
  }
}