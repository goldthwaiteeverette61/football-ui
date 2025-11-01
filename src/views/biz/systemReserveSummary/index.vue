<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="系统储备金总额" prop="totalReserveAmount">
              <el-input v-model="queryParams.totalReserveAmount" placeholder="请输入系统储备金总额" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="最后一次计算汇总的时间" prop="lastCalculationTime">
              <el-date-picker clearable
                v-model="queryParams.lastCalculationTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择最后一次计算汇总的时间"
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['biz:systemReserveSummary:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['biz:systemReserveSummary:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['biz:systemReserveSummary:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['biz:systemReserveSummary:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="systemReserveSummaryList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="汇总ID (主键)" align="center" prop="summaryId" v-if="true" />
        <el-table-column label="系统储备金总额" align="center" prop="totalReserveAmount" />
        <el-table-column label="最后一次计算汇总的时间" align="center" prop="lastCalculationTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.lastCalculationTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['biz:systemReserveSummary:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['biz:systemReserveSummary:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改系统储备金汇总对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="systemReserveSummaryFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="系统储备金总额" prop="totalReserveAmount">
          <el-input v-model="form.totalReserveAmount" placeholder="请输入系统储备金总额" />
        </el-form-item>
        <el-form-item label="最后一次计算汇总的时间" prop="lastCalculationTime">
          <el-date-picker clearable
            v-model="form.lastCalculationTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择最后一次计算汇总的时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
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

<script setup name="SystemReserveSummary" lang="ts">
import { listSystemReserveSummary, getSystemReserveSummary, delSystemReserveSummary, addSystemReserveSummary, updateSystemReserveSummary } from '@/api/biz/systemReserveSummary';
import { SystemReserveSummaryVO, SystemReserveSummaryQuery, SystemReserveSummaryForm } from '@/api/biz/systemReserveSummary/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const systemReserveSummaryList = ref<SystemReserveSummaryVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const systemReserveSummaryFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: SystemReserveSummaryForm = {
  summaryId: undefined,
  totalReserveAmount: undefined,
  lastCalculationTime: undefined,
  remark: undefined
}
const data = reactive<PageData<SystemReserveSummaryForm, SystemReserveSummaryQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    totalReserveAmount: undefined,
    lastCalculationTime: undefined,
    params: {
    }
  },
  rules: {
    summaryId: [
      { required: true, message: "汇总ID (主键)不能为空", trigger: "blur" }
    ],
    totalReserveAmount: [
      { required: true, message: "系统储备金总额不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询系统储备金汇总列表 */
const getList = async () => {
  loading.value = true;
  const res = await listSystemReserveSummary(queryParams.value);
  systemReserveSummaryList.value = res.rows;
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
  systemReserveSummaryFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: SystemReserveSummaryVO[]) => {
  ids.value = selection.map(item => item.summaryId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加系统储备金汇总";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: SystemReserveSummaryVO) => {
  reset();
  const _summaryId = row?.summaryId || ids.value[0]
  const res = await getSystemReserveSummary(_summaryId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改系统储备金汇总";
}

/** 提交按钮 */
const submitForm = () => {
  systemReserveSummaryFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.summaryId) {
        await updateSystemReserveSummary(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addSystemReserveSummary(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: SystemReserveSummaryVO) => {
  const _summaryIds = row?.summaryId || ids.value;
  await proxy?.$modal.confirm('是否确认删除系统储备金汇总编号为"' + _summaryIds + '"的数据项？').finally(() => loading.value = false);
  await delSystemReserveSummary(_summaryIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('biz/systemReserveSummary/export', {
    ...queryParams.value
  }, `systemReserveSummary_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
