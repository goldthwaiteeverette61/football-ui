import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { SportsVO, SportsForm, SportsQuery } from '@/api/biz/sports/types';

/**
 * 查询体育项目列表
 * @param query
 * @returns {*}
 */

export const listSports = (query?: SportsQuery): AxiosPromise<SportsVO[]> => {
  return request({
    url: '/biz/sports/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询体育项目详细
 * @param id
 */
export const getSports = (id: string | number): AxiosPromise<SportsVO> => {
  return request({
    url: '/biz/sports/' + id,
    method: 'get'
  });
};

/**
 * 新增体育项目
 * @param data
 */
export const addSports = (data: SportsForm) => {
  return request({
    url: '/biz/sports',
    method: 'post',
    data: data
  });
};

/**
 * 修改体育项目
 * @param data
 */
export const updateSports = (data: SportsForm) => {
  return request({
    url: '/biz/sports',
    method: 'put',
    data: data
  });
};

/**
 * 删除体育项目
 * @param id
 */
export const delSports = (id: string | number | Array<string | number>) => {
  return request({
    url: '/biz/sports/' + id,
    method: 'delete'
  });
};
