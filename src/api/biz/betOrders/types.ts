export interface BetOrdersVO {
  /**
   * 訂單ID, 主鍵
   */
  orderId: string | number;

  /**
   * 下注使用者ID
   */
  userId: string | number;

  /**
   * 總投注金額
   */
  betAmount: number;

  /**
   * 過關類型 (例如: "1x1"-單關, "2x1", "3x1")
   */
  combinationType: string;

  /**
   * 訂單狀態: pending-待開獎, won-已中獎, lost-未中獎, void-作廢
   */
  status: string;

  /**
   * 派彩金額 (中獎後更新)
   */
  payoutAmount: number;

}

export interface BetOrdersForm extends BaseEntity {
  /**
   * 訂單ID, 主鍵
   */
  orderId?: string | number;

  /**
   * 下注使用者ID
   */
  userId?: string | number;

  /**
   * 總投注金額
   */
  betAmount?: number;

  /**
   * 過關類型 (例如: "1x1"-單關, "2x1", "3x1")
   */
  combinationType?: string;

  /**
   * 訂單狀態: pending-待開獎, won-已中獎, lost-未中獎, void-作廢
   */
  status?: string;

  /**
   * 派彩金額 (中獎後更新)
   */
  payoutAmount?: number;

}

export interface BetOrdersQuery extends PageQuery {

  /**
   * 下注使用者ID
   */
  userId?: string | number;

  /**
   * 總投注金額
   */
  betAmount?: number;

  /**
   * 過關類型 (例如: "1x1"-單關, "2x1", "3x1")
   */
  combinationType?: string;

  /**
   * 訂單狀態: pending-待開獎, won-已中獎, lost-未中獎, void-作廢
   */
  status?: string;

  /**
   * 派彩金額 (中獎後更新)
   */
  payoutAmount?: number;

    /**
     * 日期范围参数
     */
    params?: any;
}



