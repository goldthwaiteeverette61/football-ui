export interface BetTypesVO {
  /**
   * 
   */
  id: string | number;

  /**
   * 投注类型，如 Win / Draw / Lose
   */
  name: string;

}

export interface BetTypesForm extends BaseEntity {
  /**
   * 
   */
  id?: string | number;

  /**
   * 投注类型，如 Win / Draw / Lose
   */
  name?: string;

}

export interface BetTypesQuery extends PageQuery {

  /**
   * 投注类型，如 Win / Draw / Lose
   */
  name?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



