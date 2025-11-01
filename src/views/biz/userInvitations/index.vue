<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="邀请人ID (关联 sys_user)" prop="inviterId">
              <el-input v-model="queryParams.inviterId" placeholder="请输入邀请人ID (关联 sys_user)" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="被邀请人ID (新注册的用户, 关联 sys_user)" prop="inviteeId">
              <el-input v-model="queryParams.inviteeId" placeholder="请输入被邀请人ID (新注册的用户, 关联 sys_user)" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="注册时使用的邀请码" prop="invitationCodeUsed">
              <el-input v-model="queryParams.invitationCodeUsed" placeholder="请输入注册时使用的邀请码" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['biz:userInvitations:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['biz:userInvitations:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['biz:userInvitations:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['biz:userInvitations:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="userInvitationsList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="邀请记录ID, 主键" align="center" prop="invitationId" v-if="true" />
        <el-table-column label="邀请人ID (关联 sys_user)" align="center" prop="inviterId" />
        <el-table-column label="被邀请人ID (新注册的用户, 关联 sys_user)" align="center" prop="inviteeId" />
        <el-table-column label="注册时使用的邀请码" align="center" prop="invitationCodeUsed" />
        <el-table-column label="邀请状态 (例如: registered-已注册, rewarded-已奖励)" align="center" prop="status" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['biz:userInvitations:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['biz:userInvitations:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改用户邀请记录对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="userInvitationsFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="邀请人ID (关联 sys_user)" prop="inviterId">
          <el-input v-model="form.inviterId" placeholder="请输入邀请人ID (关联 sys_user)" />
        </el-form-item>
        <el-form-item label="被邀请人ID (新注册的用户, 关联 sys_user)" prop="inviteeId">
          <el-input v-model="form.inviteeId" placeholder="请输入被邀请人ID (新注册的用户, 关联 sys_user)" />
        </el-form-item>
        <el-form-item label="注册时使用的邀请码" prop="invitationCodeUsed">
          <el-input v-model="form.invitationCodeUsed" placeholder="请输入注册时使用的邀请码" />
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

<script setup name="UserInvitations" lang="ts">
import { listUserInvitations, getUserInvitations, delUserInvitations, addUserInvitations, updateUserInvitations } from '@/api/biz/userInvitations';
import { UserInvitationsVO, UserInvitationsQuery, UserInvitationsForm } from '@/api/biz/userInvitations/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const userInvitationsList = ref<UserInvitationsVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const userInvitationsFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: UserInvitationsForm = {
  invitationId: undefined,
  inviterId: undefined,
  inviteeId: undefined,
  invitationCodeUsed: undefined,
  status: undefined,
}
const data = reactive<PageData<UserInvitationsForm, UserInvitationsQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    inviterId: undefined,
    inviteeId: undefined,
    invitationCodeUsed: undefined,
    status: undefined,
    params: {
    }
  },
  rules: {
    invitationId: [
      { required: true, message: "邀请记录ID, 主键不能为空", trigger: "blur" }
    ],
    inviterId: [
      { required: true, message: "邀请人ID (关联 sys_user)不能为空", trigger: "blur" }
    ],
    inviteeId: [
      { required: true, message: "被邀请人ID (新注册的用户, 关联 sys_user)不能为空", trigger: "blur" }
    ],
    invitationCodeUsed: [
      { required: true, message: "注册时使用的邀请码不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询用户邀请记录列表 */
const getList = async () => {
  loading.value = true;
  const res = await listUserInvitations(queryParams.value);
  userInvitationsList.value = res.rows;
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
  userInvitationsFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: UserInvitationsVO[]) => {
  ids.value = selection.map(item => item.invitationId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加用户邀请记录";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: UserInvitationsVO) => {
  reset();
  const _invitationId = row?.invitationId || ids.value[0]
  const res = await getUserInvitations(_invitationId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改用户邀请记录";
}

/** 提交按钮 */
const submitForm = () => {
  userInvitationsFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.invitationId) {
        await updateUserInvitations(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addUserInvitations(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: UserInvitationsVO) => {
  const _invitationIds = row?.invitationId || ids.value;
  await proxy?.$modal.confirm('是否确认删除用户邀请记录编号为"' + _invitationIds + '"的数据项？').finally(() => loading.value = false);
  await delUserInvitations(_invitationIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('biz/userInvitations/export', {
    ...queryParams.value
  }, `userInvitations_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
