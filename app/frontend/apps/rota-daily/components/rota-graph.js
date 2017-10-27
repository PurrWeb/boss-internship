import React from 'react';
import d3 from "d3";
import RotaChart from "./rota-chart";
import iScroll from 'boss-iscroll';
import ReactIScroll from 'react-iscroll';

const scrollOptions = {
  scrollX: true,
  scrollY: false,
  scrollbars: true,
  // mouseWheel: true,
  interactiveScrollbars: true,
  shrinkScrollbars: 'scale',
  fadeScrollbars: false,
  eventPassthrough: true,
  click: true
};

class RotaGraph extends React.Component {
  
  getShiftColor = (shift) => {
    const staffMember = this.props.staffMembers.find(staff => staff.id === shift.staff_member);
    const staffType = this.props.staffTypes.find(staffType => staffType.id === staffMember.staff_type);
    return staffType.color;
  }

  render() {
    return (
      <div className="boss-rotas__graphs-list">
        <div className="boss-rotas__graphs-item">
          <div className="rota-chart">
            <div className="rota-chart__inner">
              <ReactIScroll iScroll={iScroll} options={scrollOptions}>
                <RotaChart
                    rotaShifts={this.props.rotaShifts}
                    staffTypes={this.props.staffTypes}
                    staff={this.props.staffMembers}
                    getShiftColor={(shift) => this.getShiftColor(shift)}
                    onShiftClick={this.props.onShiftClick}
                  />
              </ReactIScroll>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default RotaGraph;
