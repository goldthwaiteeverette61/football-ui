<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
    
            <el-form-item label="钱包地址" prop="walletAddress">
              <el-input v-model="queryParams.walletAddress" placeholder="请输入钱包地址" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['biz:depositWallets:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['biz:depositWallets:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['biz:depositWallets:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['biz:depositWallets:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="depositWalletsList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" align="center" prop="walletId" v-if="true" />
        <el-table-column label="余额" align="center" prop="balance" />
        <el-table-column label="钱包地址" align="center" prop="walletAddress" />
        <el-table-column label="状态 (active, inactive)" align="center" prop="status" />
        <el-table-column label="二维码图片URL" align="center" prop="qrCodeUrl" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['biz:depositWallets:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['biz:depositWallets:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改平台充值钱包对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="depositWalletsFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="钱包名称" prop="walletName">
          <el-input v-model="form.walletName" placeholder="请输入钱包名称" />
        </el-form-item>
        <el-form-item label="钱包地址" prop="walletAddress">
          <el-input v-model="form.walletAddress" placeholder="请输入钱包地址" />
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

<script setup name="DepositWallets" lang="ts">
import { listDepositWallets, getDepositWallets, delDepositWallets, addDepositWallets, updateDepositWallets } from '@/api/biz/depositWallets';
import { DepositWalletsVO, DepositWalletsQuery, DepositWalletsForm } from '@/api/biz/depositWallets/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const depositWalletsList = ref<DepositWalletsVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const depositWalletsFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: DepositWalletsForm = {
  walletId: undefined,
  walletName: undefined,
  walletAddress: undefined,
  status: undefined,
  qrCodeUrl: undefined,
}
const data = reactive<PageData<DepositWalletsForm, DepositWalletsQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    walletName: undefined,
    walletAddress: undefined,
    status: undefined,
    qrCodeUrl: undefined,
    params: {
    }
  },
  rules: {
    walletId: [
      { required: true, message: "充值钱包ID, 主键不能为空", trigger: "blur" }
    ],
    walletName: [
      { required: true, message: "钱包名称不能为空", trigger: "blur" }
    ],
    walletAddress: [
      { required: true, message: "钱包地址不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "状态 (active, inactive)不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询平台充值钱包列表 */
const getList = async () => {
  loading.value = true;
  const res = await listDepositWallets(queryParams.value);
  depositWalletsList.value = res.rows;
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
  depositWalletsFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: DepositWalletsVO[]) => {
  ids.value = selection.map(item => item.walletId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加平台充值钱包";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: DepositWalletsVO) => {
  reset();
  const _walletId = row?.walletId || ids.value[0]
  const res = await getDepositWallets(_walletId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改平台充值钱包";
}

/** 提交按钮 */
const submitForm = () => {
  depositWalletsFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.walletId) {
        await updateDepositWallets(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addDepositWallets(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: DepositWalletsVO) => {
  const _walletIds = row?.walletId || ids.value;
  await proxy?.$modal.confirm('是否确认删除平台充值钱包编号为"' + _walletIds + '"的数据项？').finally(() => loading.value = false);
  await delDepositWallets(_walletIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('biz/depositWallets/export', {
    ...queryParams.value
  }, `depositWallets_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
