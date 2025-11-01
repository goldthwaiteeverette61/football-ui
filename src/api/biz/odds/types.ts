export interface OddsVO {
  /**
   * 自增ID, 主键
   */
  id: string | number;

  /**
   * 关联的比赛ID
   */
  matchId: string | number;

  /**
   * 赔率类型/玩法代码 (例如 "HAD", "HHAD")
   */
  poolCode: string;

  /**
   * 让球数 (来自JSON中的goalLine, 例如 "+1")
   */
  goalLine: string;

  /**
   * 主胜赔率 (来自JSON中的h)
   */
  homeOdds: number;

  /**
   * 平局赔率 (来自JSON中的d)
   */
  drawOdds: number;

  /**
   * 客胜赔率 (来自JSON中的a)
   */
  awayOdds: number;

  /**
   * 盘口状态 (来自JSON中的poolStatus)
   */
  status: string;

  /**
   * 赔率更新时间
   */
  updatedAt: string;

}

export interface OddsForm extends BaseEntity {
  /**
   * 自增ID, 主键
   */
  id?: string | number;

  /**
   * 关联的比赛ID
   */
  matchId?: string | number;

  /**
   * 赔率类型/玩法代码 (例如 "HAD", "HHAD")
   */
  poolCode?: string;

  /**
   * 让球数 (来自JSON中的goalLine, 例如 "+1")
   */
  goalLine?: string;

  /**
   * 主胜赔率 (来自JSON中的h)
   */
  homeOdds?: number;

  /**
   * 平局赔率 (来自JSON中的d)
   */
  drawOdds?: number;

  /**
   * 客胜赔率 (来自JSON中的a)
   */
  awayOdds?: number;

  /**
   * 盘口状态 (来自JSON中的poolStatus)
   */
  status?: string;

  /**
   * 赔率更新时间
   */
  updatedAt?: string;

}

export interface OddsQuery extends PageQuery {

  /**
   * 关联的比赛ID
   */
  matchId?: string | number;

  /**
   * 赔率类型/玩法代码 (例如 "HAD", "HHAD")
   */
  poolCode?: string;

  /**
   * 让球数 (来自JSON中的goalLine, 例如 "+1")
   */
  goalLine?: string;

  /**
   * 主胜赔率 (来自JSON中的h)
   */
  homeOdds?: number;

  /**
   * 平局赔率 (来自JSON中的d)
   */
  drawOdds?: number;

  /**
   * 客胜赔率 (来自JSON中的a)
   */
  awayOdds?: number;

  /**
   * 盘口状态 (来自JSON中的poolStatus)
   */
  status?: string;

  /**
   * 赔率更新时间
   */
  updatedAt?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



