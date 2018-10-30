import api from './base';

export function getAllPermissions() {
  return api.get('/v1/permission/all');
}

export function addPermission(params) {
  return api.post('/v1/permission/add', params);
}

export function editPermission(id, params) {
  return api.post('/v1/permission/edit/' + id, params);
}

export function deletePermission(id) {
  return api.post('/v1/permission/delete/' + id);
}
