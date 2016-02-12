import React from "react"

class StaffHolidaysList extends React.Component {
    static propTypes = {
        staffId: React.PropTypes.number.isRequired
    }
    render(){
        return <div>TODO: show holidays for {this.props.staffId}</div>
    }
}

export default StaffHolidaysList