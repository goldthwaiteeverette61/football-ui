import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { UserWalletsVO, UserWalletsForm, UserWalletsQuery } from '@/api/biz/userWallets/types';

/**
 * 查询用户钱包地址列表
 * @param query
 * @returns {*}
 */

export const listUserWallets = (query?: UserWalletsQuery): AxiosPromise<UserWalletsVO[]> => {
  return request({
    url: '/biz/userWallets/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询用户钱包地址详细
 * @param walletId
 */
export const getUserWallets = (walletId: string | number): AxiosPromise<UserWalletsVO> => {
  return request({
    url: '/biz/userWallets/' + walletId,
    method: 'get'
  });
};

/**
 * 新增用户钱包地址
 * @param data
 */
export const addUserWallets = (data: UserWalletsForm) => {
  return request({
    url: '/biz/userWallets',
    method: 'post',
    data: data
  });
};

/**
 * 修改用户钱包地址
 * @param data
 */
export const updateUserWallets = (data: UserWalletsForm) => {
  return request({
    url: '/biz/userWallets',
    method: 'put',
    data: data
  });
};

/**
 * 删除用户钱包地址
 * @param walletId
 */
export const delUserWallets = (walletId: string | number | Array<string | number>) => {
  return request({
    url: '/biz/userWallets/' + walletId,
    method: 'delete'
  });
};
