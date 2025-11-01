export interface UserBetsVO {
  /**
   * 
   */
  id: string | number;

  /**
   * 
   */
  userId: string | number;

  /**
   * 
   */
  matchId: string | number;

  /**
   * 
   */
  oddId: string | number;

  /**
   * 投注金额
   */
  stake: number;

  /**
   * 下注时的赔率
   */
  oddsValue: number;

  /**
   * 预计派彩金额
   */
  potentialPayout: number;

  /**
   * 注单状态
   */
  status: string;

  /**
   * 下注时间
   */
  placedAt: string;

  /**
   * 结算时间
   */
  settledAt: string;

}

export interface UserBetsForm extends BaseEntity {
  /**
   * 
   */
  id?: string | number;

  /**
   * 
   */
  userId?: string | number;

  /**
   * 
   */
  matchId?: string | number;

  /**
   * 
   */
  oddId?: string | number;

  /**
   * 投注金额
   */
  stake?: number;

  /**
   * 下注时的赔率
   */
  oddsValue?: number;

  /**
   * 预计派彩金额
   */
  potentialPayout?: number;

  /**
   * 注单状态
   */
  status?: string;

  /**
   * 下注时间
   */
  placedAt?: string;

  /**
   * 结算时间
   */
  settledAt?: string;

}

export interface UserBetsQuery extends PageQuery {

  /**
   * 
   */
  userId?: string | number;

  /**
   * 
   */
  matchId?: string | number;

  /**
   * 
   */
  oddId?: string | number;

  /**
   * 投注金额
   */
  stake?: number;

  /**
   * 下注时的赔率
   */
  oddsValue?: number;

  /**
   * 预计派彩金额
   */
  potentialPayout?: number;

  /**
   * 注单状态
   */
  status?: string;

  /**
   * 下注时间
   */
  placedAt?: string;

  /**
   * 结算时间
   */
  settledAt?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



