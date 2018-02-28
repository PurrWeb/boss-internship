import Immutable from 'immutable';
import constants from '../constants';
import oFetch from "o-fetch";
import {RESTRICTED_ACCESS_LEVEL, MANAGER_ROLE} from '~/lib/user-permissions';

import notify from '~/components/global-notification';

const initialState = Immutable.Map({
  venues: [],
  statuses: [],
  marketingTasks: [],
  generalTasks: [],
  artworkTasks: [],
  musicTasks: [],
  sportsTasks: [],
  permissions: {
    userRole: MANAGER_ROLE,
    accessLevel: RESTRICTED_ACCESS_LEVEL,
    canViewPage: 'true',
    canCreateTasks: 'false'
  },
  currentUser: null,
  selectedMarketingTask: null,
  marketingTaskUsers: [],
  filter: {
    page: 1,
    venues: '',
    statuses: 'pending',
    startDate: {},
    endDate: {},
    lateTaskOnly: false,
    assignedToUser: '',
    assignedToSelf: false
  },
  pagination: {
    generalTaskPage: 1,
    generalTaskCount: 1,
    musicTaskPage: 1,
    musicTaskTotalPages: 1,
    sportsTaskPage: 1,
    sportsTaskTotalPages: 1,
    artworkTaskPage: 1,
    artworkTaskTotalPages: 1,
  },
  frontend: {
    loading: true,
    saving: false,
    saved: false,
    failed: false,
    showNotesModal: false,
    showTimelineModal: false,
    showAssignedToModal: false,
    showCreateTaskModal: false,
    showEditTaskModal: false,
    showDeleteTaskModal: false,
    taskType: null,
  }
});

