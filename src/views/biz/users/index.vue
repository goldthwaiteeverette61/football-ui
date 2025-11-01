<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="用户名，如 @ethan.carter" prop="username">
              <el-input v-model="queryParams.username" placeholder="请输入用户名，如 @ethan.carter" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="queryParams.email" placeholder="请输入邮箱" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="加密后的密码" prop="passwordHash">
              <el-input v-model="queryParams.passwordHash" placeholder="请输入加密后的密码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="全名，如 Ethan Carter" prop="fullName">
              <el-input v-model="queryParams.fullName" placeholder="请输入全名，如 Ethan Carter" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="头像图片链接" prop="profilePictureUrl">
              <el-input v-model="queryParams.profilePictureUrl" placeholder="请输入头像图片链接" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="账户余额 (以USDT计价)" prop="balance">
              <el-input v-model="queryParams.balance" placeholder="请输入账户余额 (以USDT计价)" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="用户的专属推荐码" prop="referralCode">
              <el-input v-model="queryParams.referralCode" placeholder="请输入用户的专属推荐码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="推荐该用户的用户ID" prop="referredByUserId">
              <el-input v-model="queryParams.referredByUserId" placeholder="请输入推荐该用户的用户ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="" prop="createdAt">
              <el-date-picker clearable
                v-model="queryParams.createdAt"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择"
              />
            </el-form-item>
            <el-form-item label="" prop="updatedAt">
              <el-date-picker clearable
                v-model="queryParams.updatedAt"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择"
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['biz:users:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['biz:users:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['biz:users:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['biz:users:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="usersList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="" align="center" prop="id" v-if="true" />
        <el-table-column label="用户名，如 @ethan.carter" align="center" prop="username" />
        <el-table-column label="邮箱" align="center" prop="email" />
        <el-table-column label="加密后的密码" align="center" prop="passwordHash" />
        <el-table-column label="全名，如 Ethan Carter" align="center" prop="fullName" />
        <el-table-column label="头像图片链接" align="center" prop="profilePictureUrl" />
        <el-table-column label="账户余额 (以USDT计价)" align="center" prop="balance" />
        <el-table-column label="用户的专属推荐码" align="center" prop="referralCode" />
        <el-table-column label="推荐该用户的用户ID" align="center" prop="referredByUserId" />
        <el-table-column label="" align="center" prop="createdAt" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createdAt, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="" align="center" prop="updatedAt" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.updatedAt, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['biz:users:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['biz:users:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改用户信息对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="usersFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名，如 @ethan.carter" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名，如 @ethan.carter" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="加密后的密码" prop="passwordHash">
          <el-input v-model="form.passwordHash" placeholder="请输入加密后的密码" />
        </el-form-item>
        <el-form-item label="全名，如 Ethan Carter" prop="fullName">
          <el-input v-model="form.fullName" placeholder="请输入全名，如 Ethan Carter" />
        </el-form-item>
        <el-form-item label="头像图片链接" prop="profilePictureUrl">
          <el-input v-model="form.profilePictureUrl" placeholder="请输入头像图片链接" />
        </el-form-item>
        <el-form-item label="账户余额 (以USDT计价)" prop="balance">
          <el-input v-model="form.balance" placeholder="请输入账户余额 (以USDT计价)" />
        </el-form-item>
        <el-form-item label="用户的专属推荐码" prop="referralCode">
          <el-input v-model="form.referralCode" placeholder="请输入用户的专属推荐码" />
        </el-form-item>
        <el-form-item label="推荐该用户的用户ID" prop="referredByUserId">
          <el-input v-model="form.referredByUserId" placeholder="请输入推荐该用户的用户ID" />
        </el-form-item>
        <el-form-item label="" prop="createdAt">
          <el-date-picker clearable
            v-model="form.createdAt"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="" prop="updatedAt">
          <el-date-picker clearable
            v-model="form.updatedAt"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择">
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

<script setup name="Users" lang="ts">
import { listUsers, getUsers, delUsers, addUsers, updateUsers } from '@/api/biz/users';
import { UsersVO, UsersQuery, UsersForm } from '@/api/biz/users/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const usersList = ref<UsersVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const usersFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: UsersForm = {
  id: undefined,
  username: undefined,
  email: undefined,
  passwordHash: undefined,
  fullName: undefined,
  profilePictureUrl: undefined,
  balance: undefined,
  referralCode: undefined,
  referredByUserId: undefined,
  createdAt: undefined,
  updatedAt: undefined,
}
const data = reactive<PageData<UsersForm, UsersQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    username: undefined,
    email: undefined,
    passwordHash: undefined,
    fullName: undefined,
    profilePictureUrl: undefined,
    balance: undefined,
    referralCode: undefined,
    referredByUserId: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "不能为空", trigger: "blur" }
    ],
    username: [
      { required: true, message: "用户名，如 @ethan.carter不能为空", trigger: "blur" }
    ],
    email: [
      { required: true, message: "邮箱不能为空", trigger: "blur" }
    ],
    passwordHash: [
      { required: true, message: "加密后的密码不能为空", trigger: "blur" }
    ],
    balance: [
      { required: true, message: "账户余额 (以USDT计价)不能为空", trigger: "blur" }
    ],
    referralCode: [
      { required: true, message: "用户的专属推荐码不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询用户信息列表 */
const getList = async () => {
  loading.value = true;
  const res = await listUsers(queryParams.value);
  usersList.value = res.rows;
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
  usersFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: UsersVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加用户信息";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: UsersVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getUsers(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改用户信息";
}

/** 提交按钮 */
const submitForm = () => {
  usersFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateUsers(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addUsers(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: UsersVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除用户信息编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delUsers(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('biz/users/export', {
    ...queryParams.value
  }, `users_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
