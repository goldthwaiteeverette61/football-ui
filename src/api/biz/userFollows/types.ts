export interface UserFollowsVO {
  /**
   * 跟投ID, 主键
   */
  followId: string | number;

  /**
   * 跟投用户ID (关联 biz_users)
   */
  userId: string | number;

  /**
   * 跟投的期数ID (关联 biz_scheme_periods)
   */
  periodId: string | number;

    /**
   * 跟投的期数名称
   */
  periodName: string ;

  /**
   * 跟投金额 (根据期数固定)
   */
  betAmount: number;

  /**
   * 跟投状态: bought-已买, failed-买入失败, settled-已结算
   */
  status: string;

  /**
   * 派奖金额 (中奖后更新)
   */
  payoutAmount: number;

  /**
   * 跟投时间
   */
  createdAt: string;

   /**
   * 更新时间
   */
  updateTime: string;

}

export interface UserFollowsForm extends BaseEntity {
  /**
   * 跟投ID, 主键
   */
  followId?: string | number;

  /**
   * 跟投用户ID (关联 biz_users)
   */
  userId?: string | number;

  /**
   * 跟投的期数ID (关联 biz_scheme_periods)
   */
  periodId?: string | number;

  /**
   * 跟投金额 (根据期数固定)
   */
  betAmount?: number;

  /**
   * 跟投状态: bought-已买, failed-买入失败, settled-已结算
   */
  status?: string;

  /**
   * 派奖金额 (中奖后更新)
   */
  payoutAmount?: number;

  /**
   * 跟投时间
   */
  createdAt?: string;

}

export interface UserFollowsQuery extends PageQuery {

  /**
   * 跟投用户ID (关联 biz_users)
   */
  userId?: string | number;

  /**
   * 跟投的期数ID (关联 biz_scheme_periods)
   */
  periodId?: string | number;

  /**
   * 跟投金额 (根据期数固定)
   */
  betAmount?: number;

  /**
   * 跟投状态: bought-已买, failed-买入失败, settled-已结算
   */
  status?: string;

  /**
   * 派奖金额 (中奖后更新)
   */
  payoutAmount?: number;

  /**
   * 跟投时间
   */
  createdAt?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}


// 【核心新增】为批量失败操作定义一个新的数据类型
export interface BatchFailBo {
  followIds: Array<string | number>;
  remark: string;
}

