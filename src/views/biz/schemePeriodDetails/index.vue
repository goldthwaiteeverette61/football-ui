<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="所属期数ID (关联 biz_scheme_periods)" prop="periodId">
              <el-input v-model="queryParams.periodId" placeholder="请输入所属期数ID (关联 biz_scheme_periods)" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="比赛ID (关联 biz_matches)" prop="matchId">
              <el-input v-model="queryParams.matchId" placeholder="请输入比赛ID (关联 biz_matches)" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="玩法代码 (例如: HAD, HHAD)" prop="poolCode">
              <el-input v-model="queryParams.poolCode" placeholder="请输入玩法代码 (例如: HAD, HHAD)" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="投注选择 (例如: H, A, D)" prop="selection">
              <el-input v-model="queryParams.selection" placeholder="请输入投注选择 (例如: H, A, D)" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="选择时的赔率" prop="odds">
              <el-input v-model="queryParams.odds" placeholder="请输入选择时的赔率" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['biz:schemePeriodDetails:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['biz:schemePeriodDetails:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['biz:schemePeriodDetails:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['biz:schemePeriodDetails:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="schemePeriodDetailsList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="详情ID, 主键" align="center" prop="detailId" v-if="true" />
        <el-table-column label="所属期数ID (关联 biz_scheme_periods)" align="center" prop="periodId" />
        <el-table-column label="比赛ID (关联 biz_matches)" align="center" prop="matchId" />
        <el-table-column label="玩法代码 (例如: HAD, HHAD)" align="center" prop="poolCode" />
        <el-table-column label="投注选择 (例如: H, A, D)" align="center" prop="selection" />
        <el-table-column label="选择时的赔率" align="center" prop="odds" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['biz:schemePeriodDetails:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['biz:schemePeriodDetails:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改方案期数详情对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="schemePeriodDetailsFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属期数ID (关联 biz_scheme_periods)" prop="periodId">
          <el-input v-model="form.periodId" placeholder="请输入所属期数ID (关联 biz_scheme_periods)" />
        </el-form-item>
        <el-form-item label="比赛ID (关联 biz_matches)" prop="matchId">
          <el-input v-model="form.matchId" placeholder="请输入比赛ID (关联 biz_matches)" />
        </el-form-item>
        <el-form-item label="玩法代码 (例如: HAD, HHAD)" prop="poolCode">
          <el-input v-model="form.poolCode" placeholder="请输入玩法代码 (例如: HAD, HHAD)" />
        </el-form-item>
        <el-form-item label="投注选择 (例如: H, A, D)" prop="selection">
          <el-input v-model="form.selection" placeholder="请输入投注选择 (例如: H, A, D)" />
        </el-form-item>
        <el-form-item label="选择时的赔率" prop="odds">
          <el-input v-model="form.odds" placeholder="请输入选择时的赔率" />
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

<script setup name="SchemePeriodDetails" lang="ts">
import { listSchemePeriodDetails, getSchemePeriodDetails, delSchemePeriodDetails, addSchemePeriodDetails, updateSchemePeriodDetails } from '@/api/biz/schemePeriodDetails';
import { SchemePeriodDetailsVO, SchemePeriodDetailsQuery, SchemePeriodDetailsForm } from '@/api/biz/schemePeriodDetails/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const schemePeriodDetailsList = ref<SchemePeriodDetailsVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const schemePeriodDetailsFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: SchemePeriodDetailsForm = {
  detailId: undefined,
  periodId: undefined,
  matchId: undefined,
  poolCode: undefined,
  selection: undefined,
  odds: undefined,
}
const data = reactive<PageData<SchemePeriodDetailsForm, SchemePeriodDetailsQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    periodId: undefined,
    matchId: undefined,
    poolCode: undefined,
    selection: undefined,
    odds: undefined,
    params: {
    }
  },
  rules: {
    detailId: [
      { required: true, message: "详情ID, 主键不能为空", trigger: "blur" }
    ],
    periodId: [
      { required: true, message: "所属期数ID (关联 biz_scheme_periods)不能为空", trigger: "blur" }
    ],
    matchId: [
      { required: true, message: "比赛ID (关联 biz_matches)不能为空", trigger: "blur" }
    ],
    poolCode: [
      { required: true, message: "玩法代码 (例如: HAD, HHAD)不能为空", trigger: "blur" }
    ],
    selection: [
      { required: true, message: "投注选择 (例如: H, A, D)不能为空", trigger: "blur" }
    ],
    odds: [
      { required: true, message: "选择时的赔率不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询方案期数详情列表 */
const getList = async () => {
  loading.value = true;
  const res = await listSchemePeriodDetails(queryParams.value);
  schemePeriodDetailsList.value = res.rows;
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
  schemePeriodDetailsFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: SchemePeriodDetailsVO[]) => {
  ids.value = selection.map(item => item.detailId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加方案期数详情";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: SchemePeriodDetailsVO) => {
  reset();
  const _detailId = row?.detailId || ids.value[0]
  const res = await getSchemePeriodDetails(_detailId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改方案期数详情";
}

/** 提交按钮 */
const submitForm = () => {
  schemePeriodDetailsFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.detailId) {
        await updateSchemePeriodDetails(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addSchemePeriodDetails(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: SchemePeriodDetailsVO) => {
  const _detailIds = row?.detailId || ids.value;
  await proxy?.$modal.confirm('是否确认删除方案期数详情编号为"' + _detailIds + '"的数据项？').finally(() => loading.value = false);
  await delSchemePeriodDetails(_detailIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('biz/schemePeriodDetails/export', {
    ...queryParams.value
  }, `schemePeriodDetails_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
