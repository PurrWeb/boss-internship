import React from 'react';
import {Collapse} from 'react-collapse';

class ChecklistEditSingleWrapper extends React.PureComponent {
  render() {
    const {
      title,
      children,
      onCancel,
      onTitleChange,
    } = this.props;

    return (
      <section className="boss-board boss-board_context_stack boss-board_state_edit-mode">
        <header className="boss-board__header">
          <div className="boss-board__field">
            <input
              onChange={(e) => onTitleChange(e.target.value)}
              value={title}
              type="text"
              placeholder="Type checklist name here..."
            />
          </div>
          <div className="boss-board__button-group boss-board__button-group_role_edit">
            <button
              className="boss-button boss-button_type_small boss-button_role_cancel boss-board__action"
              onClick={onCancel}
            >Cancel Editing</button>
          </div>
        </header>
        <Collapse isOpened={true}>
          <div className="boss-board__content boss-board__content_state_opened">
            <div className="boss-board__content-inner">
              <div className="boss-board__checklist">
                <div className="boss-checklist">
                  <div className="boss-checklist__content">
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Collapse>
      </section>
    )
  }
}

export default ChecklistEditSingleWrapper;
