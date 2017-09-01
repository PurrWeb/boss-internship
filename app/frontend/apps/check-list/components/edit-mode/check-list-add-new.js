import React from 'react';
import {Collapse} from 'react-collapse';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import _ from 'lodash';

import {
  onToggleNewChecklist,
} from '../../actions/check-lists-actions';

import ChecklistAddNewForm from './checklist-add-new-form';

import {
  makeSelectNewChecklistIsOpen,
} from '../../selectors';

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      onToggleNewChecklist,
    }, dispatch)
  };
}
@connect(createStructuredSelector({
  isOpen: makeSelectNewChecklistIsOpen(),
}), mapDispatchToProps)
export default class AddNewCheckList extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    const {
      isOpen,
      actions: {onToggleNewChecklist}
    } = this.props;

    return <ChecklistAddNewForm onToggleChecklist={onToggleNewChecklist} isOpen={isOpen} initialValues={{name: '', items: []}}/>;
  }
}
