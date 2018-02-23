import { combineForms } from 'react-redux-form';

const initialMarketingTaskNote = {
  note: ''
};

const forms = combineForms({
  marketingTaskNote: initialMarketingTaskNote,
});

export default forms;