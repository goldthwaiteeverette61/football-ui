export interface UserProgressVO {
  /**
   * 进度记录的唯一ID, 主键
   */
  progressId: string | number;

  /**
   * 关联的用户ID (sys_user.user_id)
   */
  userId: string | number;

  /**
   * 当前的连续失败次数，默认为 0
   */
  consecutiveLosses: number;

}

export interface UserProgressForm extends BaseEntity {
  /**
   * 进度记录的唯一ID, 主键
   */
  progressId?: string | number;

  /**
   * 关联的用户ID (sys_user.user_id)
   */
  userId?: string | number;

  /**
   * 当前的连续失败次数，默认为 0
   */
  consecutiveLosses?: number;

}

export interface UserProgressQuery extends PageQuery {

  /**
   * 关联的用户ID (sys_user.user_id)
   */
  userId?: string | number;

  /**
   * 当前的连续失败次数，默认为 0
   */
  consecutiveLosses?: number;

    /**
     * 日期范围参数
     */
    params?: any;
}



