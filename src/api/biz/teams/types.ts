export interface TeamsVO {
  /**
   * 球队ID (来自JSON中的homeTeamId/awayTeamId), 主键
   */
  teamId: string | number;

  /**
   * 球队全称 (来自JSON中的allHomeTeam/allAwayTeam)
   */
  fullName: string;

  /**
   * 球队简称 (来自JSON中的homeTeam/awayTeam)
   */
  abbrName: string;

}

export interface TeamsForm extends BaseEntity {
  /**
   * 球队ID (来自JSON中的homeTeamId/awayTeamId), 主键
   */
  teamId?: string | number;

  /**
   * 球队全称 (来自JSON中的allHomeTeam/allAwayTeam)
   */
  fullName?: string;

  /**
   * 球队简称 (来自JSON中的homeTeam/awayTeam)
   */
  abbrName?: string;

}

export interface TeamsQuery extends PageQuery {

  /**
   * 球队全称 (来自JSON中的allHomeTeam/allAwayTeam)
   */
  fullName?: string;

  /**
   * 球队简称 (来自JSON中的homeTeam/awayTeam)
   */
  abbrName?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



