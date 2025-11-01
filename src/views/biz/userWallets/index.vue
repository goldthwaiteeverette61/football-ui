<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="用户ID (关联 sys_user.user_id)" prop="userId">
              <el-input v-model="queryParams.userId" placeholder="请输入用户ID (关联 sys_user.user_id)" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="TRON地址 (Base58格式)" prop="address">
              <el-input v-model="queryParams.address" placeholder="请输入TRON地址 (Base58格式)" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="加密后的私钥 (如果由系统生成)" prop="privateKeyEncrypted">
              <el-input v-model="queryParams.privateKeyEncrypted" placeholder="请输入加密后的私钥 (如果由系统生成)" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="创建时间" prop="createdAt">
              <el-date-picker clearable
                v-model="queryParams.createdAt"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择创建时间"
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['biz:userWallets:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['biz:userWallets:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['biz:userWallets:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['biz:userWallets:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="userWalletsList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="钱包ID, 主键" align="center" prop="walletId" v-if="true" />
        <el-table-column label="用户" align="center" prop="userName" />
        <el-table-column label="用户ID" align="center" prop="userId" />
        <el-table-column label="TRON地址 (Base58格式)" align="center" prop="address" />
        <el-table-column label="加密后的私钥 (如果由系统生成)" align="center" prop="privateKeyEncrypted" />
        <el-table-column label="创建时间" align="center" prop="createdAt" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['biz:userWallets:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['biz:userWallets:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改用户钱包地址对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="userWalletsFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户ID (关联 sys_user.user_id)" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户ID (关联 sys_user.user_id)" />
        </el-form-item>
        <el-form-item label="TRON地址 (Base58格式)" prop="address">
          <el-input v-model="form.address" placeholder="请输入TRON地址 (Base58格式)" />
        </el-form-item>
        <el-form-item label="加密后的私钥 (如果由系统生成)" prop="privateKeyEncrypted">
          <el-input v-model="form.privateKeyEncrypted" placeholder="请输入加密后的私钥 (如果由系统生成)" />
        </el-form-item>
        <el-form-item label="创建时间" prop="createdAt">
          <el-date-picker clearable
            v-model="form.createdAt"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择创建时间">
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

<script setup name="UserWallets" lang="ts">
import { listUserWallets, getUserWallets, delUserWallets, addUserWallets, updateUserWallets } from '@/api/biz/userWallets';
import { UserWalletsVO, UserWalletsQuery, UserWalletsForm } from '@/api/biz/userWallets/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const userWalletsList = ref<UserWalletsVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const userWalletsFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: UserWalletsForm = {
  walletId: undefined,
  userId: undefined,
  address: undefined,
  privateKeyEncrypted: undefined,
  createdAt: undefined
}
const data = reactive<PageData<UserWalletsForm, UserWalletsQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userId: undefined,
    address: undefined,
    privateKeyEncrypted: undefined,
    createdAt: undefined,
    params: {
    }
  },
  rules: {
    walletId: [
      { required: true, message: "钱包ID, 主键不能为空", trigger: "blur" }
    ],
    userId: [
      { required: true, message: "用户ID (关联 sys_user.user_id)不能为空", trigger: "blur" }
    ],
    address: [
      { required: true, message: "TRON地址 (Base58格式)不能为空", trigger: "blur" }
    ],
    createdAt: [
      { required: true, message: "创建时间不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询用户钱包地址列表 */
const getList = async () => {
  loading.value = true;
  const res = await listUserWallets(queryParams.value);
  userWalletsList.value = res.rows;
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
  userWalletsFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: UserWalletsVO[]) => {
  ids.value = selection.map(item => item.walletId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加用户钱包地址";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: UserWalletsVO) => {
  reset();
  const _walletId = row?.walletId || ids.value[0]
  const res = await getUserWallets(_walletId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改用户钱包地址";
}

/** 提交按钮 */
const submitForm = () => {
  userWalletsFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.walletId) {
        await updateUserWallets(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addUserWallets(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: UserWalletsVO) => {
  const _walletIds = row?.walletId || ids.value;
  await proxy?.$modal.confirm('是否确认删除用户钱包地址编号为"' + _walletIds + '"的数据项？').finally(() => loading.value = false);
  await delUserWallets(_walletIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('biz/userWallets/export', {
    ...queryParams.value
  }, `userWallets_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
