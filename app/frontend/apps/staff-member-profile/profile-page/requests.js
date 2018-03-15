import axios from 'axios';
import http from '~/lib/request-api';

export const sendPasswordSetupEmailRequest = (staffMember) => {
  return http({
    successMessage: 'Sending setup email successful',
    errorMessage: 'There was a problem sending the setup email'
  }).post(`/api/v1/staff_members/${staffMember.id}/send_verification`);
}

export const resendPasswordSetupEmailRequest = (staffMember) => {
  return http({
    successMessage: 'Resending setup email successful',
    errorMessage: 'There was a problem resending the setup email'
  }).post(`/api/v1/staff_members/${staffMember.id}/resend_verification`);
}

export const revokePasswordSetupEmailRequest = (staffMember) => {
  return http({
    successMessage: 'Revoking setup email successful',
    errorMessage: 'There was a problem revoking the setup email successful'
  }).post(`/api/v1/staff_members/${staffMember.id}/revoke_verification`);
}

export const sendMobileAppDownloadEmailRequest = (endpointUrl, appName, mobileAppId) => {
  return http({
    successMessage: 'Download Email Sent Successfully for ' + appName,
    errorMessage: 'There was a problem sending the download email for ' + appName
  }).post(endpointUrl, {mobileAppId: mobileAppId})
}
