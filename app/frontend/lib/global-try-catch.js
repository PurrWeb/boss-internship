import ReactUpdates from "react-dom/lib/ReactUpdates";
import ReactDefaultBatchingStrategy from "react-dom/lib/ReactDefaultBatchingStrategy";
import errorHandler from '~lib/error-handlers';

const ReactTryCatchBatchingStrategy = {
  // this is part of the BatchingStrategy API. simply pass along
  // what the default batching strategy would do.
  get isBatchingUpdates () { return ReactDefaultBatchingStrategy.isBatchingUpdates; },

  batchedUpdates (...args) {
    try {
      ReactDefaultBatchingStrategy.batchedUpdates(...args);
    } catch (e) {
      if (typeof Rollbar !== 'undefined') {
        window.RollbarData = window.RollbarData || {};
        let payload = {};
        if (typeof window.RollbarData.currentVenue !== 'undefined') {
          let { id, name, rollbar_guid } = window.RollbarData.currentVenue
          payload.venue = { id, name };
          payload.person = {
            id: rollbar_guid,
            username: `Venue: ${ name }`,
          }
        }
        if (typeof window.RollbarData.currentVersion !== 'undefined') {
          payload.app_version = window.RollbarData.currentVersion;
        }
        if (typeof window.RollbarData.currentUser !== 'undefined') {
          let { id, name, rollbar_guid } = window.RollbarData.currentUser;
          payload.user = { id, name };
          payload.person = {
            id: rollbar_guid,
            username: `User: ${ name }`,
          }
        }
        if (typeof window.RollbarData.currentStaffMember !== 'undefined') {
          let { id, name, rollbar_guid } = window.RollbarData.currentStaffMember
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