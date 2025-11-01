import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { UserFollowsVO, UserFollowsForm, UserFollowsQuery } from '@/api/biz/userFollows/types';

/**
 * 查询用户跟投记录列表
 * @param query
 * @returns {*}
 */

export const listUserFollows = (query?: UserFollowsQuery): AxiosPromise<UserFollowsVO[]> => {
  return request({
    url: '/biz/userFollows/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询用户跟投记录详细
 * @param followId
 */
export const getUserFollows = (followId: string | number): AxiosPromise<UserFollowsVO> => {
  return request({
    url: '/biz/userFollows/' + followId,
    method: 'get'
  });
};

/**
 * 新增用户跟投记录
 * @param data
 */
export const addUserFollows = (data: UserFollowsForm) => {
  return request({
    url: '/biz/userFollows',
    method: 'post',
    data: data
  });
};

/**
 * 修改用户跟投记录
 * @param data
 */
export const updateUserFollows = (data: UserFollowsForm) => {
  return request({
    url: '/biz/userFollows',
    method: 'put',
    data: data
  });
};

/**
 * 删除用户跟投记录
 * @param followId
 */
export const delUserFollows = (followId: string | number | Array<string | number>) => {
  return request({
    url: '/biz/userFollows/' + followId,
    method: 'delete'
  });
};

/**
 * 核心修改：新增批量确认投注记录的函数
 * @param followIds 跟投ID列表
 */
export const batchConfirmFollows = (followIds: Array<string | number>) => {
  return request({
    url: '/biz/userFollows/batch-confirm',
    method: 'put',
    data: followIds
  });
}

/**
 * 【核心新增】批量标记跟投为失败
 * @param data
 */
export const batchFailFollows = (data: BatchFailBo) => {
  return request({
    url: '/biz/userFollows/batch-fail',
    method: 'put',
    data: data
  });
};
