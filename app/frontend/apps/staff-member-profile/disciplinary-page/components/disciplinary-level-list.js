import React from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';
import Immutable from 'immutable';

class DisciplinaryLevelList extends React.Component {
  renderItems(disciplinariesGroupedByLevel) {
    const itemRenderer = oFetch(this.props, 'itemRenderer');
    return disciplinariesGroupedByLevel.entrySeq().map(([level, disciplinaries]) => {
      return React.cloneElement(itemRenderer(disciplinaries, level), {
        key: level.toString(),
      });
    });
  }
  render() {
    const disciplinariesGroupedByLevel = oFetch(this.props, 'disciplinariesGroupedByLevel');
    return <div>{this.renderItems(disciplinariesGroupedByLevel)}</div>
  }
}

DisciplinaryLevelList.propTypes = {
  itemRenderer: PropTypes.func.isRequired,
  disciplinariesGroupedByLevel: PropTypes.instanceOf(Immutable.Map).isRequired,
};

export default DisciplinaryLevelList;
