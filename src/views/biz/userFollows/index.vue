<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">

            <el-form-item label="方案期数" prop="periodId">
              <el-input v-model="queryParams.periodId" placeholder="请输入方案期数ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>

            <el-form-item label="用户id" prop="userId">
              <el-input v-model="queryParams.userId" placeholder="用户id" clearable/>
            </el-form-item>

            <el-form-item label="跟投状态" prop="status">
              <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
                <el-option label="购物车中" value="in_cart"></el-option>
                <el-option label="已购买" value="bought"></el-option>
                <el-option label="已结算" value="settled"></el-option>
                <el-option label="购买失败" value="failed"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="跟投时间" prop="createdAt">
              <el-date-picker clearable
                v-model="queryParams.createdAt"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择跟投时间"
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['biz:userFollows:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="Setting"
              :disabled="multiple"
              @click="handleSetOdds"
              v-hasPermi="['biz:userFollows:edit']"
            >设置赔率</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="info" plain icon="Check" :disabled="multiple" @click="handleBatchConfirm" v-hasPermi="['biz:userFollows:edit']">批量确认</el-button>
          </el-col>
          <!-- 【核心新增】失败按钮 -->
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Close" :disabled="multiple" @click="handleBatchFail" v-hasPermi="['biz:userFollows:edit']">失败</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['biz:userFollows:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <el-row :gutter="20" class="mt-2 text-sm text-gray-600">
            <el-col :span="6">
                <span>总跟投金额：</span>
                <span class="font-bold text-red-500">{{ totalBetAmount.toFixed(2) }}</span>
            </el-col>
            <el-col :span="6">
                <span>总中奖金额：</span>
                <span class="font-bold text-red-500">{{ totalPayoutAmount.toFixed(2) }}</span>
            </el-col>
            <el-col :span="6">
                <span>选择金额：</span>
                <span class="font-bold text-red-500">{{ selectedBetAmount.toFixed(2) }}</span>
            </el-col>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="userFollowsList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="跟投ID" align="center" prop="followId" />
        <el-table-column label="跟投用户ID" align="center" prop="userId" />
        <el-table-column label="跟投用户名称" align="center" prop="userName" />
        <el-table-column label="方案ID" align="center" prop="periodId" />
        <el-table-column label="方案名称" align="center" prop="periodName" />
        <el-table-column label="跟投金额" align="center" prop="betAmount" />
        <el-table-column label="赔率组合" align="center" prop="betOddsDesc" width="180" />
        <el-table-column label="跟投状态" align="center" prop="status" />
        <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
          <template #default="scope">
            <span>{{ scope.row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['biz:userFollows:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['biz:userFollows:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改用户跟投记录对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="userFollowsFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="跟投用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入跟投用户ID" />
        </el-form-item>
        <el-form-item label="跟投期数ID" prop="periodId">
          <el-input v-model="form.periodId" placeholder="请输入跟投的期数ID" />
        </el-form-item>
        <el-form-item label="跟投金额" prop="betAmount">
          <el-input v-model="form.betAmount" placeholder="请输入跟投金额" />
        </el-form-item>
        <el-form-item label="派奖金额" prop="payoutAmount">
          <el-input v-model="form.payoutAmount" placeholder="请输入派奖金额" />
        </el-form-item>
        <el-form-item label="跟投时间" prop="createdAt">
          <el-date-picker clearable
            v-model="form.createdAt"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择跟投时间">
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

<script setup name="UserFollows" lang="ts">
import { ref, onMounted, reactive, toRefs, getCurrentInstance, ComponentInternalInstance, computed } from 'vue';
import { useRouter } from 'vue-router';
// 【核心新增】导入 batchFailFollows API
import { listUserFollows, getUserFollows, delUserFollows, addUserFollows, updateUserFollows, batchConfirmFollows, batchFailFollows } from '@/api/biz/userFollows';
import { UserFollowsVO, UserFollowsQuery, UserFollowsForm } from '@/api/biz/userFollows/types';
import type { ElFormInstance } from 'element-plus';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const router = useRouter();

const userFollowsList = ref<UserFollowsVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const selections = ref<UserFollowsVO[]>([]);
const totalBetAmount = ref(0);
const totalPayoutAmount = ref(0);


const queryFormRef = ref<ElFormInstance>();
const userFollowsFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const selectedBetAmount = computed(() => {
    return selections.value.reduce((sum, item) => sum + Number(item.betAmount || 0), 0);
});

const initFormData: UserFollowsForm = {
  followId: undefined,
  userId: undefined,
  periodId: undefined,
  betAmount: undefined,
  status: undefined,
  betOddsDesc: undefined,
  payoutAmount: undefined,
  createdAt: undefined
}
const data = reactive<PageData<UserFollowsForm, UserFollowsQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userId: undefined,
    periodId: undefined,
    betAmount: undefined,
    status: 'in_cart',
    payoutAmount: undefined,
    createdAt: undefined,
    params: {
    }
  },
  rules: {
    userId: [
      { required: true, message: "跟投用户ID不能为空", trigger: "blur" }
    ],
    periodId: [
      { required: true, message: "跟投的期数ID不能为空", trigger: "blur" }
    ],
    betAmount: [
      { required: true, message: "跟投金额不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询用户跟投记录列表 */
const getList = async () => {
  loading.value = true;
  const res = await listUserFollows(queryParams.value);
  userFollowsList.value = res.rows;
  total.value = res.total;
  totalBetAmount.value = Number(res.extra?.totalBetAmount || 0);
  totalPayoutAmount.value = Number(res.extra?.totalPayoutAmount || 0);
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
  userFollowsFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  queryParams.value.status = 'in_cart';
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: UserFollowsVO[]) => {
  selections.value = selection;
  ids.value = selection.map(item => item.followId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 设置赔率按钮操作 */
const handleSetOdds = () => {
  if (!selections.value || selections.value.length === 0) {
    proxy?.$modal.msgWarning("请至少选择一条记录");
    return;
  }

  const firstPeriodId = selections.value[0].periodId;
  const allSamePeriod = selections.value.every(item => item.periodId === firstPeriodId);

  if (!allSamePeriod) {
    proxy?.$modal.msgError("请选择属于同一个方案期数的跟投记录进行操作！");
    return;
  }

  const followIds = selections.value.map(item => item.followId);

  router.push({
    name: 'SchemeEditor',
    query: {
      followIds: followIds.join(','),
      periodId: String(firstPeriodId)
    }
  });
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加用户跟投记录";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: UserFollowsVO) => {
  reset();
  const _followId = row?.followId || ids.value[0]
  const res = await getUserFollows(_followId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改用户跟投记录";
}

/** 提交按钮 */
const submitForm = () => {
  userFollowsFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.followId) {
        await updateUserFollows(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addUserFollows(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: UserFollowsVO) => {
  const _followIds = row?.followId || ids.value;
  await proxy?.$modal.confirm('是否确认删除用户跟投记录编号为"' + _followIds + '"的数据项？');
  loading.value = true;
  await delUserFollows(_followIds as string | number | (string | number)[]).finally(() => loading.value = false);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 批量确认按钮的处理函数 */
const handleBatchConfirm = async () => {
  const _followIds = ids.value;
  await proxy?.$modal.confirm('是否确认投注记录编号为"' + _followIds.join(',') + '"的数据项？');
  loading.value = true;
  try {
    await batchConfirmFollows(_followIds);
    proxy?.$modal.msgSuccess("批量确认成功");
    await getList();
  } finally {
    loading.value = false;
  }
}

/** 【核心新增】批量失败按钮的处理函数 */
const handleBatchFail = async () => {
    const _followIds = ids.value;
    try {
        const { value } = await proxy?.$modal.prompt('请输入失败原因');
        loading.value = true;
        await batchFailFollows({
            followIds: _followIds,
            remark: value
        });
        proxy?.$modal.msgSuccess("操作成功");
        await getList();
    } catch (e) {
        // 用户取消输入或API调用失败
        if (e !== 'cancel') {
            console.error("批量失败操作时发生错误:", e);
        }
    } finally {
        loading.value = false;
    }
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('biz/userFollows/export', {
    ...queryParams.value
  }, `userFollows_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
