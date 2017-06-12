import * as React from 'react';
import {scroller} from 'react-scroll';
import * as pluralize from 'pluralize';

import {PropsExtendedByConnect} from '../../../interfaces/component';

interface Props {
}

const Component = (props: any) => {
    const scrollToReview = () => {
      scroller.scrollTo('reviewBlock', {
        duration: 500,
        delay: 100,
        smooth: true,
      });
    };

    return props.flaggedStaffMembersCount > 0 ?
          <div className="boss-page-content__group">
              <div className="boss-alert">
                  <p className="boss-alert__text">
                    Found <span className="boss-alert__text-value">{props.flaggedStaffMembersCount}</span> <a href="javascript:;" className="boss-alert__text-link" onClick={scrollToReview}>unreviewed</a> staff {pluralize('member', props.flaggedStaffMembersCount)}. Please review before creating this staff member.
                  </p>
              </div>
            </div> : <div></div>;
};

export default Component;