export interface SchemePeriodDetailsVO {
  /**
   * 详情ID, 主键
   */
  detailId: string | number;

  /**
   * 所属期数ID (关联 biz_scheme_periods)
   */
  periodId: string | number;

  /**
   * 比赛ID (关联 biz_matches)
   */
  matchId: string | number;

  /**
   * 玩法代码 (例如: HAD, HHAD)
   */
  poolCode: string;

  /**
   * 投注选择 (例如: H, A, D)
   */
  selection: string;

  /**
   * 选择时的赔率
   */
  odds: number;

}

export interface SchemePeriodDetailsForm extends BaseEntity {
  /**
   * 详情ID, 主键
   */
  detailId?: string | number;

  /**
   * 所属期数ID (关联 biz_scheme_periods)
   */
  periodId?: string | number;

  /**
   * 比赛ID (关联 biz_matches)
   */
  matchId?: string | number;

  /**
   * 玩法代码 (例如: HAD, HHAD)
   */
  poolCode?: string;

  /**
   * 投注选择 (例如: H, A, D)
   */
  selection?: string;

  /**
   * 选择时的赔率
   */
  odds?: number;

}

export interface SchemePeriodDetailsQuery extends PageQuery {

  /**
   * 所属期数ID (关联 biz_scheme_periods)
   */
  periodId?: string | number;

  /**
   * 比赛ID (关联 biz_matches)
   */
  matchId?: string | number;

  /**
   * 玩法代码 (例如: HAD, HHAD)
   */
  poolCode?: string;

  /**
   * 投注选择 (例如: H, A, D)
   */
  selection?: string;

  /**
   * 选择时的赔率
   */
  odds?: number;

    /**
     * 日期范围参数
     */
    params?: any;
}



