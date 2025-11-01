export interface MatchesVO {
  /**
   * 比赛ID (来自JSON中的matchId), 主键
   */
  matchId: string | number;

  /**
   * 比赛数字编号 (来自JSON中的matchNum)
   */
  matchNum: number;

  /**
   * 比赛编号字符串 (来自JSON中的matchNumStr, 例如 "周三001")
   */
  matchNumStr: string;

  /**
   * 比赛周次 (来自JSON中的matchWeek)
   */
  matchWeek: string;

  /**
   * 业务日期 (来自JSON中的businessDate)
   */
  businessDate: string;

  /**
   * 主场队名
   */
  homeTeamName: string;

  /**
   * 比赛开赛时间 (可由 matchDate 和 matchTime 组合)
   */
  matchDatetime: string;

  /**
   * 联赛ID (来自JSON中的leagueId)
   */
  leagueId: string | number;

  /**
   * 主队ID (来自JSON中的homeTeamId)
   */
  homeTeamId: string | number;

  /**
   * 客队ID (来自JSON中的awayTeamId)
   */
  awayTeamId: string | number;

  /**
   * 客队名称
   */
  awayTeamName: string;

  /**
   * 上半场比分 (来自JSON中的sectionsNo1)
   */
  halfScore: string;

  /**
   * 全场比分 (来自JSON中的sectionsNo999)
   */
  fullScore: string;

  /**
   * 赛果标识 (来自JSON中的winFlag, H/D/A)
   */
  winFlag: string;

  /**
   * 比赛状态 (来自JSON中的matchStatus, 例如 "Define")
   */
  status: string;

  /**
   * 销售状态 (来自JSON中的sellStatus)
   */
  sellStatus: string;

  /**
   * 备注 (来自JSON中的remark)
   */
  remark: string;

  /**
   * 数据入库时间
   */
  createdAt: string;

  /**
   * 数据更新时间
   */
  updatedAt: string;

}

export interface MatchesForm extends BaseEntity {
  /**
   * 比赛ID (来自JSON中的matchId), 主键
   */
  matchId?: string | number;

  /**
   * 比赛数字编号 (来自JSON中的matchNum)
   */
  matchNum?: number;

  /**
   * 比赛编号字符串 (来自JSON中的matchNumStr, 例如 "周三001")
   */
  matchNumStr?: string;

  /**
   * 比赛周次 (来自JSON中的matchWeek)
   */
  matchWeek?: string;

  /**
   * 业务日期 (来自JSON中的businessDate)
   */
  businessDate?: string;

  /**
   * 主场队名
   */
  homeTeamName?: string;

  /**
   * 比赛开赛时间 (可由 matchDate 和 matchTime 组合)
   */
  matchDatetime?: string;

  /**
   * 联赛ID (来自JSON中的leagueId)
   */
  leagueId?: string | number;

  /**
   * 主队ID (来自JSON中的homeTeamId)
   */
  homeTeamId?: string | number;

  /**
   * 客队ID (来自JSON中的awayTeamId)
   */
  awayTeamId?: string | number;

  /**
   * 客队名称
   */
  awayTeamName?: string;

  /**
   * 上半场比分 (来自JSON中的sectionsNo1)
   */
  halfScore?: string;

  /**
   * 全场比分 (来自JSON中的sectionsNo999)
   */
  fullScore?: string;

  /**
   * 赛果标识 (来自JSON中的winFlag, H/D/A)
   */
  winFlag?: string;

  /**
   * 比赛状态 (来自JSON中的matchStatus, 例如 "Define")
   */
  status?: string;

  /**
   * 销售状态 (来自JSON中的sellStatus)
   */
  sellStatus?: string;

  /**
   * 备注 (来自JSON中的remark)
   */
  remark?: string;

  /**
   * 数据入库时间
   */
  createdAt?: string;

  /**
   * 数据更新时间
   */
  updatedAt?: string;

}

export interface MatchesQuery extends PageQuery {

  /**
   * 比赛数字编号 (来自JSON中的matchNum)
   */
  matchNum?: number;

  /**
   * 比赛编号字符串 (来自JSON中的matchNumStr, 例如 "周三001")
   */
  matchNumStr?: string;

  /**
   * 比赛周次 (来自JSON中的matchWeek)
   */
  matchWeek?: string;

  /**
   * 业务日期 (来自JSON中的businessDate)
   */
  businessDate?: string;

  /**
   * 主场队名
   */
  homeTeamName?: string;

  /**
   * 比赛开赛时间 (可由 matchDate 和 matchTime 组合)
   */
  matchDatetime?: string;

  /**
   * 联赛ID (来自JSON中的leagueId)
   */
  leagueId?: string | number;

  /**
   * 主队ID (来自JSON中的homeTeamId)
   */
  homeTeamId?: string | number;

  /**
   * 客队ID (来自JSON中的awayTeamId)
   */
  awayTeamId?: string | number;

  /**
   * 客队名称
   */
  awayTeamName?: string;

  /**
   * 上半场比分 (来自JSON中的sectionsNo1)
   */
  halfScore?: string;

  /**
   * 全场比分 (来自JSON中的sectionsNo999)
   */
  fullScore?: string;

  /**
   * 赛果标识 (来自JSON中的winFlag, H/D/A)
   */
  winFlag?: string;

  /**
   * 比赛状态 (来自JSON中的matchStatus, 例如 "Define")
   */
  status?: string;

  /**
   * 销售状态 (来自JSON中的sellStatus)
   */
  sellStatus?: string;

  /**
   * 数据入库时间
   */
  createdAt?: string;

  /**
   * 数据更新时间
   */
  updatedAt?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}