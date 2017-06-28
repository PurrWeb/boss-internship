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
          payload.venue = window.RollbarData.currentVenue;
        }
        if (typeof window.RollbarData.currentVersion !== 'undefined') {
          payload.app_version = window.RollbarData.currentVenue;
        }
        if (typeof window.RollbarData.currentUser !== 'undefined') {
          payload.person = window.RollbarData.currentUser;
        }
        if (typeof window.RollbarData.currentStaffMember !== 'undefined') {
          payload.person = window.RollbarData.currentStaffMember;
        }
        Rollbar.configure({payload: payload});
      }
      errorHandler.throwErrorPage();
      throw e;
    }
  },
};

ReactUpdates.injection.injectBatchingStrategy(ReactTryCatchBatchingStrategy);