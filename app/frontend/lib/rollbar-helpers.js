import oFetch from 'o-fetch';

export const rollbarPresent = () => {
  return typeof Rollbar !== 'undefined';
};

export const getRollbarPayload = () => {
  const rollbarData = oFetch(window, 'boss.rollbarData');
  const appVersion = oFetch(window, 'boss.currentVersion');

  let payload = {};
  payload.app_version = appVersion;

  if (typeof rollbarData.currentVenue !== 'undefined') {
    let { id, name, rollbar_guid } = rollbarData.currentVenue;
    payload.venue = { id, name };
    payload.person = {
      id: rollbar_guid,
      username: `Venue: ${name}`,
    };
  }

  if (typeof rollbarData.currentUser !== 'undefined') {
    let { id, name, rollbar_guid } = rollbarData.currentUser;
    payload.user = { id, name };
    payload.person = {
      id: rollbar_guid,
      username: `User: ${name}`,
    };
  }
  if (typeof rollbarData.currentStaffMember !== 'undefined') {
    let { id, name, rollbar_guid } = rollbarData.currentStaffMember;
    payload.staff_member = { id, name };
    payload.person = {
      id: rollbar_guid,
      username: `StaffMember: ${name}`,
    };
  }
  return payload;
};
