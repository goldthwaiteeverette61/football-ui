import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { UserProgressVO, UserProgressForm, UserProgressQuery } from '@/api/biz/userProgress/types';

/**
 * 查询用户跟投进度列表
 * @param query
 * @returns {*}
 */

export const listUserProgress = (query?: UserProgressQuery): AxiosPromise<UserProgressVO[]> => {
  return request({
    url: '/biz/userProgress/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询用户跟投进度详细
 * @param progressId
 */
export const getUserProgress = (progressId: string | number): AxiosPromise<UserProgressVO> => {
  return request({
    url: '/biz/userProgress/' + progressId,
    method: 'get'
  });
};

/**
 * 新增用户跟投进度
 * @param data
 */
export const addUserProgress = (data: UserProgressForm) => {
  return request({
    url: '/biz/userProgress',
    method: 'post',
    data: data
  });
};

/**
 * 修改用户跟投进度
 * @param data
 */
export const updateUserProgress = (data: UserProgressForm) => {
  return request({
    url: '/biz/userProgress',
    method: 'put',
    data: data
  });
};

/**
 * 删除用户跟投进度
 * @param progressId
 */
export const delUserProgress = (progressId: string | number | Array<string | number>) => {
  return request({
    url: '/biz/userProgress/' + progressId,
    method: 'delete'
  });
};
