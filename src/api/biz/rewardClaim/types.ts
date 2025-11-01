export interface RewardClaimVO {
  /**
   * 主键
   */
  id: string | number;

  /**
   * 申请用户ID
   */
  userId: string | number;
 /**
   * 申请用户ID
   */
  userName: string | number;
  /**
   * 申请金额
   */
  amount: number;

  /**
   * 货币类型
   */
  currency: string;

  /**
   * 状态 (PENDING, APPROVED, REJECTED)
   */
  status: string;

  /**
   * 备注
   */
  remarks: string;

}

export interface RewardClaimForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 申请用户ID
   */
  userId?: string | number;

  /**
   * 申请金额
   */
  amount?: number;

  /**
   * 货币类型
   */
  currency?: string;

  /**
   * 状态 (PENDING, APPROVED, REJECTED)
   */
  status?: string;

  /**
   * 备注
   */
  remarks?: string;

}

export interface RewardClaimQuery extends PageQuery {

  /**
   * 申请用户ID
   */
  userId?: string | number;

  /**
   * 申请金额
   */
  amount?: number;

  /**
   * 货币类型
   */
  currency?: string;

  /**
   * 状态 (PENDING, APPROVED, REJECTED)
   */
  status?: string;

  /**
   * 备注
   */
  remarks?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



