export interface SystemReserveVO {
  /**
   * 储备金记录ID
   */
  reserveId: string | number;

  /**
   * 来源类型 (例如: scheme_payout_commission)
   */
  sourceType: string;

  /**
   * 来源ID (例如: biz_user_follows表的follow_id)
   */
  sourceId: string | number;

  /**
   * 关联的用户ID
   */
  userId: string | number;

  /**
   * 本次存入的储备金金额 (佣金)
   */
  amount: number;

  /**
   * 当时的佣金率 (例如: 0.1000)
   */
  commissionRate: number;

  /**
   * 用户原始应得奖金 (扣除佣金前)
   */
  originalPayout: number;

  /**
   * 备注
   */
  remark: string;

}

export interface SystemReserveForm extends BaseEntity {
  /**
   * 储备金记录ID
   */
  reserveId?: string | number;

  /**
   * 来源类型 (例如: scheme_payout_commission)
   */
  sourceType?: string;

  /**
   * 来源ID (例如: biz_user_follows表的follow_id)
   */
  sourceId?: string | number;

  /**
   * 关联的用户ID
   */
  userId?: string | number;

  /**
   * 本次存入的储备金金额 (佣金)
   */
  amount?: number;

  /**
   * 当时的佣金率 (例如: 0.1000)
   */
  commissionRate?: number;

  /**
   * 用户原始应得奖金 (扣除佣金前)
   */
  originalPayout?: number;

  /**
   * 备注
   */
  remark?: string;

}

export interface SystemReserveQuery extends PageQuery {

  /**
   * 来源类型 (例如: scheme_payout_commission)
   */
  sourceType?: string;

  /**
   * 来源ID (例如: biz_user_follows表的follow_id)
   */
  sourceId?: string | number;

  /**
   * 关联的用户ID
   */
  userId?: string | number;

  /**
   * 本次存入的储备金金额 (佣金)
   */
  amount?: number;

  /**
   * 当时的佣金率 (例如: 0.1000)
   */
  commissionRate?: number;

  /**
   * 用户原始应得奖金 (扣除佣金前)
   */
  originalPayout?: number;

    /**
     * 日期范围参数
     */
    params?: any;
}



