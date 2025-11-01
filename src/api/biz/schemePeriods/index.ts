import request from '@/utils/request';
import { SchemePeriodsVO, SchemePeriodsQuery, SchemePeriodsForm } from './types';
import { AxiosPromise } from 'axios';

// 查询方案期数列表
export const listSchemePeriods = (query?: SchemePeriodsQuery): AxiosPromise<SchemePeriodsVO[]> => {
  return request({
    url: '/biz/schemePeriods/list',
    method: 'get',
    params: query
  });
};

// 查询方案期数详细
export const getSchemePeriods = (periodId: number | string): AxiosPromise<SchemePeriodsVO> => {
  return request({
    url: '/biz/schemePeriods/' + periodId,
    method: 'get'
  });
};


// 新增方案期数
export const addSchemePeriods = (data: SchemePeriodsForm) => {
  return request({
    url: '/biz/schemePeriods',
    method: 'post',
    data: data
  });
};

// 修改方案期数
export const updateSchemePeriods = (data: SchemePeriodsForm) => {
  return request({
    url: '/biz/schemePeriods',
    method: 'put',
    data: data
  });
};

// 删除方案期数
export const delSchemePeriods = (periodId: string | number | Array<string | number>) => {
  return request({
    url: '/biz/schemePeriods/' + periodId,
    method: 'delete'
  });
};

// 发布方案
export const publishSchemePeriod = (periodId: number) => {
  return request({
    url: '/biz/schemePeriods/publish/' + periodId,
    method: 'post'
  });
};
