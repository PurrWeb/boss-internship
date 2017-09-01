import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  submitChecklist,
  onAnswerChange,
  onNoteChange,
  onToggleOpen,
} from '../actions/check-lists-actions';

import CheckList from './checklist';

const mapStateToProps = (state) => {
  return {
    checklists: state.getIn(['checklists', 'checklists']),
    errors: state.getIn(['checklists', 'errors']),
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      onAnswerChange,
      onNoteChange,
      onToggleOpen,
      submitChecklist,
    }, dispatch),
  }
};

@connect(mapStateToProps, mapDispatchToProps)
class CheckLists extends React.PureComponent {
  render() {
    const {
      checklists,
      actions: {
        onAnswerChange,
        onNoteChange,
        onToggleOpen,
        submitChecklist
      },
    } = this.props;

    return (
      <div className="boss-page-main__content">
        <div className="boss-page-main__inner">
          { checklists.map(checklist => {
            return (
              <CheckList
                checklist={checklist}
                onSubmit={() => submitChecklist(checklist.get('id'))}
                onAnswerChange={(answerId, value) => onAnswerChange(checklist.get('id'), answerId, value)}
                onNoteChange={(answerId, value) => onNoteChange(checklist.get('id'), answerId, value)}
                onToggleOpen={() => onToggleOpen(checklist.get('id'))}
                key={checklist.get('id')}
              />
            )
          })}
        </div>
      </div>
    )
  }
}

export default CheckLists;
