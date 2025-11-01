import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { RewardClaimVO, RewardClaimForm, RewardClaimQuery } from '@/api/biz/rewardClaim/types';

/**
 * 查询理赔申请列表
 * @param query
 * @returns {*}
 */

export const listRewardClaim = (query?: RewardClaimQuery): AxiosPromise<RewardClaimVO[]> => {
  return request({
    url: '/biz/rewardClaim/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询理赔申请详细
 * @param id
 */
export const getRewardClaim = (id: string | number): AxiosPromise<RewardClaimVO> => {
  return request({
    url: '/biz/rewardClaim/' + id,
    method: 'get'
  });
};

/**
 * 新增理赔申请
 * @param data
 */
export const addRewardClaim = (data: RewardClaimForm) => {
  return request({
    url: '/biz/rewardClaim',
    method: 'post',
    data: data
  });
};

/**
 * 修改理赔申请
 * @param data
 */
export const updateRewardClaim = (data: RewardClaimForm) => {
  return request({
    url: '/biz/rewardClaim',
    method: 'put',
    data: data
  });
};

/**
 * 删除理赔申请
 * @param id
 */
export const delRewardClaim = (id: string | number | Array<string | number>) => {
  return request({
    url: '/biz/rewardClaim/' + id,
    method: 'delete'
  });
};

/**
 * 批准理赔申请
 * @param id
 */
export const approveRewardClaim = (id: string | number) => {
  return request({
    url: '/biz/rewardClaim/approve/' + id,
    method: 'post'
  });
};

/**
 * 拒绝理赔申请
 * @param id
 */
export const rejectRewardClaim = (id: string | number) => {
  return request({
    url: '/biz/rewardClaim/reject/' + id,
    method: 'post'
  });
};