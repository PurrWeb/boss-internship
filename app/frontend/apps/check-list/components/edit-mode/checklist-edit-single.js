import React from 'react';

import ChecklistEditSingleForm from './checklist-edit-single-form';

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

    const initialValues = {
      id: checklist.get('id'),
      venue_id: checklist.get('venue_id'),
      name: checklist.get('name'),
      check_list_items: checklist.get('items').map(item => item.get('description')),
    }

    return <ChecklistEditSingleForm initialValues={initialValues} />
  }
}


export default ChecklistEditSingle;
