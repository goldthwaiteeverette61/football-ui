<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="申请用户ID" prop="userId">
              <el-input v-model="queryParams.userId" placeholder="请输入申请用户ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="申请金额" prop="amount">
              <el-input v-model="queryParams.amount" placeholder="请输入申请金额" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="货币类型" prop="currency">
              <el-input v-model="queryParams.currency" placeholder="请输入货币类型" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="备注" prop="remarks">
              <el-input v-model="queryParams.remarks" placeholder="请输入备注" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['biz:rewardClaim:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['biz:rewardClaim:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['biz:rewardClaim:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['biz:rewardClaim:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="rewardClaimList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" v-if="true" />
        <el-table-column label="申请用户" align="center" prop="userName" />
        <el-table-column label="申请用户ID" align="center" prop="userId" />
        <el-table-column label="申请金额" align="center" prop="amount" />
        <el-table-column label="时间" align="center" prop="createTime" />
        <el-table-column label="状态" align="center" prop="status" />
        <el-table-column label="备注" align="center" prop="remarks" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <!-- 【核心新增】审核按钮 -->
            <div v-if="scope.row.status === 'PENDING'">
              <el-tooltip content="批准" placement="top">
                <el-button link type="success" icon="Check" @click="handleApprove(scope.row)" v-hasPermi="['biz:rewardClaim:approve']"></el-button>
              </el-tooltip>
              <el-tooltip content="拒绝" placement="top">
                <el-button link type="danger" icon="Close" @click="handleReject(scope.row)" v-hasPermi="['biz:rewardClaim:reject']"></el-button>
              </el-tooltip>
            </div>
             <!-- 原有按钮 -->
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['biz:rewardClaim:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['biz:rewardClaim:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改理赔申请对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="rewardClaimFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="申请用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入申请用户ID" />
        </el-form-item>
        <el-form-item label="申请金额" prop="amount">
          <el-input v-model="form.amount" placeholder="请输入申请金额" />
        </el-form-item>
        <el-form-item label="货币类型" prop="currency">
          <el-input v-model="form.currency" placeholder="请输入货币类型" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
            <el-input v-model="form.remarks" type="textarea" placeholder="请输入内容" />
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

<script setup name="RewardClaim" lang="ts">
// 【核心新增】导入审核 API
import { listRewardClaim, getRewardClaim, delRewardClaim, addRewardClaim, updateRewardClaim, approveRewardClaim, rejectRewardClaim } from '@/api/biz/rewardClaim';
import { RewardClaimVO, RewardClaimQuery, RewardClaimForm } from '@/api/biz/rewardClaim/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const rewardClaimList = ref<RewardClaimVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const rewardClaimFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: RewardClaimForm = {
  id: undefined,
  userId: undefined,
  amount: undefined,
  currency: undefined,
  status: undefined,
  remarks: undefined,
}
const data = reactive<PageData<RewardClaimForm, RewardClaimQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userId: undefined,
    amount: undefined,
    currency: undefined,
    status: undefined,
    remarks: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "主键不能为空", trigger: "blur" }
    ],
    userId: [
      { required: true, message: "申请用户ID不能为空", trigger: "blur" }
    ],
    amount: [
      { required: true, message: "申请金额不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "状态 (PENDING, APPROVED, REJECTED)不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询理赔申请列表 */
const getList = async () => {
  loading.value = true;
  const res = await listRewardClaim(queryParams.value);
  rewardClaimList.value = res.rows;
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
  rewardClaimFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: RewardClaimVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加理赔申请";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: RewardClaimVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getRewardClaim(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改理赔申请";
}

// =================================================================================
// 【核心新增】审核处理方法
// =================================================================================

/** 批准按钮操作 */
const handleApprove = async (row: RewardClaimVO) => {
  await proxy?.$modal.confirm('是否确认批准编号为"' + row.id + '"的理赔申请？');
  loading.value = true;
  try {
    await approveRewardClaim(row.id);
    proxy?.$modal.msgSuccess("批准成功");
    await getList();
  } finally {
    loading.value = false;
  }
}

/** 拒绝按钮操作 */
const handleReject = async (row: RewardClaimVO) => {
    await proxy?.$modal.confirm('是否确认拒绝编号为"' + row.id + '"的理赔申请？');
    loading.value = true;
    try {
        await rejectRewardClaim(row.id);
        proxy?.$modal.msgSuccess("拒绝成功");
        await getList();
    } finally {
        loading.value = false;
    }
}


// =================================================================================
// 原有方法
// =================================================================================

/** 提交按钮 */
const submitForm = () => {
  rewardClaimFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateRewardClaim(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addRewardClaim(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: RewardClaimVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除理赔申请编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delRewardClaim(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('biz/rewardClaim/export', {
    ...queryParams.value
  }, `rewardClaim_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>