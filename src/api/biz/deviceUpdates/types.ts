export interface DeviceUpdatesVO {
  /**
   * 主键ID
   */
  id: string | number;

  /**
   * 设备唯一标识符
   */
  deviceId: string | number;

  /**
   * 平台
   */
  platform: string;

  /**
   * 升级前的版本号
   */
  fromVersion: string;

  /**
   * 目标升级版本号
   */
  toVersion: string;

  /**
   * 更新类型
   */
  updateType: string;

  /**
   * 下载开始时间
   */
  downloadStartedAt: string;

  /**
   * 下载完成时间
   */
  downloadCompletedAt: string;

  /**
   * 安装开始时间
   */
  installStartedAt: string;

  /**
   * 安装完成时间
   */
  installCompletedAt: string;

  /**
   * 升级状态
   */
  status: string;

  /**
   * 失败时的错误信息
   */
  errorMessage: string;

  /**
   * 记录创建时间
   */
  createdAt: string;

}

export interface DeviceUpdatesForm extends BaseEntity {
  /**
   * 主键ID
   */
  id?: string | number;

  /**
   * 设备唯一标识符
   */
  deviceId?: string | number;

  /**
   * 平台
   */
  platform?: string;

  /**
   * 升级前的版本号
   */
  fromVersion?: string;

  /**
   * 目标升级版本号
   */
  toVersion?: string;

  /**
   * 更新类型
   */
  updateType?: string;

  /**
   * 下载开始时间
   */
  downloadStartedAt?: string;

  /**
   * 下载完成时间
   */
  downloadCompletedAt?: string;

  /**
   * 安装开始时间
   */
  installStartedAt?: string;

  /**
   * 安装完成时间
   */
  installCompletedAt?: string;

  /**
   * 升级状态
   */
  status?: string;

  /**
   * 失败时的错误信息
   */
  errorMessage?: string;

  /**
   * 记录创建时间
   */
  createdAt?: string;

}

export interface DeviceUpdatesQuery extends PageQuery {

  /**
   * 设备唯一标识符
   */
  deviceId?: string | number;

  /**
   * 平台
   */
  platform?: string;

  /**
   * 升级前的版本号
   */
  fromVersion?: string;

  /**
   * 目标升级版本号
   */
  toVersion?: string;

  /**
   * 更新类型
   */
  updateType?: string;

  /**
   * 下载开始时间
   */
  downloadStartedAt?: string;

  /**
   * 下载完成时间
   */
  downloadCompletedAt?: string;

  /**
   * 安装开始时间
   */
  installStartedAt?: string;

  /**
   * 安装完成时间
   */
  installCompletedAt?: string;

  /**
   * 升级状态
   */
  status?: string;

  /**
   * 失败时的错误信息
   */
  errorMessage?: string;

  /**
   * 记录创建时间
   */
  createdAt?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



