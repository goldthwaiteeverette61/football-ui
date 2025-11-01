export interface WithdrawalsVO {
  withdrawalId: string | number;
  userId: string | number;
  amount: number;
  networkFee: number;
  finalAmount: number;
  toWalletAddress: string;
  status: string;
  requestTime: string;
  auditBy: number;
  auditTime: string;
  auditRemarks: string;
  txHash: string;
  completionTime: string;
}

export interface WithdrawalsForm extends BaseEntity {
  withdrawalId?: string | number;
  userId?: string | number;
  amount?: number;
  networkFee?: number;
  finalAmount?: number;
  toWalletAddress?: string;
  status?: string;
  requestTime?: string;
  auditBy?: number;
  auditTime?: string;
  auditRemarks?: string;
  txHash?: string;
  completionTime?: string;
}

export interface WithdrawalsQuery extends PageQuery {
  userId?: string | number;
  toWalletAddress?: string;
  status?: string;
  params?: any;
}

/**
 * 核心修改：新增审核表单类型
 */
export interface WithdrawalAuditForm {
  withdrawalId: string | number;
  isApproved: boolean;
  auditRemarks?: string;
}