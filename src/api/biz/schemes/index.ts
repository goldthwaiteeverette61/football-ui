import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { SchemesVO, SchemesForm, SchemesQuery } from '@/api/biz/schemes/types';

/**
 * 查询投注方案列表
 * @param query
 * @returns {*}
 */

export const listSchemes = (query?: SchemesQuery): AxiosPromise<SchemesVO[]> => {
  return request({
    url: '/biz/schemes/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询投注方案详细
 * @param schemeId
 */
export const getSchemes = (schemeId: string | number): AxiosPromise<SchemesVO> => {
  return request({
    url: '/biz/schemes/' + schemeId,
    method: 'get'
  });
};

/**
 * 新增投注方案
 * @param data
 */
export const addSchemes = (data: SchemesForm) => {
  return request({
    url: '/biz/schemes',
    method: 'post',
    data: data
  });
};

/**
 * 修改投注方案
 * @param data
 */
export const updateSchemes = (data: SchemesForm) => {
  return request({
    url: '/biz/schemes',
    method: 'put',
    data: data
  });
};

/**
 * 删除投注方案
 * @param schemeId
 */
export const delSchemes = (schemeId: string | number | Array<string | number>) => {
  return request({
    url: '/biz/schemes/' + schemeId,
    method: 'delete'
  });
};
