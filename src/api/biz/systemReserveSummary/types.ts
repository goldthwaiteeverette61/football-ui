export interface SystemReserveSummaryVO {
  /**
   * 汇总ID (主键)
   */
  summaryId: string | number;

  /**
   * 系统储备金总额
   */
  totalReserveAmount: number;

  /**
   * 最后一次计算汇总的时间
   */
  lastCalculationTime: string;

  /**
   * 备注
   */
  remark: string;

}

export interface SystemReserveSummaryForm extends BaseEntity {
  /**
   * 汇总ID (主键)
   */
  summaryId?: string | number;

  /**
   * 系统储备金总额
   */
  totalReserveAmount?: number;

  /**
   * 最后一次计算汇总的时间
   */
  lastCalculationTime?: string;

  /**
   * 备注
   */
  remark?: string;

}

export interface SystemReserveSummaryQuery extends PageQuery {

  /**
   * 系统储备金总额
   */
  totalReserveAmount?: number;

  /**
   * 最后一次计算汇总的时间
   */
  lastCalculationTime?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



