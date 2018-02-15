import React, { Component } from 'react';
import { Tooltip } from 'react-tippy';
import { openWarningModal, openContentModal } from '~/components/modals';

const PRIORITIES = {
  high: 'H',
  low: 'L',
  medium: 'M',
};

class NoteItem extends Component {
  _handleDisable = id => {
    this.props.onDisable(id);
  };

  _handleEdit = id => {
    this.props.onEdit(id);
  };

  _handleEnable = id => {
    this.props.onEnable(id);
  };

  render() {
    return (
      <div
        className={`boss-check boss-check_role_board boss-check_page_ops-diary-index ${
          !this.props.note.active ? 'boss-check_state_alert' : ''
        }`}
      >
        <div className="boss-check__header">
          <div className="boss-check__header-info">
            <div
              className={`boss-check__indicator boss-check__indicator_priority_${
                this.props.note.priority
              } boss-check__indicator_position_before`}
            >
              {PRIORITIES[this.props.note.priority]}
            </div>
            <div className="boss-check__header-group">
              <h3 className="boss-check__title">{this.props.note.title}</h3>
              <div className="boss-check__header-meta">
                <div className="boss-check__header-meta-item">
                  <p className="boss-check__text boss-check__text_role_meta boss-check__text_role_venue">
                    {this.props.note.venue.name}
                  </p>
                </div>
                <div className="boss-check__header-meta-item">
                  <p className="boss-check__text boss-check__text_role_meta boss-check__text_role_date">
                    {this.props.note.createdAt}
                  </p>
                </div>
                <div className="boss-check__header-meta-item">
                  <p className="boss-check__text boss-check__text_role_meta boss-check__text_role_user boss-check__text_role_edit-action">
                    {this.props.note.creator.fullName}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {this.props.canEdit && (
            <Tooltip
              interactive
              arrow
              theme="light"
              position="bottom"
              trigger="click"
              html={
                <div className="boss-tooltip-portal__actions boss-tooltip-portal__actions_role_column">
                  {this.props.note.active ? (
                    [
                      <button
                        key={`${this.props.note.id}disable`}
                        onClick={() => this._handleDisable(this.props.note.id)}
                        className="boss-button boss-button_role_disable boss-tooltip-portal__action"
                      >
                        Disable
                      </button>,
                      <button
                        key={`${this.props.note.id}edit`}
                        onClick={() => this._handleEdit(this.props.note)}
                        className="boss-button boss-button_role_edit boss-tooltip-portal__action"
                      >
                        Edit
                      </button>,
                    ]
                  ) : (
                    <button
                      onClick={() => this._handleEnable(this.props.note.id)}
                      className="boss-button boss-button_role_restore boss-tooltip-portal__action"
                    >
                      Enable
                    </button>
                  )}
                </div>
              }
            >
              <div className="boss-check__tooltip-link boss-check__tooltip-link_type_icon boss-check__tooltip-link_role_settings">
                Actions
              </div>
            </Tooltip>
          )}
        </div>
        <div className="boss-check__row">
          <div className="boss-check__cell">
            <div className="boss-check__box">
              <div className="boss-check__text">{this.props.note.text}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NoteItem;
