import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { SystemReserveSummaryVO, SystemReserveSummaryForm, SystemReserveSummaryQuery } from '@/api/biz/systemReserveSummary/types';

/**
 * 查询系统储备金汇总列表
 * @param query
 * @returns {*}
 */

export const listSystemReserveSummary = (query?: SystemReserveSummaryQuery): AxiosPromise<SystemReserveSummaryVO[]> => {
  return request({
    url: '/biz/systemReserveSummary/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询系统储备金汇总详细
 * @param summaryId
 */
export const getSystemReserveSummary = (summaryId: string | number): AxiosPromise<SystemReserveSummaryVO> => {
  return request({
    url: '/biz/systemReserveSummary/' + summaryId,
    method: 'get'
  });
};

/**
 * 新增系统储备金汇总
 * @param data
 */
export const addSystemReserveSummary = (data: SystemReserveSummaryForm) => {
  return request({
    url: '/biz/systemReserveSummary',
    method: 'post',
    data: data
  });
};

/**
 * 修改系统储备金汇总
 * @param data
 */
export const updateSystemReserveSummary = (data: SystemReserveSummaryForm) => {
  return request({
    url: '/biz/systemReserveSummary',
    method: 'put',
    data: data
  });
};

/**
 * 删除系统储备金汇总
 * @param summaryId
 */
export const delSystemReserveSummary = (summaryId: string | number | Array<string | number>) => {
  return request({
    url: '/biz/systemReserveSummary/' + summaryId,
    method: 'delete'
  });
};
