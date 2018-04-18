import React from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'react-collapse';

class ShiftRequestCard extends React.PureComponent {
  state = {
    isOpened: true,
  };

  toggleDropDown = () => {
    this.setState(state => ({ isOpened: !state.isOpened }));
  };

  render() {
    const { isOpened} = this.state;
    return (
      <section className="boss-board boss-board_context_stack">
        <header className="boss-board__header">
          <h2 className="boss-board__title">{this.props.title}</h2>
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
          style={{ display: 'block' }}
        >
          {this.props.children}
        </Collapse>
      </section>
    );
  }
}

ShiftRequestCard.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  className: PropTypes.string,
};

ShiftRequestCard.defaultProps = {
  className: '',
};

export default ShiftRequestCard;
