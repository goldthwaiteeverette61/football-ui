import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { TeamsVO, TeamsForm, TeamsQuery } from '@/api/biz/teams/types';

/**
 * 查询球队信息列表
 * @param query
 * @returns {*}
 */

export const listTeams = (query?: TeamsQuery): AxiosPromise<TeamsVO[]> => {
  return request({
    url: '/biz/teams/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询球队信息详细
 * @param teamId
 */
export const getTeams = (teamId: string | number): AxiosPromise<TeamsVO> => {
  return request({
    url: '/biz/teams/' + teamId,
    method: 'get'
  });
};

/**
 * 新增球队信息
 * @param data
 */
export const addTeams = (data: TeamsForm) => {
  return request({
    url: '/biz/teams',
    method: 'post',
    data: data
  });
};

/**
 * 修改球队信息
 * @param data
 */
export const updateTeams = (data: TeamsForm) => {
  return request({
    url: '/biz/teams',
    method: 'put',
    data: data
  });
};

/**
 * 删除球队信息
 * @param teamId
 */
export const delTeams = (teamId: string | number | Array<string | number>) => {
  return request({
    url: '/biz/teams/' + teamId,
    method: 'delete'
  });
};
