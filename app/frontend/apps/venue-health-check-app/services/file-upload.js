export default class FileUpload {
  static endpoint = '/api/v1/uploads';

  constructor(file) {
    this.file = file;
    this.formData = new FormData();
    this.formData.append('upload[file]', file);
    this.apiKey = window.boss.venueHealthCheck.accessToken;
  }

  static perform(file) {
    if (!file) return;

    return new Promise((resolve, reject) => {
      this.new(file).upload().then(json => resolve(json))
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
