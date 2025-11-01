export interface DepositWalletsVO {
  /**
   * 充值钱包ID, 主键
   */
  walletId: string | number;

  /**
   * 钱包名称
   */
  walletName: string;

  /**
   * 钱包地址
   */
  walletAddress: string;

  /**
   * 状态 (active, inactive)
   */
  status: string;

  /**
   * 二维码图片URL
   */
  qrCodeUrl: string;

}

export interface DepositWalletsForm extends BaseEntity {
  /**
   * 充值钱包ID, 主键
   */
  walletId?: string | number;

  /**
   * 钱包名称
   */
  walletName?: string;

  /**
   * 钱包地址
   */
  walletAddress?: string;

  /**
   * 状态 (active, inactive)
   */
  status?: string;

  /**
   * 二维码图片URL
   */
  qrCodeUrl?: string;

}

export interface DepositWalletsQuery extends PageQuery {

  /**
   * 钱包名称
   */
  walletName?: string;

  /**
   * 钱包地址
   */
  walletAddress?: string;

  /**
   * 状态 (active, inactive)
   */
  status?: string;

  /**
   * 二维码图片URL
   */
  qrCodeUrl?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



