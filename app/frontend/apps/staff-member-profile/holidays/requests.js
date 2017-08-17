import axios from 'axios';

const accessToken = window.boss.store.accessToken;

const http = axios.create({
  headers: {'Authorization': `Token token="${accessToken}"`}
});

export const updateAvatar = ({staffMemberId, avatarUrl}) => {
  return http.put(`/api/v1/staff_members/${staffMemberId}`, {
    avatar_url: avatarUrl,
  });
};
