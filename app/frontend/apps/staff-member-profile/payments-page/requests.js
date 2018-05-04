import axios from 'axios';
import globalNotification from '~/components/global-notification';
import oFetch from 'o-fetch';
import utils from "~/lib/utils";
import { queryParamValues } from './components/payment-filter';
import { apiRoutes } from '~/lib/routes';

export const indexRequest = (params) => {
  const accessToken = oFetch(params, 'accessToken');
  const staffMemberId = oFetch(params, 'staffMemberId');
  const mStartDate = oFetch(params, 'mStartDate');
  const mEndDate = oFetch(params, 'mEndDate');
  const statusFilter = oFetch(params, 'statusFilter');
  const queryStringParams = queryParamValues({
    mStartDate: mStartDate,
    mEndDate: mEndDate,
    statusFilter: statusFilter
  });
  const apiRoute = oFetch(apiRoutes, 'staffMemberPayments');

  return axios.get(
    apiRoute.getPath(staffMemberId, queryStringParams),
    {
      params: {},
      headers: {
        Authorization: `Token token=${accessToken}`
      }
    }
  )
}
