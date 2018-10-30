import api from './base';

export function addRole(params) {
  return api.post('/v1/role/add', params);
}

export function editRole(id, params) {
  return api.post('/v1/role/edit/' + id, params);
}

export function deleteRole(id) {
  return api.post('/v1/role/delete/' + id);
}

export function getRoleList(params) {
  return api.get('/v1/role/list', { params });
}

export function impowerRole(id, permissionIds) {
  return api.post('/v1/role/grant/' + id, permissionIds);
}
