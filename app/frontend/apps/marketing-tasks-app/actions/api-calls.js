import axios from 'axios';
import { apiRoutes } from '~/lib/routes'
import { CALL_API } from 'redux-api-middleware';
import constants from '../constants'

const http = axios.create();

export const createGeneralTaskRequest = (requestData) => {
  http.defaults.headers.common['Authorization'] = `Token token="${window.boss.marketing.accessToken}"`;

  let attributes = requestData.values;
  let dueAt = null;
  let venueId = null;

  if (attributes.due_at) {
    dueAt = attributes.due_at.format('DD/MM/YYYY');
  }

  if (attributes.venue) {
    venueId = attributes.venue.value
  }

  return http.post(`/api/v1/marketing_tasks/add_general`, {
    title: attributes.title,
    description: attributes.description,
    due_at: dueAt,
    venue_id: venueId,
  });
}

export const editGeneralTaskRequest = (requestData) => {
  http.defaults.headers.common['Authorization'] = `Token token="${window.boss.marketing.accessToken}"`;

  let attributes = requestData.values;
  let dueAt = null;
  let venueId = null;

  if (attributes.due_at) {
    dueAt = attributes.due_at.format('DD/MM/YYYY');
  }

  if (attributes.venue) {
    venueId = attributes.venue.value
  }

  return http.put(`/api/v1/marketing_tasks/${attributes.id}/edit_general`, {
    title: attributes.title,
    description: attributes.description,
    due_at: dueAt,
    venue_id: venueId,
  });
}

export const createMusicTaskRequest = (requestData) => {
  http.defaults.headers.common['Authorization'] = `Token token="${window.boss.marketing.accessToken}"`;

  let attributes = requestData.values;
  let dueAt = null;
  let venueId = null;

  if (attributes.due_at) {
    dueAt = attributes.due_at.format('DD/MM/YYYY');
  }

  if (attributes.venue) {
    venueId = attributes.venue.value
  }

  return http.post(`/api/v1/marketing_tasks/add_live_music`, {
    title: attributes.title,
    due_at: dueAt,
    venue_id: venueId,
    start_time: attributes.start_time,
    days: attributes.days,
    facebook_announcement: attributes.facebook_announcement,
  });
}

export const editMusicTaskRequest = (requestData) => {
  http.defaults.headers.common['Authorization'] = `Token token="${window.boss.marketing.accessToken}"`;

  let attributes = requestData.values;
  let dueAt = null;
  let venueId = null;

  if (attributes.due_at) {
    dueAt = attributes.due_at.format('DD/MM/YYYY');
  }

  if (attributes.venue) {
    venueId = attributes.venue.value
  }

  return http.put(`/api/v1/marketing_tasks/${attributes.id}/edit_live_music`, {
    title: attributes.title,
    due_at: dueAt,
    venue_id: venueId,
    start_time: attributes.start_time,
    days: attributes.days,
    facebook_announcement: attributes.facebook_announcement,
  });
}

export const createSportsTaskRequest = (requestData) => {
  http.defaults.headers.common['Authorization'] = `Token token="${window.boss.marketing.accessToken}"`;

  let attributes = requestData.values;
  let dueAt = null;
  let venueId = null;

  if (attributes.due_at) {
    dueAt = attributes.due_at.format('DD/MM/YYYY');
  }

  if (attributes.venue) {
    venueId = attributes.venue.value
  }

  return http.post(`/api/v1/marketing_tasks/add_sports`, {
    title: attributes.title,
    due_at: dueAt,
    venue_id: venueId,
    start_time: attributes.start_time,
    days: attributes.days,
    facebook_announcement: attributes.facebook_announcement,
  });
}

export const editSportsTaskRequest = (requestData) => {
  http.defaults.headers.common['Authorization'] = `Token token="${window.boss.marketing.accessToken}"`;

  let attributes = requestData.values;
  let dueAt = null;
  let venueId = null;

  if (attributes.due_at) {
    dueAt = attributes.due_at.format('DD/MM/YYYY');
  }

  if (attributes.venue) {
    venueId = attributes.venue.value
  }

  return http.put(`/api/v1/marketing_tasks/${attributes.id}/edit_sports`, {
    title: attributes.title,
    due_at: dueAt,
    venue_id: venueId,
    start_time: attributes.start_time,
    days: attributes.days,
    facebook_announcement: attributes.facebook_announcement,
  });
}

export const createArtworkTaskRequest = (requestData) => {
  http.defaults.headers.common['Authorization'] = `Token token="${window.boss.marketing.accessToken}"`;

  let attributes = requestData.values;
  let dueAt = null;
  let venueId = null;
  let size = null;

  if (attributes.due_at) {
    dueAt = attributes.due_at.format('DD/MM/YYYY');
  }

  if (attributes.venue) {
    venueId = attributes.venue.value
  }

  if (attributes.size) {
    size = attributes.size.value
  }

  return http.post(`/api/v1/marketing_tasks/add_artwork`, {
    title: attributes.title,
    description: attributes.description,
    size: size,
    height_cm: attributes.height_cm,
    width_cm: attributes.width_cm,
    due_at: dueAt,
    venue_id: venueId,
    facebook_cover_page: attributes.facebook_cover_page,
    facebook_booster: attributes.facebook_booster,
    facebook_announcement: attributes.facebook_announcement,
    print: attributes.print,
    quantity: attributes.print ? attributes.quantity : null
  });
}

