import Immutable, { fromJS } from 'immutable';
import constants from '../constants';
import oFetch from "o-fetch";
import safeMoment from '~/lib/safe-moment'

const initialState = Immutable.Map({
  venues: [],
  priorities: [],
  statuses: [],
  maintenanceTasks: [],
  currentUser: null,
  selectedMaintenanceTask: null,
  tempMaintenanceTasks: [],
  maintenanceTaskImageUploads: [],
  filter: {
    page: 1,
    perPage: 10,
    totalPages: 0,
    totalCount: 0,
    venues: '',
    priorities: '',
    statuses: 'pending,completed,rejected',
    startDate: null,
    endDate: null,
    saving: false,
  },
  frontend: {
    loading: true,
    saving: false,
    saved: false,
    failed: false,
    showModal: false,
    showNewTaskModal: false,
    showDeleteModal: false,
    showErrorBox: false,
    showSuccessBox: false,
    errorMessage: '',
    successMessage: '',
    uploadsCount: 0,
  }
});

const maintenance = (state = initialState, action) => {
  let maintenanceTasks, updatedTask;

  switch (action.type) {
    case constants.INITIAL_LOAD:
      const initialData = action.initialData;
      return state.set(
        'venues', initialData.venues
      ).set(
        'priorities', initialData.priorities
      ).set(
        'statuses', initialData.statuses
      ).set(
        'maintenanceTasks', initialData.maintenanceTasks
      ).set(
        'currentUser', initialData.currentUser
      ).set(
        'filter', {
          ...state.get('filter'),
          totalCount: initialData.totalCount,
          totalPages: initialData.totalPages,
          priorities: initialData.filter.priorities.join(','),
          statuses: initialData.filter.statuses.join(','),
          venues: initialData.filter.venueIds.join(','),
          startDate: initialData.filter.startDate ? safeMoment.uiDateParse(initialData.filter.startDate) : null,
          endDate: initialData.filter.endDate ? safeMoment.uiDateParse(initialData.filter.endDate) : null,
        })
    // ).set(
    //   'filter', Object.assign({}, state.get('filter'), { totalCount: action.initialData.totalCount, totalPages: action.initialData.totalPages })
    // );

    case constants.GET_MAINTENANCE_REQUEST:
      return state.set(
        'filter', Object.assign({}, state.get('filter'), { updating: true })
      );

    case constants.SET_MAINTENANCE_TASK:
      return state.set(
        'selectedMaintenanceTask', action.maintenanceTask
      );

    case constants.SET_FRONTEND_STATE:
      return state.set(
        'frontend', Object.assign({}, state.get('frontend'), action.frontendStateParams)
      );

    case constants.GET_MAINTENANCE_RECEIVE:
      return state.set(
        'filter', Object.assign({}, state.get('filter'), { updating: false, page: action.payload.pageNumber, totalCount: action.payload.totalCount, totalPages: action.payload.totalPages })
      ).set(
        'maintenanceTasks', action.payload.maintenanceTasks
      );

    case constants.GET_MAINTENANCE_FAILURE:
      return state.set(
        'filter', Object.assign({}, state.get('filter'), { updating: false })
      );

    case constants.SET_FILTER_PARAMS:
      return state.set(
        'filter', Object.assign({}, state.get('filter'), action.filterParams)
      );

    case constants.POST_CHANGE_STATUS_REQUEST:
      return state.set(
        'frontend', Object.assign({}, state.get('frontend'), { updating: true })
      );

    case constants.POST_CHANGE_STATUS_RECEIVE:
      maintenanceTasks = state.get('maintenanceTasks');
      updatedTask = action.payload;

      maintenanceTasks = maintenanceTasks.map((task) => {
        if (task.id === updatedTask.id) {
          return updatedTask;
        } else {
          return task;
        }
      });

      return state.set(
        'frontend', Object.assign({}, state.get('frontend'), { updating: false, showSuccessBox: true, successMessage: `Status updated successfully` })
      ).set(
        'maintenanceTasks', maintenanceTasks
      );

    case constants.EDIT_MAINTENANCE_TASK_RECEIVE:
      return state.set(
        'frontend', Object.assign({}, state.get('frontend'), { updating: false, showSuccessBox: true, successMessage: `Task updated successfully` })
      );

    case constants.POST_CHANGE_STATUS_FAILURE:
      return state.set(
        'frontend', Object.assign({}, state.get('frontend'), { updating: false })
      );

    case constants.POST_ADD_NOTE_REQUEST:
      return state.set(
        'frontend', Object.assign({}, state.get('frontend'), { updating: true })
      );

    case constants.POST_ADD_NOTE_RECEIVE:
      maintenanceTasks = state.get('maintenanceTasks').map((task) => {
        if (action.payload.maintenanceTaskId == task.id) {
          task.maintenanceTaskNotes.push(action.payload);
        }

        return task;
      });

      return state.set(
        'frontend', Object.assign({}, state.get('frontend'), { updating: false })
      ).set(
        'maintenanceTasks', maintenanceTasks
      );

    case constants.POST_ADD_NOTE_FAILURE:
      return state.set(
        'frontend', Object.assign({}, state.get('frontend'), { updating: false })
      );

    case constants.UPDATE_MAINTENANCE_TASK:
      maintenanceTasks = state.get('maintenanceTasks');
      updatedTask = action.maintenanceTask;

      maintenanceTasks = maintenanceTasks.map((task) => {
        if (task.id === updatedTask.id) {
          return updatedTask;
        } else {
          return task;
        }
      });

      return state.set(
        'frontend', Object.assign({}, state.get('frontend'), { updating: false, showSuccessBox: true, successMessage: `Task updated successfully` })
      ).set(
        'maintenanceTasks', maintenanceTasks
      );

    case constants.POST_CREATE_MAINTENANCE_TASK_REQUEST:
      return state.set(
        'frontend', Object.assign({}, state.get('frontend'), { updating: true })
      );

    case constants.POST_CREATE_MAINTENANCE_TASK_RECEIVE:
      return state.set(
        'frontend', Object.assign({}, state.get('frontend'), { updating: false, showSuccessBox: true, successMessage: `Task created successfully` })
      );

    case constants.POST_CREATE_MAINTENANCE_TASK_FAILURE:
      return state.set(
        'frontend', Object.assign({}, state.get('frontend'), { updating: false })
      );

    case constants.DELETE_MAINTENANCE_TASK_REQUEST:
      return state.set(
        'frontend', Object.assign({}, state.get('frontend'), { updating: true })
      )
    case constants.DELETE_MAINTENANCE_TASK_RECEIVE:
      return state.set(
        'frontend', Object.assign({}, state.get('frontend'), { updating: false, showSuccessBox: true, successMessage: `Task deleted successfully` })
      )
    case constants.DELETE_MAINTENANCE_TASK_FAILURE:
      return state.set(
        'frontend', Object.assign({}, state.get('frontend'), { updating: false })
      )

    case constants.SET_MAINTENANCE_TASK_IMAGE_UPLOAD:
      let uploads = state.get('maintenanceTaskImageUploads');
      let imageIds;
      let tempMaintenanceTasks = state.get('tempMaintenanceTasks');
      maintenanceTasks = state.get('maintenanceTasks');

      uploads.push(action.uploadParams);

      let existingTask = _.find(maintenanceTasks, maintenanceTask => {
        return maintenanceTask.id == action.uploadParams.maintenanceTaskId;
      });

      let existingTempTask = _.find(tempMaintenanceTasks, tempMaintenanceTask => {
        return tempMaintenanceTask.maintenanceTaskId == action.uploadParams.maintenanceTaskId;
      });

      if (existingTask) {
        imageIds = existingTask.maintenanceTaskImageIds || [];

        if (action.uploadParams.id) {
          imageIds.push(action.uploadParams.id);
        }

        let updatedTask = Object.assign(existingTask, {
          maintenanceTaskImageIds: imageIds
        });

        maintenanceTasks[maintenanceTasks.indexOf(existingTask)] = updatedTask;
      } else {
        imageIds = existingTask.maintenanceTaskImageIds || [];

        tempMaintenanceTasks.push(action.uploadParams);
      }

      return state.set(
        'maintenanceTaskImageUploads', uploads
      ).set(
        'tempMaintenanceTasks', tempMaintenanceTasks
      ).set(
        'frontend', Object.assign({}, state.get('frontend'), { uploadsCount: uploads.length })
      );

    default:
      return state;
  }
};

export default maintenance;
