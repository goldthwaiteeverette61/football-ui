export interface ReferralsVO {
  /**
   * 
   */
  id: string | number;

  /**
   * 推荐人ID
   */
  referrerUserId: string | number;

  /**
   * 被推荐人ID
   */
  referredUserId: string | number;

  /**
   * 状态(例如被推荐人完成首次存款或投注后变为completed)
   */
  status: string;

  /**
   * 是否已发放奖励
   */
  bonusAwarded: number;

  /**
   * 
   */
  createdAt: string;

}

export interface ReferralsForm extends BaseEntity {
  /**
   * 
   */
  id?: string | number;

  /**
   * 推荐人ID
   */
  referrerUserId?: string | number;

  /**
   * 被推荐人ID
   */
  referredUserId?: string | number;

  /**
   * 状态(例如被推荐人完成首次存款或投注后变为completed)
   */
  status?: string;

  /**
   * 是否已发放奖励
   */
  bonusAwarded?: number;

  /**
   * 
   */
  createdAt?: string;

}

export interface ReferralsQuery extends PageQuery {

  /**
   * 推荐人ID
   */
  referrerUserId?: string | number;

  /**
   * 被推荐人ID
   */
  referredUserId?: string | number;

  /**
   * 状态(例如被推荐人完成首次存款或投注后变为completed)
   */
  status?: string;

  /**
   * 是否已发放奖励
   */
  bonusAwarded?: number;

  /**
   * 
   */
  createdAt?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



