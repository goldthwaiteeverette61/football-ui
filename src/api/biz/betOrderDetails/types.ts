export interface BetOrderDetailsVO {
  /**
   * 詳情ID, 主鍵
   */
  detailId: string | number;

  /**
   * 所屬訂單ID
   */
  orderId: string | number;

  /**
   * 比賽ID
   */
  matchId: number;

  /**
   * 比赛名称 (由后端拼接)
   */
  matchName?: string;

  /**
   * 玩法代碼
   */
  poolCode: string;

  /**
   * 使用者的投注選擇
   */
  selection: string;

  /**
   * 下注時的賠率
   */
  odds: number;

  /**
   * 賽果判定結果: NULL-待定, 1-命中, 0-未命中, 2-走水/作廢
   */
  isWinning: number;

}

export interface BetOrderDetailsForm extends BaseEntity {
  /**
   * 詳情ID, 主鍵
   */
  detailId?: string | number;

  /**
   * 所屬訂單ID
   */
  orderId?: string | number;

  /**
   * 比賽ID
   */
  matchId?: number;

  /**
   * 玩法代碼
   */
  poolCode?: string;

  /**
   * 使用者的投注選擇
   */
  selection?: string;

  /**
   * 下注時的賠率
   */
  odds?: number;

  /**
   * 賽果判定結果: NULL-待定, 1-命中, 0-未命中, 2-走水/作廢
   */
  isWinning?: number;

}

export interface BetOrderDetailsQuery extends PageQuery {

  /**
   * 所屬訂單ID
   */
  orderId?: string | number;

  /**
   * 比賽ID
   */
  matchId?: number;

  /**
   * 玩法代碼
   */
  poolCode?: string;

  /**
   * 使用者的投注選擇
   */
  selection?: string;

  /**
   * 下注時的賠率
   */
  odds?: number;

  /**
   * 賽果判定結果: NULL-待定, 1-命中, 0-未命中, 2-走水/作廢
   */
  isWinning?: number;

    /**
     * 日期范围参数
     */
    params?: any;
}

/**
 * 批量更新赔率DTO
 */
export interface BatchUpdateOddsDto {
  details: {
    detailId: number | string;
    odds: number;
  }[];
}

