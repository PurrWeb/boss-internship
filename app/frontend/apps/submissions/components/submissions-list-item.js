import React from 'react';
import PropTypes from 'prop-types';
import utils from "~/lib/utils"
import safeMoment from "~/lib/safe-moment";

class TableCell extends React.Component {
  static propTypes = {
    label: PropTypes.string,
  }

  render() {
    return (
      <div className="boss-table__cell">
        <div className="boss-table__info">
          <p className="boss-table__label">
            {this.props.label}
          </p>
          {this.props.children}
        </div>
      </div>
    )
  }
}

class SubmissionsListItem extends React.Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    onDetailsClick: PropTypes.func.isRequired,
  }

  getSubmissionStatus(answers) {
    return answers.filter(item => item.get('answer')).size === answers.size;
  }

  render() {
    const {item} = this.props;
    const status = this.getSubmissionStatus(item.get('answers'));
    const statusCn = status ? 'boss-button_role_secondary' : 'boss-button_role_alert';
    const statusText = status ? 'OK' : 'Problem'
    const creatorName = item.get('creator_name');
    const checklistName = item.get('check_list_name');
    const createdAt = safeMoment.iso8601Parse(item.get('created_at')).format(utils.humanDateFormatWithTime("short"));

    return (
      <div className="boss-table__row">
        <TableCell label="Date">{createdAt}</TableCell>
        <TableCell label="Checklist">{checklistName}</TableCell>
        <TableCell label="Created By">{creatorName}</TableCell>
        <TableCell label="Status">
          <div className="boss-table__text">
            <a href="javascript:;" className={`boss-button boss-button_type_small boss-button_type_no-behavior ${statusCn}`}>{statusText}</a>
          </div>
        </TableCell>
        <TableCell label="Action">
          <div className="boss-table__actions">
            <a
              onClick={this.props.onDetailsClick.bind(null, item)}
              href="javascript:;"
              className="boss-button boss-button_primary boss-table__action"
            >View Details</a>
          </div>
        </TableCell>
      </div>
    )
  }
}

export default SubmissionsListItem;
