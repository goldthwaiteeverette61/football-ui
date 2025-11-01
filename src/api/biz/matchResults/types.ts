export interface MatchResultsVO {
  /**
   * 自增ID, 主键
   */
  id: string | number;

  /**
   * 关联的比赛ID 
   */
  matchId: string | number;

  /**
   * 玩法ID 
   */
  poolId: string | number;

  /**
   * 玩法代码 
   */
  poolCode: string;

  /**
   * 赛果组合 
   */
  combination: string;

  /**
   * 赛果组合描述)
   */
  combinationDesc: string;

  /**
   * 让球数 
   */
  goalLine: string;

  /**
   * 最终赔率
   */
  odds: number;

  /**
   * 创建时间
   */
  createdAt: string;

}

export interface MatchResultsForm extends BaseEntity {
  /**
   * 自增ID, 主键
   */
  id?: string | number;

  /**
   * 关联的比赛ID 
   */
  matchId?: string | number;

  /**
   * 玩法ID 
   */
  poolId?: string | number;

  /**
   * 玩法代码 
   */
  poolCode?: string;

  /**
   * 赛果组合 
   */
  combination?: string;

  /**
   * 赛果组合描述)
   */
  combinationDesc?: string;

  /**
   * 让球数 
   */
  goalLine?: string;

  /**
   * 最终赔率
   */
  odds?: number;

  /**
   * 创建时间
   */
  createdAt?: string;

}

export interface MatchResultsQuery extends PageQuery {

  /**
   * 关联的比赛ID 
   */
  matchId?: string | number;

  /**
   * 玩法ID 
   */
  poolId?: string | number;

  /**
   * 玩法代码 
   */
  poolCode?: string;

  /**
   * 赛果组合 
   */
  combination?: string;

  /**
   * 赛果组合描述)
   */
  combinationDesc?: string;

  /**
   * 让球数 
   */
  goalLine?: string;

  /**
   * 最终赔率
   */
  odds?: number;

  /**
   * 创建时间
   */
  createdAt?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



