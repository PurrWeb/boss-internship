import * as React from 'react';

import {PropsExtendedByConnect} from '../../../interfaces/component';
import {ExistingProfiles} from '../../../interfaces/store-models';

interface Props {
}

const ExistingStaffMemberPprofile = ({existingProfile}: any) => {
  return <p className="boss-alert__text">
    Staff member <strong>{existingProfile.full_name}</strong> with given <strong>{existingProfile.field}</strong> already exist <a href={existingProfile.profile_url} target="_blank" className="boss-alert__text-link">go to profile</a>
  </p>;
};

const Component = (props: any) => {
  const profiles =  props.existingProfiles.map((existingProfile: ExistingProfiles, i: number) => <ExistingStaffMemberPprofile key={i} existingProfile={existingProfile}/>);
  return <div className="boss-page-content__group">
      <div className="boss-alert">
        {profiles}
      </div>
    </div>;
};

export default Component;