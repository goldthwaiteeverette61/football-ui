import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { ReferralsVO, ReferralsForm, ReferralsQuery } from '@/api/biz/referrals/types';

/**
 * 查询好友推荐关系列表
 * @param query
 * @returns {*}
 */

export const listReferrals = (query?: ReferralsQuery): AxiosPromise<ReferralsVO[]> => {
  return request({
    url: '/biz/referrals/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询好友推荐关系详细
 * @param id
 */
export const getReferrals = (id: string | number): AxiosPromise<ReferralsVO> => {
  return request({
    url: '/biz/referrals/' + id,
    method: 'get'
  });
};

/**
 * 新增好友推荐关系
 * @param data
 */
export const addReferrals = (data: ReferralsForm) => {
  return request({
    url: '/biz/referrals',
    method: 'post',
    data: data
  });
};

/**
 * 修改好友推荐关系
 * @param data
 */
export const updateReferrals = (data: ReferralsForm) => {
  return request({
    url: '/biz/referrals',
    method: 'put',
    data: data
  });
};

/**
 * 删除好友推荐关系
 * @param id
 */
export const delReferrals = (id: string | number | Array<string | number>) => {
  return request({
    url: '/biz/referrals/' + id,
    method: 'delete'
  });
};
