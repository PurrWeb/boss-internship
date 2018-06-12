import React from 'react';
import d3 from 'd3';
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
      <div className="boss-rotas__graphs-list">
        <div className="boss-rotas__graphs-item">
          <div className="boss-rotas__graphs-content">
            <div className="rota-chart">
              <RotaGraphLegend venueTypes={this.props.venueTypes.toJS()} />
              <div className="rota-chart__inner">
                <ReactIScroll iScroll={iScroll} options={scrollOptions}>
                  <RotaChart
                    rotaShifts={this.props.rotaShifts}
                    staffTypes={this.props.staffTypes}
                    staff={this.props.staffMembers}
                    onShiftClick={this.props.onShiftClick}
                  />
                </ReactIScroll>
              </div>
              {this.props.totalRotaShifts === 0 ? null : (
                <div className="rota-chart__meta">
                  <p className="rota-chart__meta-text">
                    <span>Showing </span>
                    <span>{this.props.rotaShifts.length}</span>
                    <span> out of </span>
                    <span>{this.props.totalRotaShifts}</span>
                    <span> shifts.</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

RotaGraph.PropTypes = {
  rotaShifts: PropTypes.array.isRequired,
  staffTypes: PropTypes.array.isRequired,
  staffMembers: PropTypes.array.isRequired,
  onShiftClick: PropTypes.func.isRequired,
  totalRotaShifts: PropTypes.number.isRequired,
  venueTypes: PropTypes.array.isRequired,
};

export default RotaGraph;
