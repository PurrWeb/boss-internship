import React from 'react';

import ChecklistEditSingleWrapper from './checklist-edit-single-wrapper';
import {
  AddedNewItem,
  AddNewItem,
} from './check-list-add-new';

class ChecklistEditSingle extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      title: props.title,
    }
  }

  isValid() {
    return !!this.state.title && this.props.checklist.get('items').size > 0;
  }

  onTitleChange = (title) => {
    this.setState({
      title: title,
    });
  }

  render() {
    const {
      checklist,
      onUpdateItem,
      onRemoveItem,
      onAddNew,
      onSubmit,
      onCancel,
    } = this.props;

    const {
      title,
    } = this.state;

    return (
      <ChecklistEditSingleWrapper
        title={title}
        onTitleChange={this.onTitleChange}
        onCancel={onCancel}
      >
        <div className="boss-checklist__items">
          { checklist.get('items').map((item, index) => {
            return <AddedNewItem
              item={item.toJS()}
              key={index}
              onUpdateItem={onUpdateItem.bind(null, index)}
              onRemoveItem={onRemoveItem.bind(null, index)}
            />
          }) }
          <AddNewItem
            onAddNew={onAddNew}
          />
        </div>
        <div className="boss-checklist__actions">
          <button
            disabled={!this.isValid()}
            className="boss-button boss-button_role_primary"
            onClick={onSubmit.bind(null, this.state.title)}
          >Done</button>
        </div>
      </ChecklistEditSingleWrapper>      
    ) 
  }
}


export default ChecklistEditSingle;
