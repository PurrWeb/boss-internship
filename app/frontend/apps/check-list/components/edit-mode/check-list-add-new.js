import React from 'react';
import {Collapse} from 'react-collapse';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import _ from 'lodash';

import {
  addNewItem,
  updateNewItem,
  removeNewItem,
  cancelAddNew,
  submitAddNew,
  updateNewChecklistName,
  onToggleNewChecklist,
} from '../../actions/check-lists-actions';

import {
  makeSelectNewChecklistItems,
  makeSelectNewChecklistName,
  makeSelectNewChecklistIsOpen,
} from '../../selectors';

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      addNewItem,
      updateNewItem,
      removeNewItem,
      cancelAddNew,
      submitAddNew,
      updateNewChecklistName,
      onToggleNewChecklist,
    }, dispatch)
  };
}
@connect(createStructuredSelector({
  items: makeSelectNewChecklistItems(),
  name: makeSelectNewChecklistName(),
  isOpen: makeSelectNewChecklistIsOpen(),
}), mapDispatchToProps)
export default class AddNewCheckList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: this.props.name,
    }
  }

  addNewItem = (item) => {
    this.props.actions.addNewItem(item);
  }

  changeChecklistName(value) {
    this.setState({name: value}, () => {
      this.changedChecklistName(value);
    })
  }

  changedChecklistName = _.debounce((value) => {
    this.props.actions.updateNewChecklistName(value);
  }, 500);
  
  onSubmit = () => {
    this.props.actions.submitAddNew(this.state.name);
  }
  
  componentWillReceiveProps(newProps) {
    this.setState({name: newProps.name});
  }

  isValid = () => {
    return !!this.state.name && this.props.items.size > 0;
  }

  render () {
    const {
      items,
      isOpen,
      name,
    } = this.props;

    const {
      updateNewItem,
      removeNewItem,
      cancelAddNew,
      onToggleNewChecklist,
    } = this.props.actions;

    return (
      <section className="boss-board boss-board_context_stack">
        <div className="boss-board__form">
          <header className="boss-board__header">
            <div className="boss-board__field">
              <input
                onClick={() => !isOpen && onToggleNewChecklist() }
                onChange={(e) => this.changeChecklistName(e.target.value)}
                value={this.state.name}
                type="text"
                placeholder="Type checklist name here..."
              />
            </div>
            <div className="boss-board__button-group boss-board__button-group_role_add">
              {
                isOpen
                ? <button onClick={cancelAddNew} className="boss-button boss-button_role_cancel boss-board__action boss-board__action_type_fluid boss-board__action_role_switch">
                  Cancel
                </button>
                : <button onClick={onToggleNewChecklist} className="boss-button boss-button_role_add boss-board__action boss-board__action_type_fluid boss-board__action_role_switch">
                  Add new
                </button>
              }
            </div>
          </header>
          <Collapse isOpened={isOpen}>
            <div className="boss-board__content boss-board__content_state_opened">
              <div className="boss-board__content-inner">
                <div className="boss-board__checklist">
                  <div className="boss-checklist">
                    <div className="boss-checklist__content">
                      <div className="boss-checklist__items">
                        {
                          items.map((item, index) => {
                            return <AddedNewItem
                              item={item.toJS()}
                              key={index}
                              onUpdateItem={updateNewItem.bind(null, index)}
                              onRemoveItem={removeNewItem.bind(null, index)}
                            />
                          })
                        }
                        <AddNewItem onAddNew={this.addNewItem} />
                      </div>
                      <div className="boss-checklist__actions">
                        <button
                          className="boss-button boss-button_role_primary"
                          onClick={this.onSubmit}
                          disabled={!this.isValid()}
                        >Done</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Collapse>
        </div>
      </section>
    )
  }
}

export class AddNewItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      item: {},
    }
  }

  onDescriptionChange = (e) => {
    this.setState({
      item: {
        description: e.target.value,
      }
    })
  }

  clearDescription = () => {
    this.setState({
      item: {
        description: '',
      }
    });
  }

  onAddNew(item) {
    this.props.onAddNew(item);
    this.clearDescription();
  }

  render() {
    const {
      onAddNew,
    } = this.props;
    return (
      <div className="boss-checklist__item">
        <div className="boss-checklist__control">
          <div className="boss-checklist__field">
            <input type="text"
              className="boss-checklist__text-input boss-checklist__text-input_adjust_icon"
              placeholder="Type item name here..."
              value={this.state.item.description}
              onChange={this.onDescriptionChange}
            />
            { !!this.state.item.description
              && <button
                  className="boss-checklist__icon boss-checklist__icon_role_field-cancel"
                  onClick={this.clearDescription}
                >Cancel</button>
            }
          </div>
          { !!this.state.item.description
              && <button
                  className="boss-button boss-button_type_icon boss-button_role_add boss-checklist__btn"
                  onClick={() => this.onAddNew(this.state.item)}
                >Add</button>
          }
        </div>
      </div>
    )
  }
}
export class AddedNewItem extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isEdit: false,
      item: props.item,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      item: nextProps.item,
    })
  }

  toEditMode = () => {
    this.setState({
      isEdit: true,
    })
  }

  toViewMode = () => {
    this.setState({
      isEdit: false,
    })
  }

  cancelEdit = () => {
    this.toViewMode();
    this.setState({
      item: this.props.item,
    })
  }

  onUpdateItem = (item) => {
    this.props.onUpdateItem(item);
    this.toViewMode();
  }

  render() {
    const {
      item,
      onRemoveItem,
    } = this.props;
    return (
      <div className="boss-checklist__item">
        {
          this.state.isEdit
            ? <div className="boss-checklist__control">
                <div className="boss-checklist__field">
                  <input
                    type="text"
                    value={this.state.item.description}
                    onChange={(e) => this.setState({item: {description: e.target.value}})}
                    className="boss-checklist__text-input"
                  />
                </div>
                <button
                  className="boss-button boss-button_type_icon boss-button_role_confirm boss-checklist__btn"
                  onClick={() => this.onUpdateItem(this.state.item)}
                >Confirm</button>
                <button
                  className="boss-button boss-button_type_icon boss-button_role_cancel boss-checklist__btn"
                  onClick={this.cancelEdit}
                >Cancel</button>
              </div>
            : <div className="boss-checklist__control">
                <p className="boss-checklist__label">
                  <span className="boss-checklist__label-text">
                    { this.state.item.description }
                  </span>
                </p>
                <button
                  className="boss-checklist__icon boss-checklist__icon_role_edit"
                  onClick={this.toEditMode}
                >Edit</button>
                <button
                  className="boss-checklist__icon boss-checklist__icon_role_delete"
                  onClick={onRemoveItem}
                >Delete</button>
              </div>
        }
      </div>
    )
  }
}
