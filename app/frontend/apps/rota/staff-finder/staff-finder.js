import PropTypes from 'prop-types';
import React, { Component } from "react"
import _ from "underscore"
import StaffListItem from "~/components/rota-staff-list-item"
import StaffFinder from "~/components/staff-finder"

export default class RotaStaffFinder extends Component {
    static propTypes = {
        staff: PropTypes.object.isRequired,
        staffTypes: PropTypes.object.isRequired
    }
    render() {
        return <div>
          <StaffFinder
              filters={{
                  search: true,
                  staffType: true
              }}
              staffTypes={this.props.staffTypes}
              staffItemComponent={StaffListItem}
              staff={this.props.staff} />
        </div>
    }
}
