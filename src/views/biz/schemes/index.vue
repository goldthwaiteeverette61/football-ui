<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="方案标题" prop="title">
              <el-input v-model="queryParams.title" placeholder="请输入方案标题" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="当前进行到第几期" prop="currentPeriodNumber">
              <el-input v-model="queryParams.currentPeriodNumber" placeholder="请输入当前进行到第几期" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="连续失败期数" prop="consecutiveLosses">
              <el-input v-model="queryParams.consecutiveLosses" placeholder="请输入连续失败期数" clearable
                @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="方案结束原因 (例如: won, max_loss_reached)" prop="reasonForEnding">
              <el-input v-model="queryParams.reasonForEnding" placeholder="请输入方案结束原因 (例如: won, max_loss_reached)"
                clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="创建时间" prop="createdAt">
              <el-date-picker clearable v-model="queryParams.createdAt" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择创建时间" />
            </el-form-item>
            <el-form-item label="更新时间" prop="updatedAt">
              <el-date-picker clearable v-model="queryParams.updatedAt" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择更新时间" />
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
              v-hasPermi="['biz:schemes:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()"
              v-hasPermi="['biz:schemes:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()"
              v-hasPermi="['biz:schemes:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport"
              v-hasPermi="['biz:schemes:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="schemesList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="schemeId" v-if="true" />
        <el-table-column label="方案发起人ID" align="center" prop="userId" />
        <el-table-column label="方案标题" align="center" prop="title" />
        <el-table-column label="方案状态: ongoing-进行中, ended-已结束" align="center" prop="status" />
        <el-table-column label="当前进行到第几期" align="center" prop="currentPeriodNumber" />
        <el-table-column label="连续失败期数" align="center" prop="consecutiveLosses" />
        <el-table-column label="方案结束原因 (例如: won, max_loss_reached)" align="center" prop="reasonForEnding" />
        <el-table-column label="创建时间" align="center" prop="createdAt" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createdAt, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center" prop="updatedAt" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.updatedAt, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                v-hasPermi="['biz:schemes:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                v-hasPermi="['biz:schemes:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改投注方案对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="schemesFormRef" :model="form" :rules="rules" label-width="80px">

        <el-form-item label="方案标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入方案标题 (例如: 张三的第5轮方案)" />
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

<script setup name="Schemes" lang="ts">
import { listSchemes, getSchemes, delSchemes, addSchemes, updateSchemes } from '@/api/biz/schemes';
import { SchemesVO, SchemesQuery, SchemesForm } from '@/api/biz/schemes/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const schemesList = ref<SchemesVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const schemesFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: SchemesForm = {
  schemeId: undefined,
  userId: undefined,
  title: undefined,
  status: undefined,
  currentPeriodNumber: undefined,
  consecutiveLosses: undefined,
  reasonForEnding: undefined,
  createdAt: undefined,
  updatedAt: undefined,
}
const data = reactive<PageData<SchemesForm, SchemesQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userId: undefined,
    title: undefined,
    status: undefined,
    currentPeriodNumber: undefined,
    consecutiveLosses: undefined,
    reasonForEnding: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    params: {
    }
  },
  rules: {
    schemeId: [
      { required: true, message: "方案ID, 主键不能为空", trigger: "blur" }
    ],
    userId: [
      { required: true, message: "方案发起人ID (关联 biz_users)不能为空", trigger: "blur" }
    ],
    title: [
      { required: true, message: "方案标题 (例如: 张三的第5轮方案)不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "方案状态: ongoing-进行中, ended-已结束不能为空", trigger: "change" }
    ],
    currentPeriodNumber: [
      { required: true, message: "当前进行到第几期不能为空", trigger: "blur" }
    ],
    consecutiveLosses: [
      { required: true, message: "连续失败期数不能为空", trigger: "blur" }
    ],
    createdAt: [
      { required: true, message: "创建时间不能为空", trigger: "blur" }
    ],
    updatedAt: [
      { required: true, message: "更新时间不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询投注方案列表 */
const getList = async () => {
  loading.value = true;
  const res = await listSchemes(queryParams.value);
  schemesList.value = res.rows;
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
  form.value = { ...initFormData };
  schemesFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: SchemesVO[]) => {
  ids.value = selection.map(item => item.schemeId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加投注方案";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: SchemesVO) => {
  reset();
  const _schemeId = row?.schemeId || ids.value[0]
  const res = await getSchemes(_schemeId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改投注方案";
}

/** 提交按钮 */
const submitForm = () => {
  schemesFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.schemeId) {
        await updateSchemes(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addSchemes(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: SchemesVO) => {
  const _schemeIds = row?.schemeId || ids.value;
  await proxy?.$modal.confirm('是否确认删除投注方案编号为"' + _schemeIds + '"的数据项？').finally(() => loading.value = false);
  await delSchemes(_schemeIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('biz/schemes/export', {
    ...queryParams.value
  }, `schemes_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
