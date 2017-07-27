import React from 'react';
import {Collapse} from 'react-collapse';

class ChecklistEditWrapper extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpened: false,
    }
  }

  toggleChecklist = () => {
    this.setState({
      isOpened: !this.state.isOpened,
    })
  }

  render() {
    const {
      title,
      children,
      onEdit,
      onDelete,
    } = this.props;

    const {
      isOpened,
    } = this.state;
    const toggleCn = `${isOpened ? 'boss-board__switch_state_opened' : ''}`
    return (
      <section className="boss-board boss-board_context_stack boss-board_state_edit-mode">
        <header className="boss-board__header">
          <h2 className="boss-board__title">
            {title}
          </h2>
          <div className="boss-board__button-group boss-board__button-group_role_edit">
            <button
              className="boss-button boss-button_type_small boss-button_role_edit-mode boss-board__action"
              onClick={onEdit}
            >Edit</button>
            <button
              className="boss-button boss-button_type_small boss-button_role_cancel boss-board__action"
              onClick={onDelete}
            >Delete</button>
          </div>
          <div className="boss-board__button-group">
            <button
              className={`boss-board__switch boss-board__switch_type_angle ${toggleCn}`}
              onClick={this.toggleChecklist}
            ></button>
          </div>
        </header>
        <Collapse isOpened={isOpened}>
          <div className="boss-board__content boss-board__content_state_opened">
            <div className="boss-board__content-inner">
              <div className="boss-board__checklist">
                <div className="boss-checklist">
                  <div className="boss-checklist__content">
                    <div className="boss-checklist__items">
                      {children}
                    </div>
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

export default ChecklistEditWrapper;
