import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { DeviceUpdatesVO, DeviceUpdatesForm, DeviceUpdatesQuery } from '@/api/biz/deviceUpdates/types';

/**
 * 查询设备更新记录列表
 * @param query
 * @returns {*}
 */

export const listDeviceUpdates = (query?: DeviceUpdatesQuery): AxiosPromise<DeviceUpdatesVO[]> => {
  return request({
    url: '/biz/deviceUpdates/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询设备更新记录详细
 * @param id
 */
export const getDeviceUpdates = (id: string | number): AxiosPromise<DeviceUpdatesVO> => {
  return request({
    url: '/biz/deviceUpdates/' + id,
    method: 'get'
  });
};

/**
 * 新增设备更新记录
 * @param data
 */
export const addDeviceUpdates = (data: DeviceUpdatesForm) => {
  return request({
    url: '/biz/deviceUpdates',
    method: 'post',
    data: data
  });
};

/**
 * 修改设备更新记录
 * @param data
 */
export const updateDeviceUpdates = (data: DeviceUpdatesForm) => {
  return request({
    url: '/biz/deviceUpdates',
    method: 'put',
    data: data
  });
};

/**
 * 删除设备更新记录
 * @param id
 */
export const delDeviceUpdates = (id: string | number | Array<string | number>) => {
  return request({
    url: '/biz/deviceUpdates/' + id,
    method: 'delete'
  });
};
