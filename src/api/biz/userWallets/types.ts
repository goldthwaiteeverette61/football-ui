export interface UserWalletsVO {
  /**
   * 钱包ID, 主键
   */
  walletId: string | number;

  /**
   * 用户ID (关联 sys_user.user_id)
   */
  userId: string | number;

  /**
   * TRON地址 (Base58格式)
   */
  address: string;

  /**
   * 加密后的私钥 (如果由系统生成)
   */
  privateKeyEncrypted: string;

  /**
   * 创建时间
   */
  createdAt: string;

}

export interface UserWalletsForm extends BaseEntity {
  /**
   * 钱包ID, 主键
   */
  walletId?: string | number;

  /**
   * 用户ID (关联 sys_user.user_id)
   */
  userId?: string | number;

  /**
   * TRON地址 (Base58格式)
   */
  address?: string;

  /**
   * 加密后的私钥 (如果由系统生成)
   */
  privateKeyEncrypted?: string;

  /**
   * 创建时间
   */
  createdAt?: string;

}

export interface UserWalletsQuery extends PageQuery {

  /**
   * 用户ID (关联 sys_user.user_id)
   */
  userId?: string | number;

  /**
   * TRON地址 (Base58格式)
   */
  address?: string;

  /**
   * 加密后的私钥 (如果由系统生成)
   */
  privateKeyEncrypted?: string;

  /**
   * 创建时间
   */
  createdAt?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



