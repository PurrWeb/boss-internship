import { createConfirmation } from 'react-confirm';
import ContentModal from '~/components/content-modal';


// create confirm function
const confirm = createConfirmation(ContentModal);

// This is optional. But I recommend to define your confirm function easy to call.
export default function(confirmation, options = {}) {
  // You can pass whatever you want to the component. These arguments will be your Component's props
  return confirm({ confirmation, options });
}
