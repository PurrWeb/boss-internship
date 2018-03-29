import React from 'react';
import oFetch from 'o-fetch';

class PaymentUploadProcessReport extends React.Component {
  constructor(props) {
    super(props);
  }

  renderUserFilter(params) {
    const showCount = oFetch(params, 'showCount');
    const total = oFetch(params, 'total');

    return  <div className="boss-users__filter">
      <form className="boss-form">
        <div className="boss-form__row boss-form__row_position_last boss-form__row_hidden-xs">
          <div className="boss-form__field boss-form__field_role_control">
            <p className="boss-form__label boss-form__label_type_light"><span className="boss-form__label-text">Showing { showCount } of { total }</span></p>
            <div className="boss-form__search">
              <input name="search" type="text" className="boss-form__input" placeholder="Search..." />
            </div>
          </div>
        </div>
        <div className="boss-form__row boss-form__row_position_last boss-form__row_visible-xs">
          <div className="boss-form__field">
            <p className="boss-form__label boss-form__label_justify_center"><span className="boss-form__label-text">Showing { showCount } of { total }</span></p>
            <div className="boss-form__search">
              <input name="search" type="text" className="boss-form__input" placeholder="Search..." />
            </div>
          </div>
        </div>
      </form>
    </div>;
  }

  renderPaymentSectionStaffMemberSummary(params) {
    const staffMember = oFetch(params, 'staffMember');
    const staffMemberId = oFetch(staffMember, 'id');
    const records = oFetch(params, 'records');
    const staffMemberName = oFetch(staffMember, 'name');
    const staffTypeName = oFetch(staffMember, 'staffTypeName');
    const staffTypeBadgeColor = oFetch(staffMember, 'staffTypeBadgeColor');
    const avatarUrl = oFetch(staffMember, 'avatarUrl');

    return  <div key={ `staffMemberSummary:${staffMemberId}` } className="boss-user-summary boss-user-summary_role_review-short">
      <div className="boss-user-summary__side">
        <div className="boss-user-summary__avatar">
          <div className="boss-user-summary__avatar-inner">
            <img src={avatarUrl} alt={staffMemberName} className="boss-user-summary__pic" />
          </div>
        </div>
      </div>
      <div className="boss-user-summary__content">
        <div className="boss-user-summary__header">
          <h2 className="boss-user-summary__name">{staffMemberName}</h2>
          <p className="boss-button boss-button_type_label boss-user-summary__label" style={ { backgroundColor: staffTypeBadgeColor} }>{staffTypeName}</p>
        </div>
        <ul className="boss-user-summary__review-list">
          { records.map((record) => {
              const payment = oFetch(record, 'payment');
              return this.renderPaymentListItem({ payment: payment });
            })}
        </ul>
        <div className="boss-user-summary__footer">
          <button className="boss-button boss-button_role_view-details-light boss-button_type_extra-small">View Details</button>
        </div>
      </div>
    </div>;
  }

  renderPaymentSection(params) {
    const key = oFetch(params, 'key');
    const title = oFetch(params, 'title');
    const records = oFetch(params, 'records');
    const recordCount = oFetch(records, 'length');

    let staffMembers = [];
    const recordsByStaffMemberId = {};
    records.forEach((record) => {
      const recordStaffMember = oFetch(record, 'staffMember')
      const staffMemberId = oFetch(recordStaffMember, 'id');
      staffMembers.push(recordStaffMember);
      recordsByStaffMemberId[staffMemberId] = recordsByStaffMemberId[staffMemberId]  || [];
      recordsByStaffMemberId[staffMemberId].push(record);
    });
    staffMembers = _.uniq(staffMembers);

    return <section key={ key } className="boss-board boss-board_context_stack">
      <header className="boss-board__header">
        <div className="boss-indicator boss-indicator_status_success boss-board__indicator">
          <span className="boss-indicator__marker">{ recordCount }</span>
        </div>
        <h2 className="boss-board__title boss-board__title_size_medium">{ title }</h2>
        <div className="boss-board__button-group">
          <button type="button" className="boss-board__switch boss-board__switch_state_opened"></button>
        </div>
      </header>

      <div className="boss-board__content boss-board__content_state_opened" style={ {display: 'block'} }>
        <div className="boss-board__content-inner">
          { (recordCount < 1) && <div className="boss-board__group">
              <p className="boss-board__text-placeholder">Nothing to display</p>
            </div> }
          { (recordCount > 0) && <div className="boss-board__group">
              <div className="boss-users">
                { this.renderUserFilter({ showCount: recordCount, total: recordCount }) }
                <div className="boss-users__flow">
                  <div className="boss-users__flow-list">
                    { staffMembers.map((staffMember) => {
                        const staffMemberId = oFetch(staffMember, 'id');
                        const records = oFetch(recordsByStaffMemberId, staffMemberId);
                        return <div key={`staffMemberFlowItem:${staffMemberId}`} className="boss-users__flow-item boss-users__flow-item_size_third">
                          { this.renderPaymentSectionStaffMemberSummary({ staffMember: staffMember, records: records }) }
                        </div>;
                      }) }
                  </div>
                </div>
              </div>
            </div> }
        </div>
      </div>
    </section>;
  }

