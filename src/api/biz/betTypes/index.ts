import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { BetTypesVO, BetTypesForm, BetTypesQuery } from '@/api/biz/betTypes/types';

/**
 * 查询投注类型定义列表
 * @param query
 * @returns {*}
 */

export const listBetTypes = (query?: BetTypesQuery): AxiosPromise<BetTypesVO[]> => {
  return request({
    url: '/biz/betTypes/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询投注类型定义详细
 * @param id
 */
export const getBetTypes = (id: string | number): AxiosPromise<BetTypesVO> => {
  return request({
    url: '/biz/betTypes/' + id,
    method: 'get'
  });
};

/**
 * 新增投注类型定义
 * @param data
 */
export const addBetTypes = (data: BetTypesForm) => {
  return request({
    url: '/biz/betTypes',
    method: 'post',
    data: data
  });
};

/**
 * 修改投注类型定义
 * @param data
 */
export const updateBetTypes = (data: BetTypesForm) => {
  return request({
    url: '/biz/betTypes',
    method: 'put',
    data: data
  });
};

/**
 * 删除投注类型定义
 * @param id
 */
export const delBetTypes = (id: string | number | Array<string | number>) => {
  return request({
    url: '/biz/betTypes/' + id,
    method: 'delete'
  });
};
