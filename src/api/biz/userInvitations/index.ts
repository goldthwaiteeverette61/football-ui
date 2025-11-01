import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { UserInvitationsVO, UserInvitationsForm, UserInvitationsQuery } from '@/api/biz/userInvitations/types';

/**
 * 查询用户邀请记录列表
 * @param query
 * @returns {*}
 */

export const listUserInvitations = (query?: UserInvitationsQuery): AxiosPromise<UserInvitationsVO[]> => {
  return request({
    url: '/biz/userInvitations/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询用户邀请记录详细
 * @param invitationId
 */
export const getUserInvitations = (invitationId: string | number): AxiosPromise<UserInvitationsVO> => {
  return request({
    url: '/biz/userInvitations/' + invitationId,
    method: 'get'
  });
};

/**
 * 新增用户邀请记录
 * @param data
 */
export const addUserInvitations = (data: UserInvitationsForm) => {
  return request({
    url: '/biz/userInvitations',
    method: 'post',
    data: data
  });
};

/**
 * 修改用户邀请记录
 * @param data
 */
export const updateUserInvitations = (data: UserInvitationsForm) => {
  return request({
    url: '/biz/userInvitations',
    method: 'put',
    data: data
  });
};

/**
 * 删除用户邀请记录
 * @param invitationId
 */
export const delUserInvitations = (invitationId: string | number | Array<string | number>) => {
  return request({
    url: '/biz/userInvitations/' + invitationId,
    method: 'delete'
  });
};
