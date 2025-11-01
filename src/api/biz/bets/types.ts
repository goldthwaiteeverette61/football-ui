export interface BetsVO {
  /**
   * 注单ID, 主键
   */
  betId: string | number;

  /**
   * 用户ID (需要关联你的用户表)
   */
  userId: string | number;

  /**
   * 投注的赔率项ID (关联 biz_odds.id)
   */
  oddsId: string | number;

  /**
   * 投注金额
   */
  betAmount: number;

  /**
   * 注单状态
   */
  status: string;

  /**
   * 创建时间
   */
  createdAt: string;

  /**
   * 结算时间
   */
  settledAt: string;

}

export interface BetsForm extends BaseEntity {
  /**
   * 注单ID, 主键
   */
  betId?: string | number;

  /**
   * 用户ID (需要关联你的用户表)
   */
  userId?: string | number;

  /**
   * 投注的赔率项ID (关联 biz_odds.id)
   */
  oddsId?: string | number;

  /**
   * 投注金额
   */
  betAmount?: number;

  /**
   * 注单状态
   */
  status?: string;

  /**
   * 创建时间
   */
  createdAt?: string;

  /**
   * 结算时间
   */
  settledAt?: string;

}

export interface BetsQuery extends PageQuery {

  /**
   * 用户ID (需要关联你的用户表)
   */
  userId?: string | number;

  /**
   * 投注的赔率项ID (关联 biz_odds.id)
   */
  oddsId?: string | number;

  /**
   * 投注金额
   */
  betAmount?: number;

  /**
   * 注单状态
   */
  status?: string;

  /**
   * 创建时间
   */
  createdAt?: string;

  /**
   * 结算时间
   */
  settledAt?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



