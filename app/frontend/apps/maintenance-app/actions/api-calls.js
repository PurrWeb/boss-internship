import constants from '../constants';

import { CALL_API } from 'redux-api-middleware';

export function queryMaintenanceTasks(filterState) {
  let queryParams = $.param(filterState);

  return {
    [CALL_API]: {
      endpoint: `/api/v1/maintenance_tasks?${queryParams}`,
      method: 'GET',
      types: [
        constants.GET_MAINTENANCE_REQUEST,
        constants.GET_MAINTENANCE_RECEIVE,
        constants.GET_MAINTENANCE_FAILURE
      ],
      headers: {
        Authorization: 'Token token=' + window.maintenance.accessToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }
  }
}

export function changeStatus(maintenanceTask) {
  let url = `/api/v1/maintenance_tasks/${maintenanceTask.id}/change_status`;

  return {
    [CALL_API]: {
      endpoint: url,
      method: 'POST',
      types: [
        constants.POST_CHANGE_STATUS_REQUEST,
        constants.POST_CHANGE_STATUS_RECEIVE,
        constants.POST_CHANGE_STATUS_FAILURE
      ],
      headers: {
        Authorization: 'Token token=' + window.maintenance.accessToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        venue_id: maintenanceTask.venue.id,
        status: maintenanceTask.status,
      })
    }
  }
}

export function addNote(maintenanceTask, noteValue) {
  let url = `/api/v1/maintenance_tasks/${maintenanceTask.id}/add_note`;

  return {
    [CALL_API]: {
      endpoint: url,
      method: 'POST',
      types: [
        constants.POST_ADD_NOTE_REQUEST,
        constants.POST_ADD_NOTE_RECEIVE,
        constants.POST_ADD_NOTE_FAILURE
      ],
      headers: {
        Authorization: 'Token token=' + window.maintenance.accessToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        maintenance_task_id: maintenanceTask.id,
        venue_id: maintenanceTask.venue.id,
        note: noteValue,
      })
    }
  }
}

export function createTask(params) {
  let url = `/api/v1/maintenance_tasks`;

  return {
    [CALL_API]: {
      endpoint: url,
      method: 'POST',
      types: [
        constants.POST_CREATE_MAINTENANCE_TASK_REQUEST,
        constants.POST_CREATE_MAINTENANCE_TASK_RECEIVE,
        constants.POST_CREATE_MAINTENANCE_TASK_FAILURE
      ],
      headers: {
        Authorization: 'Token token=' + window.maintenance.accessToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(params)
    }
  }
}

export function deleteMaintenanceTask(maintenanceTask) {
  let url = `/api/v1/maintenance_tasks/${maintenanceTask.id}`;

  return {
    [CALL_API]: {
      endpoint: url,
      method: 'DELETE',
      types: [
        constants.DELETE_MAINTENANCE_TASK_REQUEST,
        constants.DELETE_MAINTENANCE_TASK_RECEIVE,
        constants.DELETE_MAINTENANCE_TASK_FAILURE
      ],
      headers: {
        Authorization: 'Token token=' + window.maintenance.accessToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ venue_id: maintenanceTask.venue.id })
    }
  }
}

export function deleteMaintenanceTaskImage(id) {
  let url = `/api/v1/maintenance_task_image_uploads/${id}`;

  return {
    [CALL_API]: {
      endpoint: url,
      method: 'DELETE',
      types: [
        constants.DELETE_MAINTENANCE_TASK_IMAGE_REQUEST,
        constants.DELETE_MAINTENANCE_TASK_IMAGE_RECEIVE,
        constants.DELETE_MAINTENANCE_TASK_IMAGE_FAILURE
      ],
      headers: {
        Authorization: 'Token token=' + window.maintenance.accessToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }
  }
}

export function editMaintenanceTask(params) {
  let url = `/api/v1/maintenance_tasks/${params.id}`;

  return {
    [CALL_API]: {
      endpoint: url,
      method: 'PUT',
      types: [
        constants.EDIT_MAINTENANCE_TASK_REQUEST,
        constants.EDIT_MAINTENANCE_TASK_RECEIVE,
        constants.EDIT_MAINTENANCE_TASK_FAILURE
      ],
      headers: {
        Authorization: 'Token token=' + window.maintenance.accessToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(params)
    }
  }
}

