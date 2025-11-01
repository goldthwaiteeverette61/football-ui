<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="区块链交易哈希 (txID)" prop="txHash">
              <el-input v-model="queryParams.txHash" placeholder="请输入区块链交易哈希 (txID)" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="收款用户ID (关联 sys_user.user_id)" prop="userId">
              <el-input v-model="queryParams.userId" placeholder="请输入收款用户ID (关联 sys_user.user_id)" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="付款方地址" prop="fromAddress">
              <el-input v-model="queryParams.fromAddress" placeholder="请输入付款方地址" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="收款方地址 (我们监控的地址)" prop="toAddress">
              <el-input v-model="queryParams.toAddress" placeholder="请输入收款方地址 (我们监控的地址)" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="交易金额" prop="amount">
              <el-input v-model="queryParams.amount" placeholder="请输入交易金额" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="币种 (例如: TRX, USDT)" prop="currency">
              <el-input v-model="queryParams.currency" placeholder="请输入币种 (例如: TRX, USDT)" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="确认入账时间" prop="confirmedAt">
              <el-date-picker clearable
                v-model="queryParams.confirmedAt"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择确认入账时间"
              />
            </el-form-item>
            <el-form-item label="记录创建时间" prop="createdAt">
              <el-date-picker clearable
                v-model="queryParams.createdAt"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择记录创建时间"
              />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['biz:walletTransactions:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['biz:walletTransactions:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['biz:walletTransactions:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['biz:walletTransactions:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="walletTransactionsList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="记录ID, 主键" align="center" prop="transactionId" v-if="true" />
        <el-table-column label="区块链交易哈希 (txID)" align="center" prop="txHash" />
        <el-table-column label="收款用户ID (关联 sys_user.user_id)" align="center" prop="userId" />
        <el-table-column label="付款方地址" align="center" prop="fromAddress" />
        <el-table-column label="收款方地址 (我们监控的地址)" align="center" prop="toAddress" />
        <el-table-column label="交易金额" align="center" prop="amount" />
        <el-table-column label="币种 (例如: TRX, USDT)" align="center" prop="currency" />
        <el-table-column label="系统处理状态: pending-待处理, confirmed-已确认入账, failed-处理失败" align="center" prop="status" />
        <el-table-column label="确认入账时间" align="center" prop="confirmedAt" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.confirmedAt, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="记录创建时间" align="center" prop="createdAt" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createdAt, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['biz:walletTransactions:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['biz:walletTransactions:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改钱包交易记录对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="walletTransactionsFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="区块链交易哈希 (txID)" prop="txHash">
          <el-input v-model="form.txHash" placeholder="请输入区块链交易哈希 (txID)" />
        </el-form-item>
        <el-form-item label="收款用户ID (关联 sys_user.user_id)" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入收款用户ID (关联 sys_user.user_id)" />
        </el-form-item>
        <el-form-item label="付款方地址" prop="fromAddress">
          <el-input v-model="form.fromAddress" placeholder="请输入付款方地址" />
        </el-form-item>
        <el-form-item label="收款方地址 (我们监控的地址)" prop="toAddress">
          <el-input v-model="form.toAddress" placeholder="请输入收款方地址 (我们监控的地址)" />
        </el-form-item>
        <el-form-item label="交易金额" prop="amount">
          <el-input v-model="form.amount" placeholder="请输入交易金额" />
        </el-form-item>
        <el-form-item label="币种 (例如: TRX, USDT)" prop="currency">
          <el-input v-model="form.currency" placeholder="请输入币种 (例如: TRX, USDT)" />
        </el-form-item>
        <el-form-item label="确认入账时间" prop="confirmedAt">
          <el-date-picker clearable
            v-model="form.confirmedAt"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择确认入账时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="记录创建时间" prop="createdAt">
          <el-date-picker clearable
            v-model="form.createdAt"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择记录创建时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="WalletTransactions" lang="ts">
import { listWalletTransactions, getWalletTransactions, delWalletTransactions, addWalletTransactions, updateWalletTransactions } from '@/api/biz/walletTransactions';
import { WalletTransactionsVO, WalletTransactionsQuery, WalletTransactionsForm } from '@/api/biz/walletTransactions/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const walletTransactionsList = ref<WalletTransactionsVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const walletTransactionsFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: WalletTransactionsForm = {
  transactionId: undefined,
  txHash: undefined,
  userId: undefined,
  fromAddress: undefined,
  toAddress: undefined,
  amount: undefined,
  currency: undefined,
  status: undefined,
  confirmedAt: undefined,
  createdAt: undefined
}
const data = reactive<PageData<WalletTransactionsForm, WalletTransactionsQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    txHash: undefined,
    userId: undefined,
    fromAddress: undefined,
    toAddress: undefined,
    amount: undefined,
    currency: undefined,
    status: undefined,
    confirmedAt: undefined,
    createdAt: undefined,
    params: {
    }
  },
  rules: {
    transactionId: [
      { required: true, message: "记录ID, 主键不能为空", trigger: "blur" }
    ],
    txHash: [
      { required: true, message: "区块链交易哈希 (txID)不能为空", trigger: "blur" }
    ],
    userId: [
      { required: true, message: "收款用户ID (关联 sys_user.user_id)不能为空", trigger: "blur" }
    ],
    fromAddress: [
      { required: true, message: "付款方地址不能为空", trigger: "blur" }
    ],
    toAddress: [
      { required: true, message: "收款方地址 (我们监控的地址)不能为空", trigger: "blur" }
    ],
    amount: [
      { required: true, message: "交易金额不能为空", trigger: "blur" }
    ],
    currency: [
      { required: true, message: "币种 (例如: TRX, USDT)不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "系统处理状态: pending-待处理, confirmed-已确认入账, failed-处理失败不能为空", trigger: "change" }
    ],
    createdAt: [
      { required: true, message: "记录创建时间不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询钱包交易记录列表 */
const getList = async () => {
  loading.value = true;
  const res = await listWalletTransactions(queryParams.value);
  walletTransactionsList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  walletTransactionsFormRef.value?.resetFields();
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

/** 多选框选中数据 */
const handleSelectionChange = (selection: WalletTransactionsVO[]) => {
  ids.value = selection.map(item => item.transactionId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加钱包交易记录";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: WalletTransactionsVO) => {
  reset();
  const _transactionId = row?.transactionId || ids.value[0]
  const res = await getWalletTransactions(_transactionId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改钱包交易记录";
}

/** 提交按钮 */
const submitForm = () => {
  walletTransactionsFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.transactionId) {
        await updateWalletTransactions(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addWalletTransactions(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: WalletTransactionsVO) => {
  const _transactionIds = row?.transactionId || ids.value;
  await proxy?.$modal.confirm('是否确认删除钱包交易记录编号为"' + _transactionIds + '"的数据项？').finally(() => loading.value = false);
  await delWalletTransactions(_transactionIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('biz/walletTransactions/export', {
    ...queryParams.value
  }, `walletTransactions_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
