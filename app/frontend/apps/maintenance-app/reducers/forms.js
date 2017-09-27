import { combineForms } from 'react-redux-form';

const initialMaintenanceTaskNote = {
  note: ''
};

const initialMaintenanceTask = {
  title: '',
  description: '',
  priority: ''
};

const forms = combineForms({
  maintenanceTask: initialMaintenanceTask,
  maintenanceTaskNote: initialMaintenanceTaskNote,
});

export default forms;