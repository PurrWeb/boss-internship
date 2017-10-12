import axios from 'axios';

const http = axios.create();

export const redeemVoucherRequest = ({staffMemberId, voucherId}) => {
  http.defaults.headers.common['Authorization'] = `Token token="${window.boss.accessToken}"`;

  return http.post(`/api/v1/vouchers/${voucherId}/redeem`, {
    staffMemberId,
  });
}
