import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { DepositWalletsVO, DepositWalletsForm, DepositWalletsQuery } from '@/api/biz/depositWallets/types';

/**
 * 查询平台充值钱包列表
 * @param query
 * @returns {*}
 */

export const listDepositWallets = (query?: DepositWalletsQuery): AxiosPromise<DepositWalletsVO[]> => {
  return request({
    url: '/biz/depositWallets/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询平台充值钱包详细
 * @param walletId
 */
export const getDepositWallets = (walletId: string | number): AxiosPromise<DepositWalletsVO> => {
  return request({
    url: '/biz/depositWallets/' + walletId,
    method: 'get'
  });
};

/**
 * 新增平台充值钱包
 * @param data
 */
export const addDepositWallets = (data: DepositWalletsForm) => {
  return request({
    url: '/biz/depositWallets',
    method: 'post',
    data: data
  });
};

/**
 * 修改平台充值钱包
 * @param data
 */
export const updateDepositWallets = (data: DepositWalletsForm) => {
  return request({
    url: '/biz/depositWallets',
    method: 'put',
    data: data
  });
};

/**
 * 删除平台充值钱包
 * @param walletId
 */
export const delDepositWallets = (walletId: string | number | Array<string | number>) => {
  return request({
    url: '/biz/depositWallets/' + walletId,
    method: 'delete'
  });
};
