import React, { Component } from 'react';
import PropTypes from 'prop-types';
import d3 from 'd3';
import RotaDate from '~/lib/rota-date';
import safeMoment from '~/lib/safe-moment';
import _ from 'underscore';
import utils from '~/lib/utils';
import getVenueColor from '~/lib/get-venue-color';
import makeRotaHoursXAxis from '~/lib/make-rota-hours-x-axis';

const MAX_HEIGHT_PER_PERSON = 20;
const MILLISECONDS_PER_HOUR = 60 * 60 * 1000;

class RotaChartInner extends Component {
  constructor(props) {
    super(props);
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !utils.deepEqualTreatingFunctionsAsStrings(nextProps, this.props);
  }
  render() {
    return (
      <div className="rota-chart__content">
        <svg id="rota-chart" ref={el => (this.el = el)} />
      </div>
    );
  }
  componentDidMount() {
    this.initGraph(this.el);
  }
  componentDidUpdate(prevProps, prevState) {
    this.initGraph(this.el);
  }
  getStaffMembersOnRota() {
    var staffList = this.props.rotaShifts
      .map(shift => shift.staffMemberId)
      .map(staffId => this.props.staff.find(staff => staff.id === staffId));
    staffList = _(staffList).sortBy(function(staffMember) {
      return staffMember.staffType;
    });

    return staffList;
  }
  getRotaDate() {
    var exampleDateFromTheDay;
    if (this.props.rotaShifts.length > 0) {
      exampleDateFromTheDay = this.props.rotaShifts[0].startsAt;
    } else {
      // Any date will do since there's no data anyway
      exampleDateFromTheDay = new Date();
    }
    var rotaDate = new RotaDate({
      shiftStartsAt: safeMoment.iso8601Parse(exampleDateFromTheDay),
    });
    return rotaDate;
  }
  generateRotaShiftList(staffList) {
    var rotaDate = this.getRotaDate();
    function calculateOffsetInHours(date) {
      var offsetInMilliseconds =
        new Date(date).valueOf() - rotaDate.startTime.valueOf();
      var offsetInHours = offsetInMilliseconds / MILLISECONDS_PER_HOUR;
      return offsetInHours;
    }

    var staffClientIdsInOrder = _(staffList).pluck('id');

    var rotaShifts = this.props.rotaShifts.map((rotaShift, i) => {
      var staff = this.props.staff.find(
        staff => staff.id === rotaShift.staffMemberId,
      );
      return {
        startOffset: calculateOffsetInHours(rotaShift.startsAt),
        endOffset: calculateOffsetInHours(rotaShift.endsAt),
        staff: staff,
        isStandby: rotaShift.shiftType === 'standby',
        staffIndex: _(staffClientIdsInOrder).indexOf(staff.id),
        originalShiftObject: rotaShift,
      };
    });
    return rotaShifts;
  }
  initGraph(el) {
    if (!el) {
      return;
    }

    var previousInnerHTML = el.innerHTML;
    el.innerHTML = '';

    var self = this;
    var staffList = this.getStaffMembersOnRota();
    var rotaShifts = this.generateRotaShiftList(staffList);
    var numberOfDifferentStaffMembers = staffList.length;

    var innerHeight = 530;
    // Using Math.floor means that there's some empty space at the top of the chart
    var heightPerPerson = Math.floor(
      innerHeight / numberOfDifferentStaffMembers,
    );
    if (heightPerPerson > MAX_HEIGHT_PER_PERSON) {
      heightPerPerson = MAX_HEIGHT_PER_PERSON;
    }

    var aggregateHeightOfBars = heightPerPerson * numberOfDifferentStaffMembers;
    var verticalSpacingToPushBarsToBottom = innerHeight - aggregateHeightOfBars;

    var innerWidth = 700,
      padding = 20,
      width = innerWidth + padding * 2,
      height = innerHeight + padding * 2;

    var { xScale, barWidthScale } = this.getScales(innerWidth);

    var chart = d3
      .select(el)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${padding}, ${padding})`);

    var xAxis = makeRotaHoursXAxis(xScale, this.getHoursNotShown());

    chart
      .append('g')
      .attr('transform', 'translate(0,' + (height - padding * 2) + ')')
      .attr('class', 'axis')
      .call(xAxis);

    var bar = chart
      .append('g')
      .selectAll('g')
      .data(rotaShifts)
      .enter()
      .append('g')
      .classed('rota-chart__shift', true)
      .attr('transform', function(rotaShift, i) {
        var transformX = xScale(rotaShift.startOffset);
        return (
          'translate(' +
          transformX +
          ',' +
          (rotaShift.staffIndex * heightPerPerson +
            verticalSpacingToPushBarsToBottom) +
          ')'
        );
      });
    bar
      .append('pattern')
      .attr('id', 'diagonalHatch')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 4)
      .attr('height', 4)
      .append('path')
      .attr('d', 'M-1,1 l2,-2M0,4 l4,-4M3,5 l2,-2')
      .attr('style', 'stroke:gray;stroke-width:1');
    bar
      .append('rect')
      .attr('rx', () => {
        if (heightPerPerson < 15) {
          return 0;
        }
        return 4;
      })
      .attr('ry', () => {
        if (heightPerPerson < 15) {
          return 0;
        }
        return 4;
      })
      .attr('width', function(shift) {
        var hours = shift.endOffset - shift.startOffset;
        return barWidthScale(hours);
      })
      .attr('style', function(shift) {
        return `fill:${getVenueColor(shift.originalShiftObject.venueId)}`;
      })
      .attr('height', heightPerPerson - 1);
    bar
      .append('rect')
      .attr('rx', () => {
        if (heightPerPerson < 15) {
          return 0;
        }
        return 4;
      })
      .attr('ry', () => {
        if (heightPerPerson < 15) {
          return 0;
        }
        return 4;
      })
      .attr('width', function(shift) {
        var hours = shift.endOffset - shift.startOffset;
        return barWidthScale(hours);
      })
      .attr('style', function(shift) {
        return 'fill:' + getVenueColor(shift.originalShiftObject.venueId);
      })
      .on('mouseenter', function(shift) {
        d3.select(this).style('fill', 'url(#diagonalHatch)');
      })
      .on('mouseout', function(shift) {
        d3
          .select(this)
          .style('fill', getVenueColor(shift.originalShiftObject.venueId));
      })
      .on('click', function(shift) {
        self.props.onShiftClick(shift);
      })
      .attr('height', heightPerPerson - 1);
    bar
      .append('text')
      .text(function(shift) {
        if (heightPerPerson < 15) {
          return '';
        }
        var staff = shift.staff;
        var formattedStartTime = safeMoment
          .iso8601Parse(shift.originalShiftObject.startsAt)
          .format('HH:mm');
        var formattedEndTime = safeMoment
          .iso8601Parse(shift.originalShiftObject.endsAt)
          .format('HH:mm');
        var standby = shift.isStandby ? '(SB) ' : '';
        return `${standby} ${staff.firstName} ${staff.surname} (${formattedStartTime} - ${formattedEndTime})`;
      })
      .attr('dx', 4)
      .attr('dy', 12)
      .classed('rota-chart__shift-label', true)
      .attr('text-anchor', 'middle');
  }
  getScales(innerWidth) {
    var hoursNotShownOnTheLeft = this.getHoursNotShownOnTheLeft();
    var hoursNotShownOnTheRight = this.getHoursNotShownOnTheRight();
    var hoursNotShown = this.getHoursNotShown();

    var xScale = d3.scale
      .linear()
      .domain([hoursNotShownOnTheLeft, 24 - hoursNotShownOnTheRight])
      .range([0, innerWidth]);
    var barWidthScale = d3.scale
      .linear()
      .domain([0, 24 - hoursNotShown])
      .range([0, innerWidth]);

    return { xScale, barWidthScale };
  }
  showStaffPreview(shift) {
    this.props.updateStaffToPreview(shift.originalShiftObject.staff_member);
  }
  stopShowingStaffPreview(shift) {
    this.props.updateStaffToPreview(null);
  }
  getHoursNotShown() {
    var hoursNotShownOnTheLeft = this.getHoursNotShownOnTheLeft();
    var hoursNotShownOnTheRight = this.getHoursNotShownOnTheRight();
    return hoursNotShownOnTheLeft + hoursNotShownOnTheRight;
  }
  getHoursNotShownOnTheLeft() {
    var rotaDate = this.getRotaDate();
    var chartStartTime = this.props.startTime;
    var dayStartTime = rotaDate.startTime.valueOf();
    var msNotShown = chartStartTime - dayStartTime;
    return msNotShown / MILLISECONDS_PER_HOUR;
  }
  getHoursNotShownOnTheRight() {
    var rotaDate = this.getRotaDate();
    var chartEndTime = this.props.endTime;
    var dayEndTime = rotaDate.endTime.valueOf();
    var msNotShown = dayEndTime - chartEndTime;
    return msNotShown / MILLISECONDS_PER_HOUR;
  }
}

RotaChartInner.propTypes = {
  rotaShifts: PropTypes.array.isRequired,
  startTime: PropTypes.instanceOf(Date),
  endTime: PropTypes.instanceOf(Date),
  staff: PropTypes.array.isRequired,
  staffTypes: PropTypes.array.isRequired,
  onShiftClick: PropTypes.func.isRequired,
};

export default RotaChartInner;
