import { apiRoutes } from '~/lib/routes'

export default class FileUpload {
  static endpoint = '/api/v1/maintenance_task_image_uploads';

  constructor(file, uuid) {
    this.uuid = uuid;
    this.file = file;
    this.formData = new FormData();
    this.formData.append('upload[file]', file);
    this.apiKey = window.boss.maintenance.accessToken;
  }

  static perform(file, uuid) {
    if (!file) return;

    return new Promise((resolve, reject) => {
      return new this(file)
        .upload()
        .then(json => {
          resolve(Object.assign(json, { uuid: uuid }));
        }).fail(error => {
          reject({
            file: file,
            status: error.status,
            statusText: error.statusText,
            responseJSON: error.responseJSON,
            uuid: uuid
          });
        });
    });
  }

  upload() {
    return $.ajax({
      url: apiRoutes.maintenanceTaskImageUpload.getPath(),
      data: this.formData,
      type: apiRoutes.maintenanceTaskImageUpload.method,
      contentType: false,
      processData: false,
      headers: {
        Authorization: `Token token=${this.apiKey}`
      }
    });
  }
}
