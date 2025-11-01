<template>
  <div class="p-2">
    <!-- 搜索表单 -->
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="用户ID" prop="userId">
              <el-input v-model="queryParams.userId" placeholder="请输入用户ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="提现状态" prop="status">
              <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
                <el-option label="待审核" value="PENDING"></el-option>
                <el-option label="已批准" value="APPROVED"></el-option>
                <el-option label="已拒绝" value="REJECTED"></el-option>
                <el-option label="处理中" value="PROCESSING"></el-option>
                <el-option label="已完成" value="COMPLETED"></el-option>
                <el-option label="失败" value="FAILED"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="收款地址" prop="toWalletAddress">
              <el-input v-model="queryParams.toWalletAddress" placeholder="请输入收款地址" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd"
              v-hasPermi="['biz:withdrawals:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()"
              v-hasPermi="['biz:withdrawals:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()"
              v-hasPermi="['biz:withdrawals:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport"
              v-hasPermi="['biz:withdrawals:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <!-- 数据表格 -->
      <el-table v-loading="loading" :data="withdrawalsList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="申请ID" align="center" prop="withdrawalId" />
        <el-table-column label="用户ID" align="center" prop="userId" />
        <el-table-column label="用户" align="center" prop="userName" />
        <el-table-column label="提现金额" align="center" prop="amount" />
        <el-table-column label="手续费" align="center" prop="networkFee" />
        <el-table-column label="到账金额" align="center" prop="finalAmount" />
        <el-table-column label="收款地址" align="center" prop="toWalletAddress" width="280" />
        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <el-tag
              :type="scope.row.status === 'PENDING' ? 'warning' : scope.row.status === 'APPROVED' ? 'primary' : scope.row.status === 'COMPLETED' ? 'success' : 'danger'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" align="center" prop="requestTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.requestTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核员ID" align="center" prop="auditBy" />
        <el-table-column label="审核时间" align="center" prop="auditTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.auditTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核备注" align="center" prop="auditRemarks" />
        <el-table-column label="交易哈希" align="center" prop="txHash" width="280" />
        <el-table-column label="完成时间" align="center" prop="completionTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.completionTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="120">
          <template #default="scope">
            <div v-if="scope.row.status === 'PENDING'">
              <el-tooltip content="审核通过" placement="top">
                <el-button link type="primary" icon="Check" @click="handleApprove(scope.row)"
                  v-hasPermi="['biz:withdrawals:audit']"></el-button>
              </el-tooltip>
              <el-tooltip content="审核拒绝" placement="top">
                <el-button link type="danger" icon="Close" @click="handleReject(scope.row)"
                  v-hasPermi="['biz:withdrawals:audit']"></el-button>
              </el-tooltip>
            </div>
            <div v-else>
              <el-tooltip content="修改" placement="top">
                <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                  v-hasPermi="['biz:withdrawals:edit']"></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                  v-hasPermi="['biz:withdrawals:remove']"></el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>

    <!-- 添加或修改对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="withdrawalsFormRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="提现金额" prop="amount">
          <el-input-number v-model="form.amount" :precision="2" :step="1" placeholder="请输入提现金额" class="w-full" />
        </el-form-item>
        <el-form-item label="网络手续费" prop="networkFee">
          <el-input-number v-model="form.networkFee" :precision="2" :step="1" placeholder="请输入网络手续费" class="w-full" />
        </el-form-item>
        <el-form-item label="最终到账金额" prop="finalAmount">
          <el-input-number v-model="form.finalAmount" :precision="2" :step="1" placeholder="请输入最终到账金额" class="w-full" />
        </el-form-item>
        <el-form-item label="收款钱包地址" prop="toWalletAddress">
          <el-input v-model="form.toWalletAddress" placeholder="请输入收款的TRC20钱包地址" />
        </el-form-item>
        <el-form-item label="审核备注" prop="auditRemarks">
          <el-input v-model="form.auditRemarks" type="textarea" placeholder="请输入审核备注" />
        </el-form-item>
        <el-form-item label="交易哈希" prop="txHash">
          <el-input v-model="form.txHash" placeholder="请输入TRON链上的交易哈希" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 【核心新增】审核对话框 -->
    <el-dialog :title="auditDialog.title" v-model="auditDialog.visible" width="500px" append-to-body @close="cancelAudit">
      <el-form ref="auditFormRef" :model="auditForm" :rules="auditRules" label-width="120px">
        <el-form-item v-if="auditDialog.isApproved" label="交易哈希 (TxHash)" prop="txHash">
          <el-input v-model="auditForm.txHash" placeholder="请输入交易哈希" />
        </el-form-item>
        <el-form-item label="审核备注" prop="auditRemarks">
          <el-input v-model="auditForm.auditRemarks" type="textarea" :placeholder="auditDialog.isApproved ? '请输入审核备注 (选填)' : '请输入拒绝原因'" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelAudit">取 消</el-button>
          <el-button type="primary" @click="submitAudit" :loading="buttonLoading">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Withdrawals" lang="ts">
