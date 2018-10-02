export const changeQueryString = ({ status, role }) => {
  const queryString = new URLSearchParams(window.location.search);

  queryString.delete('status');
  queryString.delete('role');
  queryString.set('status', status);
  queryString.set('role', role);

  window.history.pushState('state', 'title', `invites?${queryString}`);
};