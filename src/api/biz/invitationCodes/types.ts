export interface InvitationCodesVO {
  /**
   * 邀请码ID, 主键
   */
  codeId: string | number;

  /**
   * 唯一的邀请码
   */
  invitationCode: string;

  /**
   * 状态 (available-可用, assigned-已分配)
   */
  status: string;

  /**
   * 被分配的用户ID (关联 sys_user)
   */
  assigneeUserId: string | number;

  /**
   * 分配时间
   */
  assignTime: string;

}

export interface InvitationCodesForm extends BaseEntity {
  /**
   * 邀请码ID, 主键
   */
  codeId?: string | number;

  /**
   * 唯一的邀请码
   */
  invitationCode?: string;

  /**
   * 状态 (available-可用, assigned-已分配)
   */
  status?: string;

  /**
   * 被分配的用户ID (关联 sys_user)
   */
  assigneeUserId?: string | number;

  /**
   * 分配时间
   */
  assignTime?: string;

}

export interface InvitationCodesQuery extends PageQuery {

  /**
   * 唯一的邀请码
   */
  invitationCode?: string;

  /**
   * 状态 (available-可用, assigned-已分配)
   */
  status?: string;

  /**
   * 被分配的用户ID (关联 sys_user)
   */
  assigneeUserId?: string | number;

  /**
   * 分配时间
   */
  assignTime?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



