import React from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';
import Immutable from 'immutable';
import { Collapse } from 'react-collapse';

class DisciplinaryList extends React.Component {
  state = {
    isOpened: true,
  };

  toggleDropDown = () => {
    this.setState(state => ({ isOpened: !state.isOpened }));
  };

  renderItems(disciplinaries) {
    const itemRenderer = oFetch(this.props, 'itemRenderer');

    if (disciplinaries.size === 0) {
      return <p className="boss-board__text-placeholder">No disciplinaries to display</p>;
    }

    return disciplinaries.map(disciplinary => {
      const jsDisciplinary = disciplinary.toJS();
      return React.cloneElement(itemRenderer(jsDisciplinary), {
        key: jsDisciplinary.id.toString(),
      });
    });
  }

  render() {
    const { isOpened } = this.state;
    const disciplinaries = oFetch(this.props, 'disciplinaries');
    const title = oFetch(this.props, 'title');
    return (
      <div className="boss-board__manager-group boss-board__manager-group_role_area boss-board__manager-group_context_stack">
        <div className="boss-board__manager-header">
          <div className="boss-board__manager-title">{title}</div>
          <div
            className={`boss-board__manager-switch ${!isOpened ? 'boss-board__manager-switch_state_closed' : ''}`}
            onClick={this.toggleDropDown}
          />
        </div>
        <Collapse
          isOpened={this.state.isOpened}
          className={`boss-board__manager-content ${!isOpened ? 'boss-boss-board__manager-content_state_closed' : ''}`}
        >
          <div className="boss-board__manager-cards">{this.renderItems(disciplinaries)}</div>
        </Collapse>
      </div>
    );
  }
}

DisciplinaryList.propTypes = {
  disciplinaries: PropTypes.instanceOf(Immutable.List).isRequired,
};

export default DisciplinaryList;
