export interface UsersVO {
  /**
   * 
   */
  id: string | number;

  /**
   * 用户名，如 @ethan.carter
   */
  username: string;

  /**
   * 邮箱
   */
  email: string;

  /**
   * 加密后的密码
   */
  passwordHash: string;

  /**
   * 全名，如 Ethan Carter
   */
  fullName: string;

  /**
   * 头像图片链接
   */
  profilePictureUrl: string;

  /**
   * 账户余额 (以USDT计价)
   */
  balance: number;

  /**
   * 用户的专属推荐码
   */
  referralCode: string;

  /**
   * 推荐该用户的用户ID
   */
  referredByUserId: string | number;

  /**
   * 
   */
  createdAt: string;

  /**
   * 
   */
  updatedAt: string;

}

export interface UsersForm extends BaseEntity {
  /**
   * 
   */
  id?: string | number;

  /**
   * 用户名，如 @ethan.carter
   */
  username?: string;

  /**
   * 邮箱
   */
  email?: string;

  /**
   * 加密后的密码
   */
  passwordHash?: string;

  /**
   * 全名，如 Ethan Carter
   */
  fullName?: string;

  /**
   * 头像图片链接
   */
  profilePictureUrl?: string;

  /**
   * 账户余额 (以USDT计价)
   */
  balance?: number;

  /**
   * 用户的专属推荐码
   */
  referralCode?: string;

  /**
   * 推荐该用户的用户ID
   */
  referredByUserId?: string | number;

  /**
   * 
   */
  createdAt?: string;

  /**
   * 
   */
  updatedAt?: string;

}

export interface UsersQuery extends PageQuery {

  /**
   * 用户名，如 @ethan.carter
   */
  username?: string;

  /**
   * 邮箱
   */
  email?: string;

  /**
   * 加密后的密码
   */
  passwordHash?: string;

  /**
   * 全名，如 Ethan Carter
   */
  fullName?: string;

  /**
   * 头像图片链接
   */
  profilePictureUrl?: string;

  /**
   * 账户余额 (以USDT计价)
   */
  balance?: number;

  /**
   * 用户的专属推荐码
   */
  referralCode?: string;

  /**
   * 推荐该用户的用户ID
   */
  referredByUserId?: string | number;

  /**
   * 
   */
  createdAt?: string;

  /**
   * 
   */
  updatedAt?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



