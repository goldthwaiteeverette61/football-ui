<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="唯一的邀请码" prop="invitationCode">
              <el-input v-model="queryParams.invitationCode" placeholder="请输入唯一的邀请码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="被分配的用户ID (关联 sys_user)" prop="assigneeUserId">
              <el-input v-model="queryParams.assigneeUserId" placeholder="请输入被分配的用户ID (关联 sys_user)" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="分配时间" prop="assignTime">
              <el-date-picker clearable
                v-model="queryParams.assignTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择分配时间"
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['biz:invitationCodes:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['biz:invitationCodes:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['biz:invitationCodes:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['biz:invitationCodes:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="invitationCodesList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="邀请码ID, 主键" align="center" prop="codeId" v-if="true" />
        <el-table-column label="唯一的邀请码" align="center" prop="invitationCode" />
        <el-table-column label="状态 (available-可用, assigned-已分配)" align="center" prop="status" />
        <el-table-column label="被分配的用户ID (关联 sys_user)" align="center" prop="assigneeUserId" />
        <el-table-column label="分配时间" align="center" prop="assignTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.assignTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['biz:invitationCodes:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['biz:invitationCodes:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改预生成邀请码池对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="invitationCodesFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="唯一的邀请码" prop="invitationCode">
          <el-input v-model="form.invitationCode" placeholder="请输入唯一的邀请码" />
        </el-form-item>
        <el-form-item label="被分配的用户ID (关联 sys_user)" prop="assigneeUserId">
          <el-input v-model="form.assigneeUserId" placeholder="请输入被分配的用户ID (关联 sys_user)" />
        </el-form-item>
        <el-form-item label="分配时间" prop="assignTime">
          <el-date-picker clearable
            v-model="form.assignTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择分配时间">
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

<script setup name="InvitationCodes" lang="ts">
import { listInvitationCodes, getInvitationCodes, delInvitationCodes, addInvitationCodes, updateInvitationCodes } from '@/api/biz/invitationCodes';
import { InvitationCodesVO, InvitationCodesQuery, InvitationCodesForm } from '@/api/biz/invitationCodes/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const invitationCodesList = ref<InvitationCodesVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const invitationCodesFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: InvitationCodesForm = {
  codeId: undefined,
  invitationCode: undefined,
  status: undefined,
  assigneeUserId: undefined,
  assignTime: undefined,
}
const data = reactive<PageData<InvitationCodesForm, InvitationCodesQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    invitationCode: undefined,
    status: undefined,
    assigneeUserId: undefined,
    assignTime: undefined,
    params: {
    }
  },
  rules: {
    codeId: [
      { required: true, message: "邀请码ID, 主键不能为空", trigger: "blur" }
    ],
    invitationCode: [
      { required: true, message: "唯一的邀请码不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "状态 (available-可用, assigned-已分配)不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询预生成邀请码池列表 */
const getList = async () => {
  loading.value = true;
  const res = await listInvitationCodes(queryParams.value);
  invitationCodesList.value = res.rows;
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
  invitationCodesFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: InvitationCodesVO[]) => {
  ids.value = selection.map(item => item.codeId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加预生成邀请码池";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: InvitationCodesVO) => {
  reset();
  const _codeId = row?.codeId || ids.value[0]
  const res = await getInvitationCodes(_codeId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改预生成邀请码池";
}

/** 提交按钮 */
const submitForm = () => {
  invitationCodesFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.codeId) {
        await updateInvitationCodes(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addInvitationCodes(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: InvitationCodesVO) => {
  const _codeIds = row?.codeId || ids.value;
  await proxy?.$modal.confirm('是否确认删除预生成邀请码池编号为"' + _codeIds + '"的数据项？').finally(() => loading.value = false);
  await delInvitationCodes(_codeIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('biz/invitationCodes/export', {
    ...queryParams.value
  }, `invitationCodes_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
