import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { BetsVO, BetsForm, BetsQuery } from '@/api/biz/bets/types';

/**
 * 查询用户注单列表
 * @param query
 * @returns {*}
 */

export const listBets = (query?: BetsQuery): AxiosPromise<BetsVO[]> => {
  return request({
    url: '/biz/bets/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询用户注单详细
 * @param betId
 */
export const getBets = (betId: string | number): AxiosPromise<BetsVO> => {
  return request({
    url: '/biz/bets/' + betId,
    method: 'get'
  });
};

/**
 * 新增用户注单
 * @param data
 */
export const addBets = (data: BetsForm) => {
  return request({
    url: '/biz/bets',
    method: 'post',
    data: data
  });
};

/**
 * 修改用户注单
 * @param data
 */
export const updateBets = (data: BetsForm) => {
  return request({
    url: '/biz/bets',
    method: 'put',
    data: data
  });
};

/**
 * 删除用户注单
 * @param betId
 */
export const delBets = (betId: string | number | Array<string | number>) => {
  return request({
    url: '/biz/bets/' + betId,
    method: 'delete'
  });
};
