import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { MatchResultsVO, MatchResultsForm, MatchResultsQuery } from '@/api/biz/matchResults/types';

/**
 * 查询比赛赛果列表
 * @param query
 * @returns {*}
 */

export const listMatchResults = (query?: MatchResultsQuery): AxiosPromise<MatchResultsVO[]> => {
  return request({
    url: '/biz/matchResults/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询比赛赛果详细
 * @param id
 */
export const getMatchResults = (id: string | number): AxiosPromise<MatchResultsVO> => {
  return request({
    url: '/biz/matchResults/' + id,
    method: 'get'
  });
};

/**
 * 新增比赛赛果
 * @param data
 */
export const addMatchResults = (data: MatchResultsForm) => {
  return request({
    url: '/biz/matchResults',
    method: 'post',
    data: data
  });
};

/**
 * 修改比赛赛果
 * @param data
 */
export const updateMatchResults = (data: MatchResultsForm) => {
  return request({
    url: '/biz/matchResults',
    method: 'put',
    data: data
  });
};

/**
 * 删除比赛赛果
 * @param id
 */
export const delMatchResults = (id: string | number | Array<string | number>) => {
  return request({
    url: '/biz/matchResults/' + id,
    method: 'delete'
  });
};
