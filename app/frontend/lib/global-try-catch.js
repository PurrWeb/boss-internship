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
      errorHandler.throwErrorPage();

      throw e;
    }
  },
};

ReactUpdates.injection.injectBatchingStrategy(ReactTryCatchBatchingStrategy);