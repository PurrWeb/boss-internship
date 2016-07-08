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
        return <div style={{
            fontSize: 32,
            fontWeight: "bold",
        }}>
            {moment(new Date()).format("HH:mm")}
        </div>
    }
}
