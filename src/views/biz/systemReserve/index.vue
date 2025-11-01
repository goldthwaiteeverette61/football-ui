<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="来源ID (例如: biz_user_follows表的follow_id)" prop="sourceId">
              <el-input v-model="queryParams.sourceId" placeholder="请输入来源ID (例如: biz_user_follows表的follow_id)" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="关联的用户ID" prop="userId">
              <el-input v-model="queryParams.userId" placeholder="请输入关联的用户ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="本次存入的储备金金额 (佣金)" prop="amount">
              <el-input v-model="queryParams.amount" placeholder="请输入本次存入的储备金金额 (佣金)" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="当时的佣金率 (例如: 0.1000)" prop="commissionRate">
              <el-input v-model="queryParams.commissionRate" placeholder="请输入当时的佣金率 (例如: 0.1000)" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="用户原始应得奖金 (扣除佣金前)" prop="originalPayout">
              <el-input v-model="queryParams.originalPayout" placeholder="请输入用户原始应得奖金 (扣除佣金前)" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['biz:systemReserve:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['biz:systemReserve:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['biz:systemReserve:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['biz:systemReserve:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="systemReserveList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="储备金记录ID" align="center" prop="reserveId" v-if="true" />
        <el-table-column label="来源类型 (例如: scheme_payout_commission)" align="center" prop="sourceType" />
        <el-table-column label="来源ID (例如: biz_user_follows表的follow_id)" align="center" prop="sourceId" />
        <el-table-column label="关联的用户ID" align="center" prop="userId" />
        <el-table-column label="本次存入的储备金金额 (佣金)" align="center" prop="amount" />
        <el-table-column label="当时的佣金率 (例如: 0.1000)" align="center" prop="commissionRate" />
        <el-table-column label="用户原始应得奖金 (扣除佣金前)" align="center" prop="originalPayout" />
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['biz:systemReserve:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['biz:systemReserve:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改系统储备金明细对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="systemReserveFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="来源ID (例如: biz_user_follows表的follow_id)" prop="sourceId">
          <el-input v-model="form.sourceId" placeholder="请输入来源ID (例如: biz_user_follows表的follow_id)" />
        </el-form-item>
        <el-form-item label="关联的用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入关联的用户ID" />
        </el-form-item>
        <el-form-item label="本次存入的储备金金额 (佣金)" prop="amount">
          <el-input v-model="form.amount" placeholder="请输入本次存入的储备金金额 (佣金)" />
        </el-form-item>
        <el-form-item label="当时的佣金率 (例如: 0.1000)" prop="commissionRate">
          <el-input v-model="form.commissionRate" placeholder="请输入当时的佣金率 (例如: 0.1000)" />
        </el-form-item>
        <el-form-item label="用户原始应得奖金 (扣除佣金前)" prop="originalPayout">
          <el-input v-model="form.originalPayout" placeholder="请输入用户原始应得奖金 (扣除佣金前)" />
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

<script setup name="SystemReserve" lang="ts">
import { listSystemReserve, getSystemReserve, delSystemReserve, addSystemReserve, updateSystemReserve } from '@/api/biz/systemReserve';
import { SystemReserveVO, SystemReserveQuery, SystemReserveForm } from '@/api/biz/systemReserve/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const systemReserveList = ref<SystemReserveVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const systemReserveFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: SystemReserveForm = {
  reserveId: undefined,
  sourceType: undefined,
  sourceId: undefined,
  userId: undefined,
  amount: undefined,
  commissionRate: undefined,
  originalPayout: undefined,
  remark: undefined
}
const data = reactive<PageData<SystemReserveForm, SystemReserveQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    sourceType: undefined,
    sourceId: undefined,
    userId: undefined,
    amount: undefined,
    commissionRate: undefined,
    originalPayout: undefined,
    params: {
    }
  },
  rules: {
    reserveId: [
      { required: true, message: "储备金记录ID不能为空", trigger: "blur" }
    ],
    sourceType: [
      { required: true, message: "来源类型 (例如: scheme_payout_commission)不能为空", trigger: "change" }
    ],
    sourceId: [
      { required: true, message: "来源ID (例如: biz_user_follows表的follow_id)不能为空", trigger: "blur" }
    ],
    userId: [
      { required: true, message: "关联的用户ID不能为空", trigger: "blur" }
    ],
    amount: [
      { required: true, message: "本次存入的储备金金额 (佣金)不能为空", trigger: "blur" }
    ],
    commissionRate: [
      { required: true, message: "当时的佣金率 (例如: 0.1000)不能为空", trigger: "blur" }
    ],
    originalPayout: [
      { required: true, message: "用户原始应得奖金 (扣除佣金前)不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询系统储备金明细列表 */
const getList = async () => {
  loading.value = true;
  const res = await listSystemReserve(queryParams.value);
  systemReserveList.value = res.rows;
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
  systemReserveFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: SystemReserveVO[]) => {
  ids.value = selection.map(item => item.reserveId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加系统储备金明细";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: SystemReserveVO) => {
  reset();
  const _reserveId = row?.reserveId || ids.value[0]
  const res = await getSystemReserve(_reserveId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改系统储备金明细";
}

/** 提交按钮 */
const submitForm = () => {
  systemReserveFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.reserveId) {
        await updateSystemReserve(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addSystemReserve(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: SystemReserveVO) => {
  const _reserveIds = row?.reserveId || ids.value;
  await proxy?.$modal.confirm('是否确认删除系统储备金明细编号为"' + _reserveIds + '"的数据项？').finally(() => loading.value = false);
  await delSystemReserve(_reserveIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('biz/systemReserve/export', {
    ...queryParams.value
  }, `systemReserve_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
