import React from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';
import utils from '~/lib/utils';
import safeMoment from '~/lib/safe-moment';

class DisciplinaryItem extends React.Component {
  renderItems(disciplinaries) {
    const itemRenderer = oFetch(this.props, 'itemRenderer');

    if (disciplinaries.size === 0) {
      return <p className="boss-board__text-placeholder">No disciplinaries to display</p>;
    }

    return disciplinaries.map(disciplinary => {
      const jsDisciplinary = disciplinary.toJS();
      return React.cloneElement(itemRenderer(jsDisciplinary), {
        key: jsDisciplinary.id.toString(),
      });
    });
  }

  render() {
    const title = oFetch(this.props, 'title');
    const createdByUser = oFetch(this.props, 'createdByUser');
    const disabledByUser = oFetch(this.props, 'disabledByUser');
    const createdAt = oFetch(this.props, 'createdAt');
    const disabledAt = oFetch(this.props, 'disabledAt');
    const disabledAtFormatted =
      disabledAt && safeMoment.iso8601Parse(disabledAt).format(utils.commonDateFormatWithDay());
    const createdAtFormatted = safeMoment.iso8601Parse(createdAt).format(utils.commonDateFormatWithDay());
    const expiredAt = oFetch(this.props, 'expiredAt');
    const exporesAtFormatted = safeMoment.iso8601Parse(expiredAt).format(utils.commonDateFormatWithDay());

    const onViewNote = oFetch(this.props, 'onViewNote');
    const onOpenDisableDisciplinary = oFetch(this.props, 'onOpenDisableDisciplinary');
    const isExpired = oFetch(this.props, 'isExpired');
    const isDisablable = oFetch(this.props, 'isDisablable');
    return (
      <div
        className={`boss-check boss-check_role_panel boss-check_page_profile-disciplinary ${disabledAt &&
          'boss-check_state_alert'}`}
      >
        <div className="boss-check__header">
          <div className="boss-check__header-group">
            <h3 className="boss-check__title">
              {title}
              {isExpired && <span className="boss-check__title-status"> (Expired)</span>}
            </h3>
            <div className="boss-check__header-meta">
              <div className="boss-check__header-meta-item">
                <p className="boss-check__text">
                  <span className="boss-check__text-label">Created by: </span>
                  {createdByUser}
                </p>
              </div>
              <div className="boss-check__header-meta-item">
                <p className="boss-check__text">
                  <span className="boss-check__text-label">Created at: </span>
                  {createdAtFormatted}
                </p>
              </div>
              <div className="boss-check__header-meta-item">
                <p className="boss-check__text">
                  <span className="boss-check__text-label">Expires at: </span>
                  {exporesAtFormatted}
                </p>
              </div>
            </div>
            {disabledByUser && (
              <div className="boss-check__header-meta">
                <div className="boss-check__header-meta-item">
                  <p className="boss-check__text">
                    <span className="boss-check__text-label">Disabled by: </span>
                    {disabledByUser}
                  </p>
                </div>
                <div className="boss-check__header-meta-item">
                  <p className="boss-check__text">
                    <span className="boss-check__text-label">Disabled at: </span>
                    {disabledAtFormatted}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="boss-check__header-actions">
            <button
              type="button"
              className="boss-button boss-button_role_view-notes boss-button_type_small boss-check__header-action"
              onClick={onViewNote}
            >
              View Note
            </button>
            {!(isExpired || disabledAt) &&
              isDisablable && (
                <button
                  onClick={onOpenDisableDisciplinary}
                  type="button"
                  className="boss-button boss-button_role_disable boss-button_type_small boss-check__header-action"
                >
                  Disable
                </button>
              )}
          </div>
        </div>
      </div>
    );
  }
}

DisciplinaryItem.propTypes = {
  title: PropTypes.string.isRequired,
  createdByUser: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  expiredAt: PropTypes.string.isRequired,
  isDisablable: PropTypes.bool.isRequired,
};

export default DisciplinaryItem;
