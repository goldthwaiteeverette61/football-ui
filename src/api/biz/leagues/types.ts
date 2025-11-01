export interface LeaguesVO {
  /**
   * 联赛ID (来自JSON中的leagueId), 主键
   */
  leagueId: string | number;

  /**
   * 联赛全称 (来自JSON中的leagueAllName)
   */
  name: string;

  /**
   * 球队简称
   */
  abbrName: string;

  /**
   * 联赛背景颜色 (来自JSON中的leagueBackColor)
   */
  backColor: string;

}

export interface LeaguesForm extends BaseEntity {
  /**
   * 联赛ID (来自JSON中的leagueId), 主键
   */
  leagueId?: string | number;

  /**
   * 联赛全称 (来自JSON中的leagueAllName)
   */
  name?: string;

  /**
   * 球队简称
   */
  abbrName?: string;

  /**
   * 联赛背景颜色 (来自JSON中的leagueBackColor)
   */
  backColor?: string;

}

export interface LeaguesQuery extends PageQuery {

  /**
   * 联赛全称 (来自JSON中的leagueAllName)
   */
  name?: string;

  /**
   * 球队简称
   */
  abbrName?: string;

  /**
   * 联赛背景颜色 (来自JSON中的leagueBackColor)
   */
  backColor?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



