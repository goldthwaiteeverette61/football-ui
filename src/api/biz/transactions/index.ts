import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { TransactionsVO, TransactionsForm, TransactionsQuery } from '@/api/biz/transactions/types';

/**
 * 查询用户资金流水列表
 * @param query
 * @returns {*}
 */

export const listTransactions = (query?: TransactionsQuery): AxiosPromise<TransactionsVO[]> => {
  return request({
    url: '/biz/transactions/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询用户资金流水详细
 * @param id
 */
export const getTransactions = (id: string | number): AxiosPromise<TransactionsVO> => {
  return request({
    url: '/biz/transactions/' + id,
    method: 'get'
  });
};

/**
 * 新增用户资金流水
 * @param data
 */
export const addTransactions = (data: TransactionsForm) => {
  return request({
    url: '/biz/transactions',
    method: 'post',
    data: data
  });
};

/**
 * 修改用户资金流水
 * @param data
 */
export const updateTransactions = (data: TransactionsForm) => {
  return request({
    url: '/biz/transactions',
    method: 'put',
    data: data
  });
};

/**
 * 删除用户资金流水
 * @param id
 */
export const delTransactions = (id: string | number | Array<string | number>) => {
  return request({
    url: '/biz/transactions/' + id,
    method: 'delete'
  });
};
