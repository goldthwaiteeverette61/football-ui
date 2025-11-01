import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { BetOrdersVO, BetOrdersForm, BetOrdersQuery } from '@/api/biz/betOrders/types';
import { BetOrderDetailsVO, BetOrderDetailsQuery } from '@/api/biz/betOrderDetails/types';
/**
 * 查询使用者投注訂單列表
 * @param query
 * @returns {*}
 */

export const listBetOrders = (query?: BetOrdersQuery): AxiosPromise<BetOrdersVO[]> => {
  return request({
    url: '/biz/betOrders/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询使用者投注訂單详细
 * @param orderId
 */
export const getBetOrders = (orderId: string | number): AxiosPromise<BetOrdersVO> => {
  return request({
    url: '/biz/betOrders/' + orderId,
    method: 'get'
  });
};

/**
 * 新增使用者投注訂單
 * @param data
 */
export const addBetOrders = (data: BetOrdersForm) => {
  return request({
    url: '/biz/betOrders',
    method: 'post',
    data: data
  });
};

/**
 * 修改使用者投注訂單
 * @param data
 */
export const updateBetOrders = (data: BetOrdersForm) => {
  return request({
    url: '/biz/betOrders',
    method: 'put',
    data: data
  });
};

/**
 * 删除使用者投注訂單
 * @param orderId
 */
export const delBetOrders = (orderId: string | number | Array<string | number>) => {
  return request({
    url: '/biz/betOrders/' + orderId,
    method: 'delete'
  });
};
