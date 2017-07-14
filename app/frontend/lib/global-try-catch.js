import ReactUpdates from "react-dom/lib/ReactUpdates";
import ReactDefaultBatchingStrategy from "react-dom/lib/ReactDefaultBatchingStrategy";
import errorHandler from '~/lib/error-handlers';
import oFetch from 'o-fetch';

const rollbarData = oFetch(window, 'boss.rollbarData');
const appVersion = oFetch(window, 'boss.currentVersion');

const ReactTryCatchBatchingStrategy = {
  // this is part of the BatchingStrategy API. simply pass along
  // what the default batching strategy would do.
  get isBatchingUpdates () { return ReactDefaultBatchingStrategy.isBatchingUpdates; },

  batchedUpdates (...args) {
    try {
      ReactDefaultBatchingStrategy.batchedUpdates(...args);
    } catch (e) {
      if (typeof Rollbar !== 'undefined') {
        let payload = {};
        payload.app_version = appVersion;

        if (typeof rollbarData.currentVenue !== 'undefined') {
          let { id, name, rollbar_guid } = rollbarData.currentVenue
          payload.venue = { id, name };
          payload.person = {
            id: rollbar_guid,
            username: `Venue: ${ name }`,
          }
        }

        if (typeof rollbarData.currentUser !== 'undefined') {
          let { id, name, rollbar_guid } = rollbarData.currentUser;
          payload.user = { id, name };
          payload.person = {
            id: rollbar_guid,
            username: `User: ${ name }`,
          }
        }
        if (typeof rollbarData.currentStaffMember !== 'undefined') {
          let { id, name, rollbar_guid } = rollbarData.currentStaffMember
          payload.staff_member = { id, name };
          payload.person = {
            id: rollbar_guid,
            username: `StaffMember: ${ name }`,
          }
        }
        Rollbar.configure({payload: payload});
      }
      errorHandler.throwErrorPage();
      throw e;
    }
  },
};

ReactUpdates.injection.injectBatchingStrategy(ReactTryCatchBatchingStrategy);
