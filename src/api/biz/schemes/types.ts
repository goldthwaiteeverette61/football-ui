export interface SchemesVO {
  /**
   * 方案ID, 主键
   */
  schemeId: string | number;

  /**
   * 方案发起人ID (关联 biz_users)
   */
  userId: string | number;

  /**
   * 方案标题 (例如: 张三的第5轮方案)
   */
  title: string;

  /**
   * 方案状态: ongoing-进行中, ended-已结束
   */
  status: string;

  /**
   * 当前进行到第几期
   */
  currentPeriodNumber: number;

  /**
   * 连续失败期数
   */
  consecutiveLosses: number;

  /**
   * 方案结束原因 (例如: won, max_loss_reached)
   */
  reasonForEnding: string;

  /**
   * 创建时间
   */
  createdAt: string;

  /**
   * 更新时间
   */
  updatedAt: string;

}

export interface SchemesForm extends BaseEntity {
  /**
   * 方案ID, 主键
   */
  schemeId?: string | number;

  /**
   * 方案发起人ID (关联 biz_users)
   */
  userId?: string | number;

  /**
   * 方案标题 (例如: 张三的第5轮方案)
   */
  title?: string;

  /**
   * 方案状态: ongoing-进行中, ended-已结束
   */
  status?: string;

  /**
   * 当前进行到第几期
   */
  currentPeriodNumber?: number;

  /**
   * 连续失败期数
   */
  consecutiveLosses?: number;

  /**
   * 方案结束原因 (例如: won, max_loss_reached)
   */
  reasonForEnding?: string;

  /**
   * 创建时间
   */
  createdAt?: string;

  /**
   * 更新时间
   */
  updatedAt?: string;

}

export interface SchemesQuery extends PageQuery {

  /**
   * 方案发起人ID (关联 biz_users)
   */
  userId?: string | number;

  /**
   * 方案标题 (例如: 张三的第5轮方案)
   */
  title?: string;

  /**
   * 方案状态: ongoing-进行中, ended-已结束
   */
  status?: string;

  /**
   * 当前进行到第几期
   */
  currentPeriodNumber?: number;

  /**
   * 连续失败期数
   */
  consecutiveLosses?: number;

  /**
   * 方案结束原因 (例如: won, max_loss_reached)
   */
  reasonForEnding?: string;

  /**
   * 创建时间
   */
  createdAt?: string;

  /**
   * 更新时间
   */
  updatedAt?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



