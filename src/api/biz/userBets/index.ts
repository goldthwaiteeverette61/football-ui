import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { UserBetsVO, UserBetsForm, UserBetsQuery } from '@/api/biz/userBets/types';

/**
 * 查询用户投注记录列表
 * @param query
 * @returns {*}
 */

export const listUserBets = (query?: UserBetsQuery): AxiosPromise<UserBetsVO[]> => {
  return request({
    url: '/biz/userBets/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询用户投注记录详细
 * @param id
 */
export const getUserBets = (id: string | number): AxiosPromise<UserBetsVO> => {
  return request({
    url: '/biz/userBets/' + id,
    method: 'get'
  });
};

/**
 * 新增用户投注记录
 * @param data
 */
export const addUserBets = (data: UserBetsForm) => {
  return request({
    url: '/biz/userBets',
    method: 'post',
    data: data
  });
};

/**
 * 修改用户投注记录
 * @param data
 */
export const updateUserBets = (data: UserBetsForm) => {
  return request({
    url: '/biz/userBets',
    method: 'put',
    data: data
  });
};

/**
 * 删除用户投注记录
 * @param id
 */
export const delUserBets = (id: string | number | Array<string | number>) => {
  return request({
    url: '/biz/userBets/' + id,
    method: 'delete'
  });
};
