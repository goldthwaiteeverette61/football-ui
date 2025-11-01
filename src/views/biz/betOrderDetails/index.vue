<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="所屬訂單ID " prop="orderId">
              <el-input v-model="queryParams.orderId" placeholder="请输入所屬訂單ID " clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="比賽ID" prop="matchId">
              <el-input v-model="queryParams.matchId" placeholder="请输入比賽ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="玩法代碼" prop="poolCode">
              <el-input v-model="queryParams.poolCode" placeholder="请输入玩法代碼" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="使用者的投注選擇 " prop="selection">
              <el-input v-model="queryParams.selection" placeholder="请输入使用者的投注選擇 " clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="下注時的賠率" prop="odds">
              <el-input v-model="queryParams.odds" placeholder="请输入下注時的賠率" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="賽果判定結果: NULL-待定, 1-命中, 0-未命中, 2-走水/作廢" prop="isWinning">
              <el-input v-model="queryParams.isWinning" placeholder="请输入賽果判定結果: NULL-待定, 1-命中, 0-未命中, 2-走水/作廢" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['biz:betOrderDetails:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['biz:betOrderDetails:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['biz:betOrderDetails:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['biz:betOrderDetails:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="betOrderDetailsList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="詳情ID, 主鍵" align="center" prop="detailId" v-if="true" />
        <el-table-column label="所屬訂單ID " align="center" prop="orderId" />
        <el-table-column label="比賽ID" align="center" prop="matchId" />
        <el-table-column label="玩法代碼" align="center" prop="poolCode" />
        <el-table-column label="使用者的投注選擇 " align="center" prop="selection" />
        <el-table-column label="下注時的賠率" align="center" prop="odds" />
        <el-table-column label="賽果判定結果: NULL-待定, 1-命中, 0-未命中, 2-走水/作廢" align="center" prop="isWinning" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['biz:betOrderDetails:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['biz:betOrderDetails:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改投注訂單詳情对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="betOrderDetailsFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所屬訂單ID " prop="orderId">
          <el-input v-model="form.orderId" placeholder="请输入所屬訂單ID " />
        </el-form-item>
        <el-form-item label="比賽ID" prop="matchId">
          <el-input v-model="form.matchId" placeholder="请输入比賽ID" />
        </el-form-item>
        <el-form-item label="玩法代碼" prop="poolCode">
          <el-input v-model="form.poolCode" placeholder="请输入玩法代碼" />
        </el-form-item>
        <el-form-item label="使用者的投注選擇 " prop="selection">
          <el-input v-model="form.selection" placeholder="请输入使用者的投注選擇 " />
        </el-form-item>
        <el-form-item label="下注時的賠率" prop="odds">
          <el-input v-model="form.odds" placeholder="请输入下注時的賠率" />
        </el-form-item>
        <el-form-item label="賽果判定結果: NULL-待定, 1-命中, 0-未命中, 2-走水/作廢" prop="isWinning">
          <el-input v-model="form.isWinning" placeholder="请输入賽果判定結果: NULL-待定, 1-命中, 0-未命中, 2-走水/作廢" />
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

<script setup name="BetOrderDetails" lang="ts">
import { listBetOrderDetails, getBetOrderDetails, delBetOrderDetails, addBetOrderDetails, updateBetOrderDetails } from '@/api/biz/betOrderDetails';
import { BetOrderDetailsVO, BetOrderDetailsQuery, BetOrderDetailsForm } from '@/api/biz/betOrderDetails/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const betOrderDetailsList = ref<BetOrderDetailsVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const betOrderDetailsFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: BetOrderDetailsForm = {
  detailId: undefined,
  orderId: undefined,
  matchId: undefined,
  poolCode: undefined,
  selection: undefined,
  odds: undefined,
  isWinning: undefined,
}
const data = reactive<PageData<BetOrderDetailsForm, BetOrderDetailsQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    orderId: undefined,
    matchId: undefined,
    poolCode: undefined,
    selection: undefined,
    odds: undefined,
    isWinning: undefined,
    params: {
    }
  },
  rules: {
    detailId: [
      { required: true, message: "詳情ID, 主鍵不能为空", trigger: "blur" }
    ],
    orderId: [
      { required: true, message: "所屬訂單ID 不能为空", trigger: "blur" }
    ],
    matchId: [
      { required: true, message: "比賽ID不能为空", trigger: "blur" }
    ],
    poolCode: [
      { required: true, message: "玩法代碼不能为空", trigger: "blur" }
    ],
    selection: [
      { required: true, message: "使用者的投注選擇 不能为空", trigger: "blur" }
    ],
    odds: [
      { required: true, message: "下注時的賠率不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询投注訂單詳情列表 */
const getList = async () => {
  loading.value = true;
  const res = await listBetOrderDetails(queryParams.value);
  betOrderDetailsList.value = res.rows;
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
  betOrderDetailsFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: BetOrderDetailsVO[]) => {
  ids.value = selection.map(item => item.detailId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加投注訂單詳情";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: BetOrderDetailsVO) => {
  reset();
  const _detailId = row?.detailId || ids.value[0]
  const res = await getBetOrderDetails(_detailId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改投注訂單詳情";
}

/** 提交按钮 */
const submitForm = () => {
  betOrderDetailsFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.detailId) {
        await updateBetOrderDetails(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addBetOrderDetails(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: BetOrderDetailsVO) => {
  const _detailIds = row?.detailId || ids.value;
  await proxy?.$modal.confirm('是否确认删除投注訂單詳情编号为"' + _detailIds + '"的数据项？').finally(() => loading.value = false);
  await delBetOrderDetails(_detailIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('biz/betOrderDetails/export', {
    ...queryParams.value
  }, `betOrderDetails_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
