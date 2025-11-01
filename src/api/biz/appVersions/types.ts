export interface AppVersionsVO {
  /**
   * 主键ID
   */
  id: string | number;

  /**
   * ossId
   */
  ossId: string | number;

  /**
   * 平台 (android 或 ios)
   */
  platform: string;

  /**
   * 构建号
   */
  buildNumber: number;

  /**
   * APK文件大小 (单位: 字节)
   */
  fileSize: number;

  /**
   * APK下载地址
   */
  downloadUrl: string;

  /**
   * 文件校验和 (推荐使用SHA-256)
   */
  checksum: string;

  /**
   * 版本更新日志
   */
  releaseNotes: string;

  /**
   * 最低支持的客户端版本
   */
  minSupportedVersion: string;

  /**
   * 是否强制更新 (0: 否, 1: 是)
   */
  forceUpdate: number;

  /**
   * 强制更新的最后期限
   */
  updateDeadline: string;

  /**
   * 该版本是否为活跃版本，可供检查 (0: 否, 1: 是)
   */
  isActive: number;

  /**
   * 创建时间
   */
  createdAt: string;

  /**
   * 更新时间
   */
  updatedAt: string;

}

export interface AppVersionsForm extends BaseEntity {
  /**
   * 主键ID
   */
  id?: string | number;

  /**
   * ossId
   */
  ossId?: string | number;

  /**
   * 平台 (android 或 ios)
   */
  platform?: string;

  /**
   * 构建号
   */
  buildNumber?: number;

  /**
   * APK文件大小 (单位: 字节)
   */
  fileSize?: number;

  /**
   * APK下载地址
   */
  downloadUrl?: string;

  /**
   * 文件校验和 (推荐使用SHA-256)
   */
  checksum?: string;

  /**
   * 版本更新日志
   */
  releaseNotes?: string;

  /**
   * 最低支持的客户端版本
   */
  minSupportedVersion?: string;

  /**
   * 是否强制更新 (0: 否, 1: 是)
   */
  forceUpdate?: number;

  /**
   * 强制更新的最后期限
   */
  updateDeadline?: string;

  /**
   * 该版本是否为活跃版本，可供检查 (0: 否, 1: 是)
   */
  isActive?: number;

  /**
   * 创建时间
   */
  createdAt?: string;

  /**
   * 更新时间
   */
  updatedAt?: string;

}

export interface AppVersionsQuery extends PageQuery {

  /**
   * ossId
   */
  ossId?: string | number;

  /**
   * 平台 (android 或 ios)
   */
  platform?: string;

  /**
   * 构建号
   */
  buildNumber?: number;

  /**
   * APK文件大小 (单位: 字节)
   */
  fileSize?: number;

  /**
   * APK下载地址
   */
  downloadUrl?: string;

  /**
   * 文件校验和 (推荐使用SHA-256)
   */
  checksum?: string;

  /**
   * 版本更新日志
   */
  releaseNotes?: string;

  /**
   * 最低支持的客户端版本
   */
  minSupportedVersion?: string;

  /**
   * 是否强制更新 (0: 否, 1: 是)
   */
  forceUpdate?: number;

  /**
   * 强制更新的最后期限
   */
  updateDeadline?: string;

  /**
   * 该版本是否为活跃版本，可供检查 (0: 否, 1: 是)
   */
  isActive?: number;

  /**
   * 创建时间
   */
  createdAt?: string;

  /**
   * 更新时间
   */
  updatedAt?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



