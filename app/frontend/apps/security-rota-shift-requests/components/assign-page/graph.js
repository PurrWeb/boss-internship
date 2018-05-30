import React from 'react';
import PropTypes from 'prop-types';
import RotaChart from '~/components/security-rota/rota-chart';
import iScroll from 'boss-iscroll';
import ReactIScroll from 'react-iscroll';
import RotaGraphLegend from '~/components/security-rota/rota-graph-legend';

const scrollOptions = {
  scrollX: true,
  scrollY: false,
  scrollbars: true,
  // mouseWheel: true,
  interactiveScrollbars: true,
  shrinkScrollbars: 'scale',
  fadeScrollbars: false,
  eventPassthrough: true,
  click: true,
};

class RotaGraph extends React.Component {
  render() {
    return (
      <div className="boss-board__graph boss-board__graph_layout_reverse boss-board__graph_role_daily">
        <div className="boss-board__graph-inner">
          <div className="rota-chart">
            <RotaGraphLegend venueTypes={this.props.venueTypes} />
            <div className="rota-chart__inner">
              <ReactIScroll iScroll={iScroll} options={scrollOptions}>
                <RotaChart
                  rotaShifts={this.props.rotaShifts}
                  staff={this.props.staffMembers}
                  onShiftClick={this.props.onShiftClick}
                />
              </ReactIScroll>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

RotaGraph.PropTypes = {
  rotaShifts: PropTypes.array.isRequired,
  staffMembers: PropTypes.array.isRequired,
  venueTypes: PropTypes.array.isRequired,
  onShiftClick: PropTypes.func.isRequired,
};

export default RotaGraph;
