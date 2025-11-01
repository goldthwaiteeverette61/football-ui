export interface UserInvitationsVO {
  /**
   * 邀请记录ID, 主键
   */
  invitationId: string | number;

  /**
   * 邀请人ID (关联 sys_user)
   */
  inviterId: string | number;

  /**
   * 被邀请人ID (新注册的用户, 关联 sys_user)
   */
  inviteeId: string | number;

  /**
   * 注册时使用的邀请码
   */
  invitationCodeUsed: string;

  /**
   * 邀请状态 (例如: registered-已注册, rewarded-已奖励)
   */
  status: string;

}

export interface UserInvitationsForm extends BaseEntity {
  /**
   * 邀请记录ID, 主键
   */
  invitationId?: string | number;

  /**
   * 邀请人ID (关联 sys_user)
   */
  inviterId?: string | number;

  /**
   * 被邀请人ID (新注册的用户, 关联 sys_user)
   */
  inviteeId?: string | number;

  /**
   * 注册时使用的邀请码
   */
  invitationCodeUsed?: string;

  /**
   * 邀请状态 (例如: registered-已注册, rewarded-已奖励)
   */
  status?: string;

}

export interface UserInvitationsQuery extends PageQuery {

  /**
   * 邀请人ID (关联 sys_user)
   */
  inviterId?: string | number;

  /**
   * 被邀请人ID (新注册的用户, 关联 sys_user)
   */
  inviteeId?: string | number;

  /**
   * 注册时使用的邀请码
   */
  invitationCodeUsed?: string;

  /**
   * 邀请状态 (例如: registered-已注册, rewarded-已奖励)
   */
  status?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



