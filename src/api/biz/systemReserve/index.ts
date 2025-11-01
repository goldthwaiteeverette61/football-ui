import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { SystemReserveVO, SystemReserveForm, SystemReserveQuery } from '@/api/biz/systemReserve/types';

/**
 * 查询系统储备金明细列表
 * @param query
 * @returns {*}
 */

export const listSystemReserve = (query?: SystemReserveQuery): AxiosPromise<SystemReserveVO[]> => {
  return request({
    url: '/biz/systemReserve/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询系统储备金明细详细
 * @param reserveId
 */
export const getSystemReserve = (reserveId: string | number): AxiosPromise<SystemReserveVO> => {
  return request({
    url: '/biz/systemReserve/' + reserveId,
    method: 'get'
  });
};

/**
 * 新增系统储备金明细
 * @param data
 */
export const addSystemReserve = (data: SystemReserveForm) => {
  return request({
    url: '/biz/systemReserve',
    method: 'post',
    data: data
  });
};

/**
 * 修改系统储备金明细
 * @param data
 */
export const updateSystemReserve = (data: SystemReserveForm) => {
  return request({
    url: '/biz/systemReserve',
    method: 'put',
    data: data
  });
};

/**
 * 删除系统储备金明细
 * @param reserveId
 */
export const delSystemReserve = (reserveId: string | number | Array<string | number>) => {
  return request({
    url: '/biz/systemReserve/' + reserveId,
    method: 'delete'
  });
};
