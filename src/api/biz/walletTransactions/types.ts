export interface WalletTransactionsVO {
  /**
   * 记录ID, 主键
   */
  transactionId: string | number;

  /**
   * 区块链交易哈希 (txID)
   */
  txHash: string;

  /**
   * 收款用户ID (关联 sys_user.user_id)
   */
  userId: string | number;

  /**
   * 付款方地址
   */
  fromAddress: string;

  /**
   * 收款方地址 (我们监控的地址)
   */
  toAddress: string;

  /**
   * 交易金额
   */
  amount: number;

  /**
   * 币种 (例如: TRX, USDT)
   */
  currency: string;

  /**
   * 系统处理状态: pending-待处理, confirmed-已确认入账, failed-处理失败
   */
  status: string;

  /**
   * 确认入账时间
   */
  confirmedAt: string;

  /**
   * 记录创建时间
   */
  createdAt: string;

}

export interface WalletTransactionsForm extends BaseEntity {
  /**
   * 记录ID, 主键
   */
  transactionId?: string | number;

  /**
   * 区块链交易哈希 (txID)
   */
  txHash?: string;

  /**
   * 收款用户ID (关联 sys_user.user_id)
   */
  userId?: string | number;

  /**
   * 付款方地址
   */
  fromAddress?: string;

  /**
   * 收款方地址 (我们监控的地址)
   */
  toAddress?: string;

  /**
   * 交易金额
   */
  amount?: number;

  /**
   * 币种 (例如: TRX, USDT)
   */
  currency?: string;

  /**
   * 系统处理状态: pending-待处理, confirmed-已确认入账, failed-处理失败
   */
  status?: string;

  /**
   * 确认入账时间
   */
  confirmedAt?: string;

  /**
   * 记录创建时间
   */
  createdAt?: string;

}

export interface WalletTransactionsQuery extends PageQuery {

  /**
   * 区块链交易哈希 (txID)
   */
  txHash?: string;

  /**
   * 收款用户ID (关联 sys_user.user_id)
   */
  userId?: string | number;

  /**
   * 付款方地址
   */
  fromAddress?: string;

  /**
   * 收款方地址 (我们监控的地址)
   */
  toAddress?: string;

  /**
   * 交易金额
   */
  amount?: number;

  /**
   * 币种 (例如: TRX, USDT)
   */
  currency?: string;

  /**
   * 系统处理状态: pending-待处理, confirmed-已确认入账, failed-处理失败
   */
  status?: string;

  /**
   * 确认入账时间
   */
  confirmedAt?: string;

  /**
   * 记录创建时间
   */
  createdAt?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