  renderErrorSection(params) {
    const key = oFetch(params, 'key');
    const title = oFetch(params, 'title')
    const records = oFetch(params, 'records');
    const recordCount = oFetch(records, 'length');

    return <section key={key} className="boss-board boss-board_context_stack">
      <header className="boss-board__header">
        <div className="boss-indicator boss-indicator_status_error boss-board__indicator">
          <span className="boss-indicator__marker">{recordCount}</span>
        </div>
        <h2 className="boss-board__title boss-board__title_size_medium">{title}</h2>
        <div className="boss-board__button-group">
          <button type="button" className="boss-board__switch boss-board__switch_state_opened"></button>
        </div>
      </header>

      <div className="boss-board__content boss-board__content_state_opened" style={ {style: 'block'} }>
        <div className="boss-board__content-inner">
          <div className="boss-board__group">
            { (recordCount === 0) && <p className="boss-board__text-placeholder">Nothing to display</p> }
            { (recordCount !== 0) && this.renderErrorReports({records: records}) }
          </div>
        </div>
      </div>
    </section>;
  }

  renderErrorReports(params) {
    const records = oFetch(params, 'records');
    return <div className="boss-report">
      { records.map((record, index) => {
          return this.renderErrorReport({
            key: `errorReport:${index}`,
            record: record
          });
        })}
    </div>;
  }

  renderErrorReport(params) {
    const record = oFetch(params, 'record');
    const key = oFetch(params, 'key');
    const rawData = oFetch(record, 'rawData');
    const errors = oFetch(record, 'errors');
    const baseErrors = _.compact(Array(errors.base));
    const baseErrorCount = oFetch(baseErrors, 'length');
    const rowErrors = _.omit(oFetch(record, 'errors'), ['base']);
    const rowErrorCount = _.size(rowErrors);
    const headers = _.keys(rawData);

    return <div key={key} className="boss-report__record">
      { (baseErrorCount > 0) && <p className="boss-report__text boss-report__text_size_m boss-report__text_adjust_wrap">{ baseErrors.join(', ') }</p> }
      { (baseErrorCount <= 0) && <p className="boss-report__text boss-report__text_size_m boss-report__text_adjust_wrap" >{ `${rowErrorCount} row error(s) found`  }</p> }
      <div className="boss-report__table">
        <div className="boss-table boss-table_page_csv-upload">
          <div className="boss-table__row boss-table__row_role_header">
            { headers.map((header) => {
                return <div key={ `headers:${header}` } className="boss-table__cell boss-table__cell_role_header">{ header }</div>
              }) }
          </div>

          <div className="boss-table__row boss-table__row_state_alert">
            { headers.map((header) => {
                if (_.includes(rowErrors, header)) {
                  return <div key={ `tableCell:${header}` } className="boss-table__cell boss-table__cell_state_alert js-popover-container" data-popover="2">
                    <div className="boss-table__info">
                      <p className="boss-table__label boss-table__label_state_alert">{ header }</p>
                      <p className="boss-table__text boss-table__text_state_alert">{ oFetch(rawData, header) }</p>
                    </div>

                    <div className="boss-popover boss-popover_context_csv-upload-error js-popover" data-popover="2">
                      <a href="#" className="boss-popover__close js-popover-close">Close</a>
                      <div className="boss-popover__inner">
                        <p className="boss-popover__text boss-popover__text_role_primary boss-popover__text_adjust_wrap"><span className="boss-popover__text-marked">{ header }</span> { oFetch(rowErrors, header) }</p>
                      </div>
                    </div>
                  </div>
                } else {
                  return <div key={ `tableCell:${header}` } className="boss-table__cell">
                    <div className="boss-table__info">
                      <p className="boss-table__label">{ header }</p>
                      <p className="boss-table__text">{ oFetch(rawData, header) }</p>
                    </div>
                  </div>
                }
              }) }
          </div>
        </div>
      </div>
    </div>;
  }

  renderPaymentListItem(params) {
    const payment = oFetch(params, 'payment');
    const paymentId = oFetch(payment, 'id');
    const dateRange = oFetch(payment, 'dateRange');
    const amount = oFetch(payment, 'amount');

    return <li key={ `payment:${paymentId}` } className="boss-user-summary__review-item">
      <span className="boss-user-summary__review-line boss-user-summary__review-marked">{ amount }</span>
      <span className="boss-user-summary__review-line">{ dateRange }</span>
    </li>;
  }

  render() {
    const createdPayments = oFetch(this.props, 'createdPayments');
    const updatedPayments = oFetch(this.props, 'updatedPayments');
    const skippedInvalidPayments = oFetch(this.props, 'skippedInvalidPayments');
    const skippedExistingPayments = oFetch(this.props, 'skippedExistingPayments');
    const createdPaymentCount = oFetch(createdPayments, 'length');
    const updatedPaymentCount = oFetch(updatedPayments, 'length');

    return <div>
      { this.renderPaymentSection({
         key: "section:0",
         title: "Created",
         records: createdPayments
        }) }

      { this.renderPaymentSection({
          key: "section:1",
          title: "Updated",
          records: updatedPayments
        }) }

      { this.renderErrorSection({
          key: "section:2",
          title: 'Skipped because data invalid',
          records: skippedInvalidPayments
        }) }

      { this.renderErrorSection({
          key: "section:3",
          title: 'Skipped because already exists',
          records: skippedExistingPayments
        }) }
    </div>;
  }
}

export default PaymentUploadProcessReport;
