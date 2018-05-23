import constants from '../constants';
import { apiRoutes } from '~/lib/routes'
import { CALL_API } from 'redux-api-middleware';

export function queryMaintenanceTasks(filterState) {
  return {
    [CALL_API]: {
      endpoint: `${apiRoutes.maintenanceTasks.getPath() + '?' + $.param(filterState)}`,
      method: apiRoutes.maintenanceTasks.method,
      types: [
        constants.GET_MAINTENANCE_REQUEST,
        constants.GET_MAINTENANCE_RECEIVE,
        constants.GET_MAINTENANCE_FAILURE
      ],
      headers: {
        Authorization: 'Token token=' + window.boss.accessToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }
  }
}

export function changeStatus(maintenanceTask) {
  return {
    [CALL_API]: {
      endpoint: apiRoutes.maintenanceTaskChangeStatus.getPath(maintenanceTask.id),
      method: apiRoutes.maintenanceTaskChangeStatus.method,
      types: [
        constants.POST_CHANGE_STATUS_REQUEST,
        constants.POST_CHANGE_STATUS_RECEIVE,
        constants.POST_CHANGE_STATUS_FAILURE
      ],
      headers: {
        Authorization: 'Token token=' + window.boss.accessToken,
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
  return {
    [CALL_API]: {
      endpoint: apiRoutes.maintenanceTaskNote.getPath(maintenanceTask.id),
      method: apiRoutes.maintenanceTaskNote.method,
      types: [
        constants.POST_ADD_NOTE_REQUEST,
        constants.POST_ADD_NOTE_RECEIVE,
        constants.POST_ADD_NOTE_FAILURE
      ],
      headers: {
        Authorization: 'Token token=' + window.boss.accessToken,
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
  return {
    [CALL_API]: {
      endpoint: apiRoutes.createMaintenanceTask.getPath(),
      method: apiRoutes.createMaintenanceTask.method,
      types: [
        constants.POST_CREATE_MAINTENANCE_TASK_REQUEST,
        constants.POST_CREATE_MAINTENANCE_TASK_RECEIVE,
        constants.POST_CREATE_MAINTENANCE_TASK_FAILURE
      ],
      headers: {
        Authorization: 'Token token=' + window.boss.accessToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(params)
    }
  }
}

export function deleteMaintenanceTask(maintenanceTask) {
  return {
    [CALL_API]: {
      endpoint: apiRoutes.deleteMaintenanceTask.getPath(maintenanceTask.id),
      method: apiRoutes.deleteMaintenanceTask.method,
      types: [
        constants.DELETE_MAINTENANCE_TASK_REQUEST,
        constants.DELETE_MAINTENANCE_TASK_RECEIVE,
        constants.DELETE_MAINTENANCE_TASK_FAILURE
      ],
      headers: {
        Authorization: 'Token token=' + window.boss.accessToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ venue_id: maintenanceTask.venue.id })
    }
  }
}

export function deleteMaintenanceTaskImage(maintenanceTaskImageId) {
  return {
    [CALL_API]: {
      endpoint: apiRoutes.deleteMaintenanceTaskImage.getPath(maintenanceTaskImageId),
      method: apiRoutes.deleteMaintenanceTaskImage.method,
      types: [
        constants.DELETE_MAINTENANCE_TASK_IMAGE_REQUEST,
        constants.DELETE_MAINTENANCE_TASK_IMAGE_RECEIVE,
        constants.DELETE_MAINTENANCE_TASK_IMAGE_FAILURE
      ],
      headers: {
        Authorization: 'Token token=' + window.boss.accessToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }
  }
}

export function editMaintenanceTask(params) {
  return {
    [CALL_API]: {
      endpoint: apiRoutes.updateMaintenanceTask.getPath(params.id),
      method: apiRoutes.updateMaintenanceTask.method,
      types: [
        constants.EDIT_MAINTENANCE_TASK_REQUEST,
        constants.EDIT_MAINTENANCE_TASK_RECEIVE,
        constants.EDIT_MAINTENANCE_TASK_FAILURE
      ],
      headers: {
        Authorization: 'Token token=' + window.boss.accessToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(params)
    }
  }
}

