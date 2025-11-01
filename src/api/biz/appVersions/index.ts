import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { AppVersionsVO, AppVersionsForm, AppVersionsQuery } from '@/api/biz/appVersions/types';

/**
 * 查询应用版本信息列表
 * @param query
 * @returns {*}
 */

export const listAppVersions = (query?: AppVersionsQuery): AxiosPromise<AppVersionsVO[]> => {
  return request({
    url: '/biz/appVersions/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询应用版本信息详细
 * @param id
 */
export const getAppVersions = (id: string | number): AxiosPromise<AppVersionsVO> => {
  return request({
    url: '/biz/appVersions/' + id,
    method: 'get'
  });
};

/**
 * 新增应用版本信息
 * @param data
 */
export const addAppVersions = (data: AppVersionsForm) => {
  return request({
    url: '/biz/appVersions',
    method: 'post',
    data: data
  });
};

/**
 * 修改应用版本信息
 * @param data
 */
export const updateAppVersions = (data: AppVersionsForm) => {
  return request({
    url: '/biz/appVersions',
    method: 'put',
    data: data
  });
};

/**
 * 删除应用版本信息
 * @param id
 */
export const delAppVersions = (id: string | number | Array<string | number>) => {
  return request({
    url: '/biz/appVersions/' + id,
    method: 'delete'
  });
};
