import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { BetOrderDetailsVO, BetOrderDetailsForm, BetOrderDetailsQuery, BatchUpdateOddsDto } from '@/api/biz/betOrderDetails/types';

/**
 * 查询投注订单详情列表 (分页)
 * @param query
 * @returns {*}
 */
export const listBetOrderDetails = (query?: BetOrderDetailsQuery): AxiosPromise<{ rows: BetOrderDetailsVO[], total: number }> => {
  return request({
    url: '/biz/betOrderDetails/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询投注订单详情详细
 * @param detailId
 */
export const getBetOrderDetails = (detailId: string | number): AxiosPromise<{ data: BetOrderDetailsVO }> => {
  return request({
    url: '/biz/betOrderDetails/' + detailId,
    method: 'get'
  });
};

/**
 * 新增投注订单详情
 * @param data
 */
export const addBetOrderDetails = (data: BetOrderDetailsForm) => {
  return request({
    url: '/biz/betOrderDetails',
    method: 'post',
    data: data
  });
};

/**
 * 修改投注订单详情
 * @param data
 */
export const updateBetOrderDetails = (data: BetOrderDetailsForm) => {
  return request({
    url: '/biz/betOrderDetails',
    method: 'put',
    data: data
  });
};

/**
 * 删除投注订单详情
 * @param detailId
 */
export const delBetOrderDetails = (detailId: string | number | Array<string | number>) => {
  return request({
    url: '/biz/betOrderDetails/' + detailId,
    method: 'delete'
  });
};

/**
 * 【已修正】查询投注订单详情列表 (不分页，用于后台展开)
 * @param query
 */
export const listDetails = (query?: BetOrderDetailsQuery): AxiosPromise<BetOrderDetailsVO[]> => {
  return request({
    url: '/biz/betOrderDetails/list-s',
    method: 'get',
    params: query
  });
};

/**
 * 批量更新赔率
 * @param data
 */
export const batchUpdateOdds = (data: BatchUpdateOddsDto): AxiosPromise<void> => {
  return request({
    url: '/biz/betOrders/batchUpdateOdds',
    method: 'put',
    data: data
  });
};

