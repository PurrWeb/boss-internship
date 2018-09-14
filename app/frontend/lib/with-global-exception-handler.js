import errorHandler from '~/lib/error-handlers';
import { rollbarPresent, getRollbarPayload } from '~/lib/rollbar-helpers';

export const withGlobalErrorHandler = (promise) => {
  return promise.catch((err) => {
    if (rollbarPresent()) {
      Rollbar.error(err, null, getRollbarPayload());
    }
    console.log(err);
    errorHandler.throwErrorPage();
  });
};
