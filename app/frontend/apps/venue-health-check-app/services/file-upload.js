export default class FileUpload {
  static endpoint = '/api/v1/uploads';

  constructor(file) {
    this.file = file;
    this.formData = new FormData();
    this.formData.append('upload[file]', file, file.name);
    this.apiKey = window.boss.venueHealthCheck.accessToken;
  }

  static perform(file) {
    if (!file) return;

    return new Promise((resolve, reject) => {
      return this.new(file)
        .upload()
        .then(json => {
          resolve(json)
        }).fail(error => {
          reject({
            file: file,
            status: error.status,
            statusText: error.statusText,
            responseJSON: error.responseJSON
          });
        });
    });
  }

  upload() {
    return $.ajax({
      url: this.constructor.endpoint,
      data: this.formData,
      type: 'POST',
      contentType: false,
      processData: false,
      headers: {
        Authorization: `Token token=${this.apiKey}`
      }
    });
  }

  static new(params) {
    return new this(params);
  }
}
