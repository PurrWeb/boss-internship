import axios from 'axios';
import oFetch from 'o-fetch'

const http = axios.create({
  //5 seconds
  timeout: 5000
});

export const uploadFileRequest = ({accessToken, stringData}) => {
  http.defaults.headers.common['Authorization'] = `Token token="${accessToken}"`;

  return http.post(`/api/v1/payments/upload_csv`, { stringData: stringData });
};
