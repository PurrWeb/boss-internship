import React from "react"
import StaffFinder from "~components/staff-finder"
import StaffListItem from "~components/rota-staff-list-item"


export default class StaffTypeRotaStaffFinder extends React.Component {
    render(){
        return <div>
            <StaffFinder
                staff={this.props.staff}
                venues={this.props.venues}
                staffTypes={this.props.staffTypes}
                staffItemComponent={StaffListItem}
                filters={{
                    search: true
                }}
                />
        </div>
    }
}