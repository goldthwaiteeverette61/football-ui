export interface TransactionsVO {
  /**
   * 流水ID，主键
   */
  id: string | number;

  /**
   * 关联的用户ID
   */
  userId: string | number;

  /**
   * 用户名称
   */
  userName: string;

  /**
   * 交易金额 (正数表示收入, 负数表示支出)
   */
  amount: number;

  /**
   * 币种代码, 例如: USDT, BTC, TRX
   */
  currency: string;

  /**
   * 交易类型 (BONUS:奖金,RECHARGE:充值, WITHDRAWAL:提现, INTERNAL_TRANSFER_IN:站内转入, INTERNAL_TRANSFER_OUT:站内转出, FEE:手续费, ADJUSTMENT:系统调账)
   */
  transactionType: string;

  /**
   * 交易状态 (PENDING:处理中, CONFIRMED:已确认/成功, FAILED:失败, CANCELLED:已取消,REFUND:退款)
   */
  status: string;

  /**
   * 关联ID (用于将站内转账的收支两条记录关联起来)
   */
  referenceId: string | number;

  /**
   * 备注信息 (例如: 失败原因, 系统调账说明等)
   */
  remarks: string;

  /**
   * 区块链网络 (例如: TRON, ETHEREUM_ERC20, BSC)
   */
  blockchainNetwork: string;

  /**
   * 区块链交易哈希 (TxID)
   */
  transactionHash: string;

  /**
   * 链上付款方地址
   */
  fromAddress: string;

  /**
   * 链上收款方地址
   */
  toAddress: string;

  /**
   * 创建时间
   */
  createdAt: string;

  /**
   * 最后更新时间
   */
  updatedAt: string;

  /**
   * 源id
   */
  sourceId: string | number;

}

export interface TransactionsForm extends BaseEntity {
  /**
   * 流水ID，主键
   */
  id?: string | number;

  /**
   * 关联的用户ID
   */
  userId?: string | number;

  /**
   * 用户名称
   */
  userName?: string;

  /**
   * 交易金额 (正数表示收入, 负数表示支出)
   */
  amount?: number;

  /**
   * 币种代码, 例如: USDT, BTC, TRX
   */
  currency?: string;

  /**
   * 交易类型 (BONUS:奖金,RECHARGE:充值, WITHDRAWAL:提现, INTERNAL_TRANSFER_IN:站内转入, INTERNAL_TRANSFER_OUT:站内转出, FEE:手续费, ADJUSTMENT:系统调账)
   */
  transactionType?: string;

  /**
   * 交易状态 (PENDING:处理中, CONFIRMED:已确认/成功, FAILED:失败, CANCELLED:已取消,REFUND:退款)
   */
  status?: string;

  /**
   * 关联ID (用于将站内转账的收支两条记录关联起来)
   */
  referenceId?: string | number;

  /**
   * 备注信息 (例如: 失败原因, 系统调账说明等)
   */
  remarks?: string;

  /**
   * 区块链网络 (例如: TRON, ETHEREUM_ERC20, BSC)
   */
  blockchainNetwork?: string;

  /**
   * 区块链交易哈希 (TxID)
   */
  transactionHash?: string;

  /**
   * 链上付款方地址
   */
  fromAddress?: string;

  /**
   * 链上收款方地址
   */
  toAddress?: string;

  /**
   * 创建时间
   */
  createdAt?: string;

  /**
   * 最后更新时间
   */
  updatedAt?: string;

  /**
   * 源id
   */
  sourceId?: string | number;

}

export interface TransactionsQuery extends PageQuery {

  /**
   * 关联的用户ID
   */
  userId?: string | number;

  /**
   * 用户名称
   */
  userName?: string;

  /**
   * 交易金额 (正数表示收入, 负数表示支出)
   */
  amount?: number;

  /**
   * 币种代码, 例如: USDT, BTC, TRX
   */
  currency?: string;

  /**
   * 交易类型 (BONUS:奖金,RECHARGE:充值, WITHDRAWAL:提现, INTERNAL_TRANSFER_IN:站内转入, INTERNAL_TRANSFER_OUT:站内转出, FEE:手续费, ADJUSTMENT:系统调账)
   */
  transactionType?: string;

  /**
   * 交易状态 (PENDING:处理中, CONFIRMED:已确认/成功, FAILED:失败, CANCELLED:已取消,REFUND:退款)
   */
  status?: string;

  /**
   * 关联ID (用于将站内转账的收支两条记录关联起来)
   */
  referenceId?: string | number;

  /**
   * 备注信息 (例如: 失败原因, 系统调账说明等)
   */
  remarks?: string;

  /**
   * 区块链网络 (例如: TRON, ETHEREUM_ERC20, BSC)
   */
  blockchainNetwork?: string;

  /**
   * 区块链交易哈希 (TxID)
   */
  transactionHash?: string;

  /**
   * 链上付款方地址
   */
  fromAddress?: string;

  /**
   * 链上收款方地址
   */
  toAddress?: string;

  /**
   * 创建时间
   */
  createdAt?: string;

  /**
   * 最后更新时间
   */
  updatedAt?: string;

  /**
   * 源id
   */
  sourceId?: string | number;

    /**
     * 日期范围参数
     */
    params?: any;
}



