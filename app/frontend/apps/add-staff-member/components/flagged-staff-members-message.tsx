import * as React from 'react';

import {PropsExtendedByConnect} from '../../../interfaces/component';

interface Props {
}

const Component = (props: any) => {
    return props.flaggedStaffMembersCount > 0 ?
                <div className="boss-vetting__message">
                  <div className="boss-alert">
                      <p className="boss-alert__text">
                        Founded <span className="boss-alert__text-value">{props.flaggedStaffMembersCount}</span> unreviewed staff members
                      </p>
                  </div>
                </div> : <div></div>;
};

export default Component;