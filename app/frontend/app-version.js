import oFetch from "o-fetch";

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

const currentVersion = oFetch(window, "boss.currentVersion");
export default class AppVersion {
  constructor(options = {}) {
    this.currentVersion = parseFloat(currentVersion);
    this.options = {
      failedLimit: 5,
      interval: 5 * 60 * 1000
    }
    if (Object.prototype.toString.call(options) === '[object Object]') {
      this.options = {...this.options, ...options};
    }
  }

  checkVersionFromServer(callback) {
    fetch('/api/v1/version', {
      method: 'GET'
    })
    .then(checkStatus)
    .then((response) => {
      return response.json();
    }).then((json) => {
      callback(undefined, json);
    }).catch((ex) => {
      callback(ex);
    });
  }

  checkVersionEvery(callback) {
    let versionFromServer, failedCount = 0;
    let clear = setInterval(() => {
      this.checkVersionFromServer((err, resp) => {
        if(err) {
          failedCount ++;
          if (failedCount === this.options.failedLimit) {
            failedCount = 0;
            callback(err);
          }
          return;
        }
        versionFromServer = parseFloat(resp.version);
        failedCount = 0;
        if (this.checkVersions(versionFromServer)) {
          clearInterval(clear);
        }
        callback(undefined, this.checkVersions(versionFromServer));
      })
    }, this.options.interval)
  };

  checkVersions(versionFromServer) {
    return this.currentVersion !== versionFromServer;
  }
}
