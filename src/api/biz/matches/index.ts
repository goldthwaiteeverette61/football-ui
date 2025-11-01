import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { MatchesVO, MatchesForm, MatchesQuery } from '@/api/biz/matches/types';

/**
 * 查询比赛信息列表
 * @param query
 * @returns {*}
 */

export const listMatches = (query?: MatchesQuery): AxiosPromise<MatchesVO[]> => {
  return request({
    url: '/biz/matches/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询比赛信息详细
 * @param matchId
 */
export const getMatches = (matchId: string | number): AxiosPromise<MatchesVO> => {
  return request({
    url: '/biz/matches/' + matchId,
    method: 'get'
  });
};

/**
 * 新增比赛信息
 * @param data
 */
export const addMatches = (data: MatchesForm) => {
  return request({
    url: '/biz/matches',
    method: 'post',
    data: data
  });
};

/**
 * 修改比赛信息
 * @param data
 */
export const updateMatches = (data: MatchesForm) => {
  return request({
    url: '/biz/matches',
    method: 'put',
    data: data
  });
};

/**
 * 删除比赛信息
 * @param matchId
 */
export const delMatches = (matchId: string | number | Array<string | number>) => {
  return request({
    url: '/biz/matches/' + matchId,
    method: 'delete'
  });
};
