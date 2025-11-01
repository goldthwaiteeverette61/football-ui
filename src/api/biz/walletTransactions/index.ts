import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { WalletTransactionsVO, WalletTransactionsForm, WalletTransactionsQuery } from '@/api/biz/walletTransactions/types';

/**
 * 查询钱包交易记录列表
 * @param query
 * @returns {*}
 */

export const listWalletTransactions = (query?: WalletTransactionsQuery): AxiosPromise<WalletTransactionsVO[]> => {
  return request({
    url: '/biz/walletTransactions/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询钱包交易记录详细
 * @param transactionId
 */
export const getWalletTransactions = (transactionId: string | number): AxiosPromise<WalletTransactionsVO> => {
  return request({
    url: '/biz/walletTransactions/' + transactionId,
    method: 'get'
  });
};

/**
 * 新增钱包交易记录
 * @param data
 */
export const addWalletTransactions = (data: WalletTransactionsForm) => {
  return request({
    url: '/biz/walletTransactions',
    method: 'post',
    data: data
  });
};

/**
 * 修改钱包交易记录
 * @param data
 */
export const updateWalletTransactions = (data: WalletTransactionsForm) => {
  return request({
    url: '/biz/walletTransactions',
    method: 'put',
    data: data
  });
};

/**
 * 删除钱包交易记录
 * @param transactionId
 */
export const delWalletTransactions = (transactionId: string | number | Array<string | number>) => {
  return request({
    url: '/biz/walletTransactions/' + transactionId,
    method: 'delete'
  });
};