import { listWithdrawals, getWithdrawals, delWithdrawals, addWithdrawals, updateWithdrawals, auditWithdrawal } from '@/api/biz/withdrawals';
import { WithdrawalsVO, WithdrawalsQuery, WithdrawalsForm, WithdrawalAuditForm } from '@/api/biz/withdrawals/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const withdrawalsList = ref<WithdrawalsVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const withdrawalsFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: WithdrawalsForm = {
  withdrawalId: undefined,
  userId: undefined,
  amount: undefined,
  networkFee: undefined,
  finalAmount: undefined,
  toWalletAddress: undefined,
  status: undefined,
  requestTime: undefined,
  auditBy: undefined,
  auditTime: undefined,
  auditRemarks: undefined,
  txHash: undefined,
  completionTime: undefined,
}
const data = reactive<PageData<WithdrawalsForm, WithdrawalsQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userId: undefined,
    toWalletAddress: undefined,
    status: undefined,
    params: {}
  },
  rules: {
    userId: [
      { required: true, message: "用户ID不能为空", trigger: "blur" }
    ],
    amount: [
      { required: true, message: "提现金额不能为空", trigger: "blur" },
      { type: 'number', message: '提现金额必须为数字' },
      {
        validator: (rule, value, callback) => {
          if (value <= 0) {
            callback(new Error('提现金额必须大于0'));
          } else {
            callback();
          }
        }, trigger: 'blur'
      }
    ],
    networkFee: [
      { required: true, message: "网络手续费不能为空", trigger: "blur" }
    ],
    finalAmount: [
      { required: true, message: "最终到账金额不能为空", trigger: "blur" }
    ],
    toWalletAddress: [
      { required: true, message: "收款钱包地址不能为空", trigger: "blur" },
      { pattern: /^T[1-9A-HJ-NP-Za-km-z]{33}$/, message: '请输入有效的TRC20地址', trigger: 'blur' }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

// --- 【核心新增】审核功能相关状态 ---
const auditDialog = reactive({
  visible: false,
  title: '',
  isApproved: false,
  withdrawalId: undefined as (number | string | undefined)
});
const auditFormRef = ref<ElFormInstance>();
const auditForm = reactive({
  txHash: '',
  auditRemarks: ''
});
const auditRules = computed(() => ({
  txHash: [
    { required: auditDialog.isApproved, message: "交易哈希不能为空", trigger: "blur" }
  ],
  auditRemarks: [
    { required: !auditDialog.isApproved, message: "拒绝原因不能为空", trigger: "blur" }
  ]
}));

/** 查询用户提现申请列表 */
const getList = async () => {
  loading.value = true;
  const res = await listWithdrawals(queryParams.value);
  withdrawalsList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 【核心修改】审核通过按钮操作 */
const handleApprove = (row: WithdrawalsVO) => {
  resetAuditForm();
  auditDialog.withdrawalId = row.withdrawalId;
  auditDialog.isApproved = true;
  auditDialog.title = "审核通过 - 申请ID: " + row.withdrawalId;
  auditDialog.visible = true;
};

/** 【核心修改】审核拒绝按钮操作 */
const handleReject = (row: WithdrawalsVO) => {
  resetAuditForm();
  auditDialog.withdrawalId = row.withdrawalId;
  auditDialog.isApproved = false;
  auditDialog.title = "审核拒绝 - 申请ID: " + row.withdrawalId;
  auditDialog.visible = true;
};

/** 【核心新增】提交审核表单 */
const submitAudit = () => {
  auditFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      const auditData: WithdrawalAuditForm = {
        withdrawalId: auditDialog.withdrawalId!,
        isApproved: auditDialog.isApproved,
        auditRemarks: auditForm.auditRemarks || (auditDialog.isApproved ? '审核通过' : ''),
        txHash: auditForm.txHash
      };
      await auditWithdrawal(auditData).finally(() => {
        buttonLoading.value = false;
      });
      proxy?.$modal.msgSuccess("操作成功");
      auditDialog.visible = false;
      await getList();
    }
  });
};

/** 【核心新增】取消审核 */
const cancelAudit = () => {
  auditDialog.visible = false;
  resetAuditForm();
};

/** 【核心新增】重置审核表单 */
const resetAuditForm = () => {
  auditFormRef.value?.resetFields();
  auditForm.txHash = '';
  auditForm.auditRemarks = '';
};

const cancel = () => {
  reset();
  dialog.visible = false;
}

const reset = () => {
  form.value = { ...initFormData };
  withdrawalsFormRef.value?.resetFields();
}

const handleSelectionChange = (selection: WithdrawalsVO[]) => {
  ids.value = selection.map(item => item.withdrawalId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加用户提现申请";
}

const handleUpdate = async (row?: WithdrawalsVO) => {
  reset();
  const _withdrawalId = row?.withdrawalId || ids.value[0]
  const res = await getWithdrawals(_withdrawalId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改用户提现申请";
}

const submitForm = () => {
  withdrawalsFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.withdrawalId) {
        await updateWithdrawals(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addWithdrawals(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

const handleDelete = async (row?: WithdrawalsVO) => {
  const _withdrawalIds = row?.withdrawalId || ids.value;
  await proxy?.$modal.confirm('是否确认删除用户提现申请编号为"' + _withdrawalIds + '"的数据项？').finally(() => loading.value = false);
  await delWithdrawals(_withdrawalIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

const handleExport = () => {
  proxy?.download('biz/withdrawals/export', {
    ...queryParams.value
  }, `withdrawals_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>

