import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { UserFollowDetailsVO, UserFollowDetailsForm, UserFollowDetailsQuery } from '@/api/biz/userFollowDetails/types';

import { UserFollowDetailsSaveBo } from './types';

// 保存跟投快照
export const saveUserFollowDetails = (data: UserFollowDetailsSaveBo): AxiosPromise<void> => {
  return request({
    url: '/biz/userFollowDetails/save',
    method: 'post',
    data: data
  });
};

/**
 * 查询用户跟投详情列表
 * @param query
 * @returns {*}
 */

export const listUserFollowDetails = (query?: UserFollowDetailsQuery): AxiosPromise<UserFollowDetailsVO[]> => {
  return request({
    url: '/biz/userFollowDetails/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询用户跟投详情详细
 * @param followDetailId
 */
export const getUserFollowDetails = (followDetailId: string | number): AxiosPromise<UserFollowDetailsVO> => {
  return request({
    url: '/biz/userFollowDetails/' + followDetailId,
    method: 'get'
  });
};

/**
 * 新增用户跟投详情
 * @param data
 */
export const addUserFollowDetails = (data: UserFollowDetailsForm) => {
  return request({
    url: '/biz/userFollowDetails',
    method: 'post',
    data: data
  });
};

/**
 * 修改用户跟投详情
 * @param data
 */
export const updateUserFollowDetails = (data: UserFollowDetailsForm) => {
  return request({
    url: '/biz/userFollowDetails',
    method: 'put',
    data: data
  });
};

/**
 * 删除用户跟投详情
 * @param followDetailId
 */
export const delUserFollowDetails = (followDetailId: string | number | Array<string | number>) => {
  return request({
    url: '/biz/userFollowDetails/' + followDetailId,
    method: 'delete'
  });
};
