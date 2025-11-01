import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { OddsVO, OddsForm, OddsQuery } from '@/api/biz/odds/types';

/**
 * 查询比赛赔率列表
 * @param query
 * @returns {*}
 */

export const listOdds = (query?: OddsQuery): AxiosPromise<OddsVO[]> => {
  return request({
    url: '/biz/odds/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询比赛赔率详细
 * @param id
 */
export const getOdds = (id: string | number): AxiosPromise<OddsVO> => {
  return request({
    url: '/biz/odds/' + id,
    method: 'get'
  });
};

/**
 * 新增比赛赔率
 * @param data
 */
export const addOdds = (data: OddsForm) => {
  return request({
    url: '/biz/odds',
    method: 'post',
    data: data
  });
};

/**
 * 修改比赛赔率
 * @param data
 */
export const updateOdds = (data: OddsForm) => {
  return request({
    url: '/biz/odds',
    method: 'put',
    data: data
  });
};

/**
 * 删除比赛赔率
 * @param id
 */
export const delOdds = (id: string | number | Array<string | number>) => {
  return request({
    url: '/biz/odds/' + id,
    method: 'delete'
  });
};
