import React from "react"
import moment from "moment"

export default class Clock extends React.Component {
    componentDidMount(){
        this.interval = setInterval(() => this.forceUpdate(), 2000)
    }
    componentWillUnmount(){
        clearInterval(this.interval);
    }
    render(){
        return (
            <div className="boss-header__time-value">
                {moment(new Date()).format("HH:mm")}
            </div>
        );
    }
}
