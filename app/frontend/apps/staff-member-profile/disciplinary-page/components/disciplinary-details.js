import React from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';

class DisciplinaryNote extends React.Component {
  render() {
    const [nature, conduct, consequence] = oFetch(this.props, 'nature', 'conduct', 'consequence');
    return (
      <div className="boss-modal-window__overview">
        <div className="boss-overview">
          <div className="boss-overview__group">
            <h4 className="boss-overview__label">
              <span className="boss-overview__label-text">
                The nature of the unsatisfactory conduct or performance was
              </span>
            </h4>
            <p className="boss-overview__text">{nature}</p>
          </div>
          <div className="boss-overview__group">
            <h4 className="boss-overview__label">
              <span className="boss-overview__label-text">The conduct or performance improvement expected is</span>
            </h4>
            <p className="boss-overview__text">{conduct}</p>
          </div>
          <div className="boss-overview__group boss-overview__group_position_last">
            <h4 className="boss-overview__label">
              <span className="boss-overview__label-text">
                The likely consequence of further misconduct or insufficient improvement is
              </span>
            </h4>
            <p className="boss-overview__text">{consequence}</p>
          </div>
        </div>
      </div>
    );
  }
}

DisciplinaryNote.propTypes = {
  nature: PropTypes.string.isRequired,
  conduct: PropTypes.string.isRequired,
  consequence: PropTypes.string.isRequired,
};

export default DisciplinaryNote;
