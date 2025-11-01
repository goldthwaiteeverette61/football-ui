export interface SportsVO {
  /**
   * 
   */
  id: string | number;

  /**
   * 体育项目名称，如 Soccer
   */
  name: string;

}

export interface SportsForm extends BaseEntity {
  /**
   * 
   */
  id?: string | number;

  /**
   * 体育项目名称，如 Soccer
   */
  name?: string;

}

export interface SportsQuery extends PageQuery {

  /**
   * 体育项目名称，如 Soccer
   */
  name?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



