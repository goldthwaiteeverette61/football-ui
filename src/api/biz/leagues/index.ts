import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { LeaguesVO, LeaguesForm, LeaguesQuery } from '@/api/biz/leagues/types';

/**
 * 查询联赛信息列表
 * @param query
 * @returns {*}
 */

export const listLeagues = (query?: LeaguesQuery): AxiosPromise<LeaguesVO[]> => {
  return request({
    url: '/biz/leagues/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询联赛信息详细
 * @param leagueId
 */
export const getLeagues = (leagueId: string | number): AxiosPromise<LeaguesVO> => {
  return request({
    url: '/biz/leagues/' + leagueId,
    method: 'get'
  });
};

/**
 * 新增联赛信息
 * @param data
 */
export const addLeagues = (data: LeaguesForm) => {
  return request({
    url: '/biz/leagues',
    method: 'post',
    data: data
  });
};

/**
 * 修改联赛信息
 * @param data
 */
export const updateLeagues = (data: LeaguesForm) => {
  return request({
    url: '/biz/leagues',
    method: 'put',
    data: data
  });
};

/**
 * 删除联赛信息
 * @param leagueId
 */
export const delLeagues = (leagueId: string | number | Array<string | number>) => {
  return request({
    url: '/biz/leagues/' + leagueId,
    method: 'delete'
  });
};
