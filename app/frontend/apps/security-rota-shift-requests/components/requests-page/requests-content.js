import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';
import ImmutablePropTypes from 'react-immutable-proptypes';

class RequestsContent extends PureComponent {
  renderItems() {
    const itemRenderer = oFetch(this.props, 'itemRenderer');
    const shiftRequests = oFetch(this.props, 'shiftRequests');

    return shiftRequests.map(shiftRequest => {
      const jsShiftRequest = shiftRequest.toJS();
      const shiftRequestId = oFetch(jsShiftRequest, 'id');

      return React.cloneElement(itemRenderer(jsShiftRequest), {
        key: shiftRequestId.toString(),
      });
    });
  }

  render() {
    const shiftRequests = oFetch(this.props, 'shiftRequests');
    return (
      <div className="boss-page-main__content">
        <div className="boss-page-main__inner">
          {this.props.children}
          <div className="boss-page-main__group boss-page-main__group_adjust_ssr-requests">
            {shiftRequests.size === 0 ? (
              <div className="boss-page-main__text-placeholder">
                There are no requests to show.
              </div>
            ) : (
              this.renderItems()
            )}
          </div>
        </div>
      </div>
    );
  }
}

RequestsContent.propTypes = {
  itemRenderer: PropTypes.func.isRequired,
  shiftRequests: ImmutablePropTypes.list.isRequired,
};

export default RequestsContent;
