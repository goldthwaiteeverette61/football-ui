import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { InvitationCodesVO, InvitationCodesForm, InvitationCodesQuery } from '@/api/biz/invitationCodes/types';

/**
 * 查询预生成邀请码池列表
 * @param query
 * @returns {*}
 */

export const listInvitationCodes = (query?: InvitationCodesQuery): AxiosPromise<InvitationCodesVO[]> => {
  return request({
    url: '/biz/invitationCodes/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询预生成邀请码池详细
 * @param codeId
 */
export const getInvitationCodes = (codeId: string | number): AxiosPromise<InvitationCodesVO> => {
  return request({
    url: '/biz/invitationCodes/' + codeId,
    method: 'get'
  });
};

/**
 * 新增预生成邀请码池
 * @param data
 */
export const addInvitationCodes = (data: InvitationCodesForm) => {
  return request({
    url: '/biz/invitationCodes',
    method: 'post',
    data: data
  });
};

/**
 * 修改预生成邀请码池
 * @param data
 */
export const updateInvitationCodes = (data: InvitationCodesForm) => {
  return request({
    url: '/biz/invitationCodes',
    method: 'put',
    data: data
  });
};

/**
 * 删除预生成邀请码池
 * @param codeId
 */
export const delInvitationCodes = (codeId: string | number | Array<string | number>) => {
  return request({
    url: '/biz/invitationCodes/' + codeId,
    method: 'delete'
  });
};
