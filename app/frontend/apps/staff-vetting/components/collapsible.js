import React, { Component } from 'react';
import { Collapse } from 'react-collapse';

export default class Collapsible extends Component {
  state = {
    isOpened: false,
  };

  toggleDropDown = () => {
    this.setState(state => ({ isOpened: !state.isOpened }));
  };

  render() {
    return (
      <section className="boss-board boss-board_context_stack">
        <header className="boss-board__header">
          <h2 className="boss-board__title boss-board__title_size_medium">
            <span className="boss-board__title-text">{this.props.text}</span>
            <span className="boss-board__title-indicator">
              <span className="boss-indicator boss-indicator_role_info-alert">
                <span className="boss-indicator__marker">{this.props.count}</span>
              </span>
            </span>
          </h2>
          <div className="boss-board__button-group">
            <button
              type="button"
              onClick={this.toggleDropDown}
              className={`boss-board__switch ${this.state.isOpened ? 'boss-board__switch_state_opened' : ''}`}
            />
          </div>
        </header>
        <Collapse isOpened={this.state.isOpened} className="boss-board__content" style={{ display: 'block' }}>
          <div className="boss-board__content-inner">
            <div className="boss-board__group">{this.props.children}</div>
          </div>
        </Collapse>
      </section>
    );
  }
}
