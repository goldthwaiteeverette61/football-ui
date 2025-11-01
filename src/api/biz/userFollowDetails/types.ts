export interface UserFollowDetailsVO {
  /**
   * 详情ID, 主键
   */
  followDetailId: string | number;

  /**
   * 所属跟投ID (关联 biz_user_follows)
   */
  followId: string | number;

  /**
   * 比赛ID (关联 biz_matches)
   */
  matchId: string | number;

  /**
   * 玩法代码
   */
  poolCode: string;

  /**
   * 投注选择
   */
  selection: string;

  /**
   * 选择时的赔率
   */
  odds: number;

  /**
   * 让球数
   */
  goalLine: string;

}

export interface UserFollowDetailsForm extends BaseEntity {
  /**
   * 详情ID, 主键
   */
  followDetailId?: string | number;

  /**
   * 所属跟投ID (关联 biz_user_follows)
   */
  followId?: string | number;

  /**
   * 比赛ID (关联 biz_matches)
   */
  matchId?: string | number;

  /**
   * 玩法代码
   */
  poolCode?: string;

  /**
   * 投注选择
   */
  selection?: string;

  /**
   * 选择时的赔率
   */
  odds?: number;

  /**
   * 让球数
   */
  goalLine?: string;

}

export interface UserFollowDetailsQuery extends PageQuery {

  /**
   * 所属跟投ID (关联 biz_user_follows)
   */
  followId?: string | number;

  /**
   * 比赛ID (关联 biz_matches)
   */
  matchId?: string | number;

  /**
   * 玩法代码
   */
  poolCode?: string;

  /**
   * 投注选择
   */
  selection?: string;

  /**
   * 选择时的赔率
   */
  odds?: number;

  /**
   * 让球数
   */
  goalLine?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}

export interface UserFollowDetailsSaveBo {
    periodId: string;
    // 【核心修复】ID 类型应为 string | number
    followIds: (string | number)[];
    combinations: {
        matchName: string;
        matchId: number;
        poolCode: string;
        selection: string;
        odds: number;
        goalLine?: string;
    }[][];
}
