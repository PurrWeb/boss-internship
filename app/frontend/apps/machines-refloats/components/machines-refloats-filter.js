import React from "react"

import { DateRangePicker } from 'react-dates';
import moment from 'moment';

import {
  DashboardWrapper,
  DashboardTitle,
  DashboardFilter,
  DashboardFilterItem,
} from "~/components/dashboard";

import BossSelect from '~/components/boss-select';

export default class MachinesRefloatsFilter extends React.Component {
  constructor(props) {
    super(props);
    
    const {
      filterData: {
        startDate,
        endDate,
        machineId,
        userId,
      }
    } = props;

    this.state = {
      focusedInput: null,
      startDate: startDate,
      endDate: endDate,
      machineId: machineId,
      userId: userId,
    }
  }

  onDatesChange = ({startDate, endDate}) => {
    this.setState({
      startDate: startDate,
      endDate: endDate,
    })
  }
  
  onMachineChange = (machine) => {
    this.setState({
      machineId: machine ? machine.value : null,
    })
  }
  
  onUserChange = (user) => {
    this.setState({
      userId: user ? user.value : null,
    })
  }
  
  onFilterUpdate = () => {
    const filterValues = {
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      machineId: this.state.machineId,
      userId: this.state.userId,
    }
    this.props.onFilterUpdate(filterValues);
  }
  
  render() {
    const {
      startDate,
      endDate,
      userId,
      machineId,
    } = this.state;

    const {
      machinesRefloatsUsers,
      venueMachines,
    } = this.props;
    
    const selecteMachine = venueMachines.find(machine => machine.id === machineId) || null;
    const selecteUser = machinesRefloatsUsers.find(user => user.id === userId) || null;

    return (
      <DashboardFilter onFilterUpdate={this.onFilterUpdate}>
        <DashboardFilterItem label="Date">
          <div className="date-range-picker date-range-picker_type_icon date-range-picker_type_interval-fluid date-range-picker_adjust_third">
            <DateRangePicker
              numberOfMonths={1}
              withPortal
              showClearDates
              isOutsideRange={() => false}
              displayFormat={"DD-MM-YYYY"}
              startDate={startDate}
              keepOpenOnDateSelect={false}
              endDate={endDate}
              onDatesChange={this.onDatesChange}
              focusedInput={this.state.focusedInput}
              onFocusChange={focusedInput => this.setState({focusedInput})}
            />
          </div>
        </DashboardFilterItem>
        <DashboardFilterItem label="Machine">
          <div className="boss-form__select">
            <BossSelect
              selected={selecteMachine}
              onChange={this.onMachineChange}
              value="id"
              label="name"
              options={venueMachines}
            />
          </div>
        </DashboardFilterItem>
        <DashboardFilterItem label="User">
          <div className="boss-form__select">
            <BossSelect
              selected={selecteUser}
              onChange={this.onUserChange}
              value="id"
              label="name"
              options={machinesRefloatsUsers}
            />
          </div>
        </DashboardFilterItem>
      </DashboardFilter>
    )
  }
}
