import request from '@/utils/request';
import { TableDataInfo } from '@/api/types';

// ===================================================================================
// 类型定义
// ===================================================================================

/**
 * 赔率信息视图对象
 */
export interface CalculatorOddsVo {
    a: string;
    d: string;
    h: string;
    goalLine: string;
    single: number;
    homeOdds: string;
    drawOdds: string;
    awayOdds: string;
}

/**
 * 计算器比赛信息视图对象
 */
export interface CalculatorMatchVo {
    matchId: number;
    matchNumStr: string;
    businessDate: string;
    matchDatetime: string;
    leagueName: string;
    homeTeamName: string;
    homeRanks: string;
    awayTeamName: string;
    awayRanks: string;
    had: CalculatorOddsVo;
    hhad: CalculatorOddsVo;
}

/**
 * 按日期分组的比赛信息
 */
export interface CalculatorMatchGroup {
    businessDate: string;
    weekday: string;
    bizMatchesVoList: CalculatorMatchVo[]; // *** 核心修改: 字段名与后端保持一致 ***
}

/**
 * 方案详情的数据传输对象
 */
export interface SchemeDetailDto {
    matchId: number;
    poolCode: 'HAD' | 'HHAD';
    selection: 'H' | 'D' | 'A';
    odds: string;
}

/**
 * 更新方案某一期投注内容的数据传输对象
 */
export interface UpdatePeriodDto {
    periodId: string;
    details: SchemeDetailDto[];
}

export const getCalculatorList = (): Promise<TableDataInfo<CalculatorMatchGroup>> => {
    return request({
        url: '/biz/matches/list-nepayout',
        method: 'get'
    });
};

/**
 * 更新方案某一期的投注内容
 * @param data 包含期数ID和投注详情的数据
 */
export const updatePeriod = (data: UpdatePeriodDto) => {
    return request({
        url: '/biz/scheme/period/updateDetails',
        method: 'put',
        data: data
    });
};
