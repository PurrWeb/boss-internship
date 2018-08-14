import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'react-collapse';
import oFetch from 'o-fetch';
import utils from '~/lib/utils';
import ImmutablePropTypes from 'react-immutable-proptypes';
import iScroll from 'boss-iscroll';
import ReactIScroll from 'react-iscroll';
import ReportTableHeader from './report-table-header';

const scrollOptions = {
  scrollX: true,
  scrollY: false,
  scrollbars: true,
  mouseWheel: false,
  interactiveScrollbars: true,
  shrinkScrollbars: 'scale',
  fadeScrollbars: false,
  click: true,
  enable_ofscroll: true,
};

class ReportList extends Component {
  state = {
    isOpened: true,
  };

  toggleDropDown = () => {
    this.setState(state => ({ isOpened: !state.isOpened }));
  };

  renderItems() {
    const itemRenderer = oFetch(this.props, 'itemRenderer');
    const staffType = oFetch(this.props, 'staffType');
    return staffType.get('reports').map(report => {
      return React.cloneElement(itemRenderer(report.toJS()), {
        key: report.get('frontendId').toString(),
      });
    });
  }

  render() {
    const staffType = oFetch(this.props, 'staffType');
    const startDate = oFetch(this.props, 'startDate');
    const { color, name } = staffType.toJS();
    const { isOpened } = this.state;

    return (
      <section className="boss-board boss-board_context_stack boss-board_role_payroll-report">
        <header className="boss-board__header">
          <h2 className="boss-board__title boss-board__title_size_medium">
            <span
              className="boss-button boss-button_type_small boss-button_type_no-behavior boss-board__title-label"
              style={{ backgroundColor: color }}
            >
              {name}
            </span>
          </h2>
          <div className="boss-board__button-group">
            <button
              type="button"
              className={`boss-board__switch ${isOpened ? 'boss-board__switch_state_opened' : ''}`}
              onClick={this.toggleDropDown}
            />
          </div>
        </header>
        <Collapse
          isOpened={this.state.isOpened}
          className={`boss-board__content ${isOpened ? 'boss-board__content_state_opened' : ''}`}
          style={{ display: isOpened ? 'block' : 'none' }}
        >
          <div className="boss-board__content-inner">
            <div className="boss-board__table">
              <ReactIScroll
                iScroll={iScroll}
                options={scrollOptions}
                className="boss-board__scroll boss-board__scroll_type_native"
              >
                <div className="boss-board__scroll-content">
                  <div className="boss-table boss-table_page_payroll-reports">
                    <ReportTableHeader staffTypeName={name} startDate={startDate} />
                    {this.renderItems()}
                  </div>
                </div>
              </ReactIScroll>
            </div>
          </div>
        </Collapse>
      </section>
    );
  }
}

ReportList.propTypes = {
  staffType: ImmutablePropTypes.map.isRequired,
  startDate: PropTypes.string.isRequired,
  itemRenderer: PropTypes.func.isRequired,
};

export default ReportList;
