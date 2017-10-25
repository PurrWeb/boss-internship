import PropTypes from 'prop-types';
import React from "react"
import moment from "moment"
import ShiftList from "./shift-list"

/**
Shows shifts selected in overview for a specific group.
*/
export default class SelectionDateView extends React.Component {
    static propTypes = {
        data: PropTypes.object.isRequired,
        staff: PropTypes.object.isRequired,
        groupsById: PropTypes.object.isRequired
    }
    render(){
        var { data } = this.props;
        var groupTitle = this.props.groupsById[data.groupId].name;
        var noStaffRotaedMessage = null;

        if (data.shifts.length === 0) {
            noStaffRotaedMessage = <div>No {groupTitle} staff rotaed.</div>;
        }

        return <div>
            <h2 style={{fontSize: 16}}>
                {groupTitle} staff rotaed for {moment(data.date).format("HH:mm")}
            </h2>
            <ShiftList
                shifts={data.shifts}
                staff={this.props.staff} />
            {noStaffRotaedMessage}
        </div>
    }
}
