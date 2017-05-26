import * as React from 'react';
import {scroller} from 'react-scroll';

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
                    Founded <span className="boss-alert__text-value">{props.flaggedStaffMembersCount}</span> <a href="javascript:;" className="boss-alert__text-link" onClick={scrollToReview}>unreviewed</a> staff members
                  </p>
              </div>
            </div> : <div></div>;
};

export default Component;