export const editArtworkTaskRequest = (requestData) => {
  http.defaults.headers.common['Authorization'] = `Token token="${window.boss.marketing.accessToken}"`;

  let attributes = requestData.values;
  let dueAt = null;
  let venueId = null;
  let size = null;

  if (attributes.due_at) {
    dueAt = attributes.due_at.format('DD/MM/YYYY');
  }

  if (attributes.venue) {
    venueId = attributes.venue.value
  }

  if (attributes.size) {
    size = attributes.size.value
  }

  return http.put(`/api/v1/marketing_tasks/${attributes.id}/edit_artwork`, {
    title: attributes.title,
    description: attributes.description,
    size: size,
    height_cm: attributes.height_cm,
    width_cm: attributes.width_cm,
    due_at: dueAt,
    venue_id: venueId,
    facebook_cover_page: attributes.facebook_cover_page,
    facebook_booster: attributes.facebook_booster,
    facebook_announcement: attributes.facebook_announcement,
    print: attributes.print,
    quantity: attributes.print ? attributes.quantity : null
  });
}

export function deleteMarketingTask(marketingTask) {
  return {
    [CALL_API]: {
      endpoint: apiRoutes.deleteMarketingTask.getPath(marketingTask.id),
      method: apiRoutes.deleteMarketingTask.method,
      types: [
        constants.DELETE_MARKETING_TASK_REQUEST,
        constants.DELETE_MARKETING_TASK_RECEIVE,
        constants.DELETE_MARKETING_TASK_FAILURE
      ],
      headers: {
        Authorization: 'Token token=' + window.marketing.accessToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ venue_id: marketingTask.venue.id })
    }
  }
}

export function restoreMarketingTask(marketingTask) {
  return {
    [CALL_API]: {
      endpoint: apiRoutes.restoreMarketingTask.getPath(marketingTask.id),
      method: apiRoutes.restoreMarketingTask.method,
      types: [
        constants.RESTORE_MARKETING_TASK_REQUEST,
        constants.RESTORE_MARKETING_TASK_RECEIVE,
        constants.RESTORE_MARKETING_TASK_FAILURE
      ],
      headers: {
        Authorization: 'Token token=' + window.marketing.accessToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ venue_id: marketingTask.venue.id })
    }
  }
}

export function changeStatus(marketingTask, status) {
  return {
    [CALL_API]: {
      endpoint: apiRoutes.marketingTaskChangeStatus.getPath(marketingTask.id),
      method: apiRoutes.marketingTaskChangeStatus.method,
      types: [
        constants.POST_CHANGE_STATUS_REQUEST,
        constants.POST_CHANGE_STATUS_RECEIVE,
        constants.POST_CHANGE_STATUS_FAILURE
      ],
      headers: {
        Authorization: 'Token token=' + window.marketing.accessToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        status: status
      })
    }
  }
}

export function addNote(marketingTask, noteValue) {
  return {
    [CALL_API]: {
      endpoint: apiRoutes.marketingTaskNote.getPath(marketingTask.id),
      method: apiRoutes.marketingTaskNote.method,
      types: [
        constants.POST_ADD_NOTE_REQUEST,
        constants.POST_ADD_NOTE_RECEIVE,
        constants.POST_ADD_NOTE_FAILURE
      ],
      headers: {
        Authorization: 'Token token=' + window.marketing.accessToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        marketing_task_id: marketingTask.id,
        venue_id: marketingTask.venue.id,
        note: noteValue,
      })
    }
  }
}

export function queryMarketingTasks(filterState) {
  return {
    [CALL_API]: {
      endpoint: `${apiRoutes.marketingTasks.getPath() + '?' + $.param(filterState)}`,
      method: apiRoutes.marketingTasks.method,
      types: [
        constants.GET_MARKETING_REQUEST,
        constants.GET_MARKETING_RECEIVE,
        constants.GET_MARKETING_FAILURE
      ],
      headers: {
        Authorization: 'Token token=' + window.marketing.accessToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }
  }
}

export const assignUserToTaskRequest = (requestData) => {
  http.defaults.headers.common['Authorization'] = `Token token="${window.boss.marketing.accessToken}"`;

  let attributes = requestData.values;
  let assignToUserId = null;

  if (attributes.assign_to_user) {
    assignToUserId = attributes.assign_to_user.id;
  }

  return http.put(`/api/v1/marketing_tasks/${attributes.id}/assign_user`, {
    assign_to_user_id: assignToUserId,
    assign_to_self: attributes.assign_to_self
  });
}

export function assignTaskToSelf(marketingTask) {
  return {
    [CALL_API]: {
      endpoint: apiRoutes.assignMarketingTaskToSelf.getPath(marketingTask.id),
      method: apiRoutes.assignMarketingTaskToSelf.method,
      types: [
        constants.ASSIGN_TASK_TO_SELF_REQUEST,
        constants.ASSIGN_TASK_TO_SELF_RECEIVE,
        constants.ASSIGN_TASK_TO_SELF_FAILURE
      ],
      headers: {
        Authorization: 'Token token=' + window.marketing.accessToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        assign_to_self: true
      })
    }
  }
}
