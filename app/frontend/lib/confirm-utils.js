import { createConfirmation } from 'react-confirm';
import WarningModal from '~/components/warning-modal';
import ConfirmationModal from '~/components/confirmation-modal';

// create confirm function

// This is optional. But I recommend to define your confirm function easy to call.
export default function(confirmation, options = {}) {
  const confirm = createConfirmation(WarningModal);
  // You can pass whatever you want to the component. These arguments will be your Component's props
  return confirm({ confirmation, options });
}

export const confirmation = (confirmations, options = {}) => {
  const confirm = createConfirmation(ConfirmationModal);
  // You can pass whatever you want to the component. These arguments will be your Component's props
  return confirm({ confirmations, options });
}
