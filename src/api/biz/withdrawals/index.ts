import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { WithdrawalsVO, WithdrawalsForm, WithdrawalsQuery, WithdrawalAuditForm } from '@/api/biz/withdrawals/types';

/**
 * 核心修改：新增审核接口调用
 * @param data
 */
export const auditWithdrawal = (data: WithdrawalAuditForm) => {
  return request({
    url: '/biz/withdrawals/audit',
    method: 'post',
    data: data
  });
};

/**
 * 查询用户提现申请列表
 * @param query
 */
export const listWithdrawals = (query?: WithdrawalsQuery): AxiosPromise<WithdrawalsVO[]> => {
  return request({
    url: '/biz/withdrawals/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询用户提现申请详细
 * @param withdrawalId
 */
export const getWithdrawals = (withdrawalId: string | number): AxiosPromise<WithdrawalsVO> => {
  return request({
    url: '/biz/withdrawals/' + withdrawalId,
    method: 'get'
  });
};

/**
 * 新增用户提现申请
 * @param data
 */
export const addWithdrawals = (data: WithdrawalsForm) => {
  return request({
    url: '/biz/withdrawals',
    method: 'post',
    data: data
  });
};

/**
 * 修改用户提现申请
 * @param data
 */
export const updateWithdrawals = (data: WithdrawalsForm) => {
  return request({
    url: '/biz/withdrawals',
    method: 'put',
    data: data
  });
};

/**
 * 删除用户提现申请
 * @param withdrawalId
 */
export const delWithdrawals = (withdrawalId: string | number | Array<string | number>) => {
  return request({
    url: '/biz/withdrawals/' + withdrawalId,
    method: 'delete'
  });
};