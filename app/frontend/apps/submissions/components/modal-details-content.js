import React from 'react';
import PropTypes from 'prop-types';
import safeMoment from "~/lib/safe-moment";

const CheckListItemNote = ({note}) => {
  return (
    <div className="boss-checklist__notes">
      <div className="boss-checklist__notes-inner">
        <p className="boss-checklist__notes-label">
          Note
        </p>
        <p className="boss-checklist__notes-text">
          {note}
        </p>
      </div>
    </div>
  )
}

const CheckListItem = ({item}) => {
  const checkedCn = item.get('answer')
    ? 'boss-checklist__label-text_state_checked'
    : '';

  return (
    <div className="boss-checklist__item">
      <div className="boss-checklist__control">
        <p className="boss-checklist__label">
          <span className={`boss-checklist__label-text boss-checklist__label-text_type_checkbox ${checkedCn}`}>
            {item.get('description')}
          </span>
        </p>
      </div>
      {!item.get('answer') && <CheckListItemNote note={item.get('note')} />}
    </div>
  )
}

const CheckList = ({items}) => {
  const renderItems = (items) => {
    return items.map((item, key) => {
      return <CheckListItem item={item} />
    })
  }

  return (
    <div className="boss-checklist__content">
      <div className="boss-checklist__items">
        {renderItems(items)}
      </div>
    </div>
  )
}

class ModalDetailsContent extends React.Component {
  static propTypes = {
    submission: PropTypes.object.isRequired,
  }
  
  getSubmissionStatus(answers) {
    return answers.filter(item => item.get('answer')).size === answers.size;
  }

  render() {
    const {submission} = this.props;
    const status = this.getSubmissionStatus(submission.get('answers'));
    const statusCn = status
      ? 'boss-modal-window__header_status_success'
      : 'boss-modal-window__header_status_fail';

    return (
      <div>
        <div className={`boss-modal-window__header ${statusCn}`}>
          {submission.get('check_list_name')}
        </div>
        <div className="boss-modal-window__content">
          <div className="boss-stats">
            <div className="boss-stats__meta">
              <p className="boss-stats__label boss-stats__label_role_venue">
                {submission.get('venue_name')}
              </p>
              <p className="boss-stats__label boss-stats__label_role_date">
                {safeMoment.iso8601Parse(submission.get('created_at')).format('HH:mm DD/MM/YYYY')}
              </p>
              <p className="boss-stats__label boss-stats__label_role_user">
                {submission.get('creator_name')}
              </p>
            </div>
            <div className="boss-stats__checklist">
              <CheckList items={submission.get('answers')}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ModalDetailsContent;
