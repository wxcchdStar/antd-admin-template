import api from './base';

export function login(username, password) {
  return api.post('/v1/login', {
    username,
    password,
    platform: 'web'
  });
}

export function logout() {
  return api.get('/v1/logout');
}

export function modifyPassword(oldPassword, newPassword) {
  return api.post('/v1/user/modify-password', {
    oldPassword,
    newPassword
  });
}

export function resetPassword(id, params) {
  return api.post('/v1/user/reset-password/' + id, params);
}

export function addUser(params) {
  return api.post('/v1/user/add', params);
}

export function editUser(id, params) {
  return api.post('/v1/user/edit/' + id, params);
}

export function deleteUser(id) {
  return api.get('/v1/user/delete/' + id);
}

export function getUserList(params) {
  return api.get('/v1/user/list', { params });
}
