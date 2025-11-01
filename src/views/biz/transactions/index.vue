<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="用户id" prop="userId">
              <el-input v-model="queryParams.userId" placeholder="请输入用户id" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="用户名称" prop="userName">
              <el-input v-model="queryParams.userName" placeholder="请输入用户名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="交易金额" prop="amount">
              <el-input v-model="queryParams.amount" placeholder="请输入交易金额" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="类型" prop="transactionType">
              <el-select v-model="queryParams.transactionType" placeholder="请选择类型" clearable>
                <el-option label="奖金" value="BONUS" />
                <el-option label="充值" value="RECHARGE" />
                <el-option label="提现" value="WITHDRAWAL" />
                <el-option label="站内转入" value="INTERNAL_TRANSFER_IN" />
                <el-option label="站内转出" value="INTERNAL_TRANSFER_OUT" />
                <el-option label="手续费" value="FEE" />
                <el-option label="系统调账" value="ADJUSTMENT" />
              </el-select>
            </el-form-item>

            <el-form-item label="源id" prop="sourceId">
              <el-input v-model="queryParams.sourceId" placeholder="请输入源id" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['biz:transactions:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['biz:transactions:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['biz:transactions:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['biz:transactions:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="transactionsList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="关联的用户ID" align="center" prop="userId" />
        <el-table-column label="用户名称" align="center" prop="userName" />
        <el-table-column label="交易金额" align="center" prop="amount" />
        <el-table-column label="收款地址" align="center" prop="toAddress" />
        <el-table-column label="交易类型" align="center" prop="transactionType" />
        <el-table-column label="交易状态" align="center" prop="status" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="180"/>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['biz:transactions:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['biz:transactions:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改用户资金流水对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="transactionsFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="关联的用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入关联的用户ID" />
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="交易金额" prop="amount">
          <el-input v-model="form.amount" placeholder="请输入交易金额" />
        </el-form-item>
        <el-form-item label="币种代码" prop="currency">
          <el-input v-model="form.currency" placeholder="请输入币种代码, 例如: USDT, BTC, TRX" />
        </el-form-item>
        <el-form-item label="关联ID" prop="referenceId">
          <el-input v-model="form.referenceId" placeholder="请输入关联ID (用于将站内转账的收支两条记录关联起来)" />
        </el-form-item>
        <el-form-item label="备注信息" prop="remarks">
          <el-input v-model="form.remarks" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="区块链网络" prop="blockchainNetwork">
          <el-input v-model="form.blockchainNetwork" placeholder="请输入区块链网络 (例如: TRON, ETHEREUM_ERC20, BSC)" />
        </el-form-item>
        <el-form-item label="交易哈希" prop="transactionHash">
          <el-input v-model="form.transactionHash" placeholder="请输入区块链交易哈希 (TxID)" />
        </el-form-item>
        <el-form-item label="付款方地址" prop="fromAddress">
          <el-input v-model="form.fromAddress" placeholder="请输入链上付款方地址" />
        </el-form-item>
        <el-form-item label="收款方地址" prop="toAddress">
          <el-input v-model="form.toAddress" placeholder="请输入链上收款方地址" />
        </el-form-item>
        <el-form-item label="创建时间" prop="createdAt">
          <el-date-picker clearable
            v-model="form.createdAt"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="最后更新时间" prop="updatedAt">
          <el-date-picker clearable
            v-model="form.updatedAt"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择最后更新时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="源id" prop="sourceId">
          <el-input v-model="form.sourceId" placeholder="请输入源id" />
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

<script setup name="Transactions" lang="ts">
import { listTransactions, getTransactions, delTransactions, addTransactions, updateTransactions } from '@/api/biz/transactions';
import { TransactionsVO, TransactionsQuery, TransactionsForm } from '@/api/biz/transactions/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const transactionsList = ref<TransactionsVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const transactionsFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: TransactionsForm = {
  id: undefined,
  userId: undefined,
  userName: undefined,
  amount: undefined,
  currency: undefined,
  transactionType: undefined,
  status: undefined,
  referenceId: undefined,
  remarks: undefined,
  blockchainNetwork: undefined,
  transactionHash: undefined,
  fromAddress: undefined,
  toAddress: undefined,
  createdAt: undefined,
  updatedAt: undefined,
  sourceId: undefined
}
const data = reactive<PageData<TransactionsForm, TransactionsQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userId: undefined,
    userName: undefined,
    amount: undefined,
    currency: undefined,
    transactionType: undefined,
    status: undefined,
    referenceId: undefined,
    remarks: undefined,
    blockchainNetwork: undefined,
    transactionHash: undefined,
    fromAddress: undefined,
    toAddress: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    sourceId: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "流水ID，主键不能为空", trigger: "blur" }
    ],
    userId: [
      { required: true, message: "关联的用户ID不能为空", trigger: "blur" }
    ],
    amount: [
      { required: true, message: "交易金额不能为空", trigger: "blur" }
    ],
    currency: [
      { required: true, message: "币种代码, 例如: USDT, BTC, TRX不能为空", trigger: "blur" }
    ],
    transactionType: [
      { required: true, message: "交易类型 不能为空", trigger: "change" }
    ],
    updatedAt: [
      { required: true, message: "最后更新时间不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询用户资金流水列表 */
const getList = async () => {
  loading.value = true;
  const res = await listTransactions(queryParams.value);
  transactionsList.value = res.rows;
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
  transactionsFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: TransactionsVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加用户资金流水";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: TransactionsVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getTransactions(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改用户资金流水";
}

/** 提交按钮 */
const submitForm = () => {
  transactionsFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateTransactions(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addTransactions(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: TransactionsVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除用户资金流水编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delTransactions(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('biz/transactions/export', {
    ...queryParams.value
  }, `transactions_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
