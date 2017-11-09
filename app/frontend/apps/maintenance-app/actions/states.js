import constants from '../constants';

export function setFrontendState(frontendStateParams) {
  return {
    type: constants.SET_FRONTEND_STATE,
    frontendStateParams
  };
}

export function setCurrentMaintenanceTask(maintenanceTask) {
  return {
    type: constants.SET_MAINTENANCE_TASK,
    maintenanceTask
  };
}

export function updateMaintenanceTaskState(maintenanceTask) {
  return {
    type: constants.UPDATE_MAINTENANCE_TASK,
    maintenanceTask
  };
}

export function setMaintenanceTaskImageUpload(uploadParams) {
  return {
    type: constants.SET_MAINTENANCE_TASK_IMAGE_UPLOAD,
    uploadParams
  };
}
