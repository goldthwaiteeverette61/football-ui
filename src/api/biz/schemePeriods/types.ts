import { BaseEntity, PageQuery } from '@/types/common';

// 从后端返回的赔率信息
interface OddsInfo {
    homeOdds: number;
    drawOdds: number;
    awayOdds: number;
    goalLine?: string;
}

// 从后端返回的比赛信息
interface MatchInfo {
    matchId: number;
    leagueName: string;
    matchNumStr: string;
    matchDatetime: string;
    homeTeamName: string;
    awayTeamName: string;
    had?: OddsInfo;
    hhad?: OddsInfo;
}

// 从后端返回的方案详情项
export interface SchemeDetailItem {
    detailId: string;
    matchId: number;
    matchName: string;
    poolCode: string;
    selection: string;
    odds: number;
    goalLine?: string;
    combinationGroup?: number;
    bizMatchesVo: MatchInfo;
}

/**
 * 方案期数视图对象
 */
export interface SchemePeriodsVO {
  // 【核心修复】ID 类型应为 string | number 以支持大数字
  periodId: string | number;
  name: string;
  deadlineTime: string;
  status: string;
  details?: SchemeDetailItem[];
}


/**
 * 方案期数表单对象
 */
export interface SchemePeriodsForm extends BaseEntity {
  periodId?: number;
  name?: string;
  status?: string;
  deadlineTime?: string;
}

/**
 * 方案期数查询参数
 */
export interface SchemePeriodsQuery extends PageQuery {
  name?: string;
  status?: string;
  // 【核心修复】ID 类型应为 string | number
  periodId?: string | number;
}