const marketing = (state = initialState, action) => {
  let marketingTasks, updatedTask, marketingTasksObject, marketingTask;

  switch (action.type) {
  case constants.INITIAL_LOAD:
    return state.set(
      'frontend', Object.assign({}, state.get('frontend'), { loading: true })
    ).set(
      'venues', action.initialData.venues
    ).set(
      'statuses', action.initialData.statuses
    ).set(
      'marketingTasks', action.initialData.marketingTasks
    ).set(
      'marketingTaskUsers', action.initialData.marketingTaskUsers
    ).set(
      'generalTasks', getMarketingTaskForType(action.initialData.marketingTasks, 'GeneralTask')
    ).set(
      'artworkTasks', getMarketingTaskForType(action.initialData.marketingTasks, 'ArtworkTask')
    ).set(
      'musicTasks', getMarketingTaskForType(action.initialData.marketingTasks, 'MusicTask')
    ).set(
      'sportsTasks', getMarketingTaskForType(action.initialData.marketingTasks, 'SportsTask')
    ).set(
      'currentUser', action.initialData.currentUser
    ).set(
      'filter', Object.assign({}, state.get('filter'))
    ).set(
      'permissions', oFetch(action.initialData, 'userPermissions')
    ).set(
      'pagination', Object.assign({}, state.get('pagination'), {
        generalTaskCount: action.initialData.generalTaskCount,
        musicTaskCount: action.initialData.musicTaskCount,
        sportsTaskCount: action.initialData.sportsTaskCount,
        artworkTaskCount: action.initialData.artworkTaskCount,
      })
    );

  case constants.SET_FRONTEND_STATE:
    return state.set(
      'frontend', Object.assign({}, state.get('frontend'), action.payload)
    );

  case constants.SET_MARKETING_TASK:
    return state.set(
      'selectedMarketingTask', action.marketingTask
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
    notify('Marketing Task Note successfully added.', {
      interval: 5000,
      status: 'success'
    });

    marketingTask = state.get('marketingTasks').find((task) => { return task.id === action.payload.marketingTaskId });
    marketingTask.marketingTaskNotes.push(action.payload);
    marketingTasksObject = getMarketingTasks(state, marketingTask);

    return state.set(
      'frontend', Object.assign({}, state.get('frontend'), { updating: false })
    ).set(
      marketingTasksObject.type, marketingTasksObject.tasks
    );

  case constants.POST_ADD_NOTE_FAILURE:
    notify('Something went wrong while adding this note.', {
      interval: 5000,
      status: 'error'
    });

    return state.set(
      'frontend', Object.assign({}, state.get('frontend'), { updating: false })
    );

  case constants.DELETE_MARKETING_TASK_REQUEST:
    return state.set(
      'frontend', Object.assign({}, state.get('frontend'), { updating: true })
    )

  case constants.DELETE_MARKETING_TASK_RECEIVE:
    notify('Marketing Task successfully deleted.', {
      interval: 5000,
      status: 'success'
    });

    marketingTasksObject = getMarketingTasks(state, action.payload);

    return state.set(
      'frontend', Object.assign({}, state.get('frontend'), { updating: false })
    ).set(
      marketingTasksObject.type, marketingTasksObject.tasks
    );

  case constants.DELETE_MARKETING_TASK_FAILURE:
    notify('Something went wrong while deleting this task', {
      interval: 5000,
      status: 'error'
    });

    return state.set(
      'frontend', Object.assign({}, state.get('frontend'), { updating: false })
    )

  case constants.RESTORE_MARKETING_TASK_REQUEST:
    return state.set(
      'frontend', Object.assign({}, state.get('frontend'), { updating: true })
    )

  case constants.RESTORE_MARKETING_TASK_RECEIVE:
    notify('Marketing Task successfully restored.', {
      interval: 5000,
      status: 'success'
    });

    marketingTasksObject = getMarketingTasks(state, action.payload);

    return state.set(
      'frontend', Object.assign({}, state.get('frontend'), { updating: false })
    ).set(
      marketingTasksObject.type, marketingTasksObject.tasks
    );

  case constants.RESTORE_MARKETING_TASK_FAILURE:
    notify('Something went wrong while restoring this task', {
      interval: 5000,
      status: 'error'
    });

    return state.set(
      'frontend', Object.assign({}, state.get('frontend'), { updating: false })
    )

  case constants.POST_CHANGE_STATUS_REQUEST:
    return state.set(
      'frontend', Object.assign({}, state.get('frontend'), { updating: true })
    );

  case constants.POST_CHANGE_STATUS_RECEIVE:
    notify('Marketing Task status successfully changed.', {
      interval: 5000,
      status: 'success'
    });

    marketingTasksObject = getMarketingTasks(state, action.payload);

    return state.set(
      'frontend', Object.assign({}, state.get('frontend'), { updating: false, showSuccessBox: true, successMessage: `Status updated successfully` })
    ).set(
      marketingTasksObject.type, marketingTasksObject.tasks
    );

  case constants.POST_CHANGE_STATUS_FAILURE:
    notify('Something went wrong while updating the status of this task', {
      interval: 5000,
      status: 'error'
    });

    return state.set(
      'frontend', Object.assign({}, state.get('frontend'), { updating: false })
    );

  case constants.ASSIGN_TASK_TO_SELF_RECEIVE:
    marketingTasksObject = getMarketingTasks(state, action.payload);

    return state.set(
      marketingTasksObject.type, marketingTasksObject.tasks
    );

  case constants.UPDATE_MARKETING_TASK_RECEIVE:
    marketingTasksObject = getMarketingTasks(state, action.payload.data);

    return state.set(
      marketingTasksObject.type, marketingTasksObject.tasks
    );

  case constants.SET_FILTER_PARAMS:
    return state.set(
      'filter', Object.assign({}, state.get('filter'), action.filterParams)
    );

  case constants.GET_PAGINATED_MARKETING_RECEIVE:
    return state.set(
      'marketingTasks', [].concat.apply([], state.get('marketingTasks').concat(action.payload.marketingTasks))
    ).set(
      'generalTasks', [].concat.apply([], state.get('generalTasks').concat(getMarketingTaskForType(action.payload.marketingTasks, 'GeneralTask')))
    ).set(
      'artworkTasks', [].concat.apply([], state.get('artworkTasks').concat(getMarketingTaskForType(action.payload.marketingTasks, 'ArtworkTask')))
    ).set(
      'musicTasks', [].concat.apply([], state.get('musicTasks').concat(getMarketingTaskForType(action.payload.marketingTasks, 'MusicTask')))
    ).set(
      'sportsTasks', [].concat.apply([], state.get('sportsTasks').concat(getMarketingTaskForType(action.payload.marketingTasks, 'SportsTask')))
    ).set(
      'pagination', Object.assign({}, state.get('pagination'), {
        generalTaskCount: action.payload.generalTaskCount,
        musicTaskCount: action.payload.musicTaskCount,
        sportsTaskCount: action.payload.sportsTaskCount,
        artworkTaskCount: action.payload.artworkTaskCount,
        page: action.payload.page
      })
    );

  case constants.GET_MARKETING_RECEIVE:
    return state.set(
      'marketingTasks', action.payload.marketingTasks
    ).set(
      'generalTasks', getMarketingTaskForType(action.payload.marketingTasks, 'GeneralTask')
    ).set(
      'artworkTasks', getMarketingTaskForType(action.payload.marketingTasks, 'ArtworkTask')
    ).set(
      'musicTasks', getMarketingTaskForType(action.payload.marketingTasks, 'MusicTask')
    ).set(
      'sportsTasks', getMarketingTaskForType(action.payload.marketingTasks, 'SportsTask')
    ).set(
      'pagination', Object.assign({}, state.get('pagination'), {
        generalTaskCount: action.payload.generalTaskCount,
        musicTaskCount: action.payload.musicTaskCount,
        sportsTaskCount: action.payload.sportsTaskCount,
        artworkTaskCount: action.payload.artworkTaskCount,
        page: action.payload.page
      })
    );

  case constants.GET_MARKETING_FAILURE:
    return state.set(
      'filter', Object.assign({}, state.get('filter'), { updating: false })
    );

  case constants.SET_FILTER_PARAMS:
    return state.set(
      'filter', Object.assign({}, state.get('filter'), action.filterParams)
    );

  default:
    return state;
  }
};

function getMarketingTaskForType(tasks, type) {
  return tasks.filter((m) => { return m.type == type })
}

function getMarketingTasks(state, task) {
  let marketingTasks = [];
  let taskType;

  if (task.type == 'GeneralTask') {
    marketingTasks = state.get('generalTasks');
    taskType = 'generalTasks';
  } else if (task.type == 'ArtworkTask') {
    marketingTasks = state.get('artworkTasks');
    taskType = 'artworkTasks';
  } else if (task.type == 'MusicTask') {
    marketingTasks = state.get('musicTasks');
    taskType = 'musicTasks';
  } else if (task.type == 'SportsTask') {
    marketingTasks = state.get('sportsTask');
    taskType = 'sportsTask';
  }

  marketingTasks = marketingTasks.map((marketingTask) => {
    if (marketingTask.id === task.id) {
      return task;
    } else {
      return marketingTask;
    }
  });

  return { type: taskType, tasks: marketingTasks }
}

export default marketing;
