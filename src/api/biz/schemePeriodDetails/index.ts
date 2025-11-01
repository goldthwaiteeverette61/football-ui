import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { SchemePeriodDetailsVO, SchemePeriodDetailsForm, SchemePeriodDetailsQuery } from '@/api/biz/schemePeriodDetails/types';

/**
 * 查询方案期数详情列表
 * @param query
 * @returns {*}
 */

export const listSchemePeriodDetails = (query?: SchemePeriodDetailsQuery): AxiosPromise<SchemePeriodDetailsVO[]> => {
  return request({
    url: '/biz/schemePeriodDetails/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询方案期数详情详细
 * @param detailId
 */
export const getSchemePeriodDetails = (detailId: string | number): AxiosPromise<SchemePeriodDetailsVO> => {
  return request({
    url: '/biz/schemePeriodDetails/' + detailId,
    method: 'get'
  });
};

/**
 * 新增方案期数详情
 * @param data
 */
export const addSchemePeriodDetails = (data: SchemePeriodDetailsForm) => {
  return request({
    url: '/biz/schemePeriodDetails',
    method: 'post',
    data: data
  });
};

/**
 * 修改方案期数详情
 * @param data
 */
export const updateSchemePeriodDetails = (data: SchemePeriodDetailsForm) => {
  return request({
    url: '/biz/schemePeriodDetails',
    method: 'put',
    data: data
  });
};

/**
 * 删除方案期数详情
 * @param detailId
 */
export const delSchemePeriodDetails = (detailId: string | number | Array<string | number>) => {
  return request({
    url: '/biz/schemePeriodDetails/' + detailId,
    method: 'delete'
  });
};
