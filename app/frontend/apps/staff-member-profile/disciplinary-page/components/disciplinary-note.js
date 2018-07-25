import React from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';

class DisciplinaryNote extends React.Component {
  render() {
    const note = oFetch(this.props, 'note');
    return (
      <div className="boss-modal-window__message-block">
        <p className="boss-modal-window__message-text">{note}</p>
      </div>
    );
  }
}

DisciplinaryNote.propTypes = {
  note: PropTypes.string.isRequired,
};

export default DisciplinaryNote;
