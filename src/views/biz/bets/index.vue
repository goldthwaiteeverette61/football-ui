<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="用户ID (需要关联你的用户表)" prop="userId">
              <el-input v-model="queryParams.userId" placeholder="请输入用户ID (需要关联你的用户表)" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="投注的赔率项ID (关联 biz_odds.id)" prop="oddsId">
              <el-input v-model="queryParams.oddsId" placeholder="请输入投注的赔率项ID (关联 biz_odds.id)" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="投注金额" prop="betAmount">
              <el-input v-model="queryParams.betAmount" placeholder="请输入投注金额" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="创建时间" prop="createdAt">
              <el-date-picker clearable
                v-model="queryParams.createdAt"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择创建时间"
              />
            </el-form-item>
            <el-form-item label="结算时间" prop="settledAt">
              <el-date-picker clearable
                v-model="queryParams.settledAt"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择结算时间"
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['biz:bets:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['biz:bets:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['biz:bets:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['biz:bets:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="betsList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="注单ID, 主键" align="center" prop="betId" v-if="true" />
        <el-table-column label="用户ID (需要关联你的用户表)" align="center" prop="userId" />
        <el-table-column label="投注的赔率项ID (关联 biz_odds.id)" align="center" prop="oddsId" />
        <el-table-column label="投注金额" align="center" prop="betAmount" />
        <el-table-column label="注单状态" align="center" prop="status" />
        <el-table-column label="创建时间" align="center" prop="createdAt" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createdAt, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结算时间" align="center" prop="settledAt" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.settledAt, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['biz:bets:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['biz:bets:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改用户注单对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="betsFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户ID (需要关联你的用户表)" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户ID (需要关联你的用户表)" />
        </el-form-item>
        <el-form-item label="投注的赔率项ID (关联 biz_odds.id)" prop="oddsId">
          <el-input v-model="form.oddsId" placeholder="请输入投注的赔率项ID (关联 biz_odds.id)" />
        </el-form-item>
        <el-form-item label="投注金额" prop="betAmount">
          <el-input v-model="form.betAmount" placeholder="请输入投注金额" />
        </el-form-item>
        <el-form-item label="创建时间" prop="createdAt">
          <el-date-picker clearable
            v-model="form.createdAt"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结算时间" prop="settledAt">
          <el-date-picker clearable
            v-model="form.settledAt"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择结算时间">
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

<script setup name="Bets" lang="ts">
import { listBets, getBets, delBets, addBets, updateBets } from '@/api/biz/bets';
import { BetsVO, BetsQuery, BetsForm } from '@/api/biz/bets/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const betsList = ref<BetsVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const betsFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: BetsForm = {
  betId: undefined,
  userId: undefined,
  oddsId: undefined,
  betAmount: undefined,
  status: undefined,
  createdAt: undefined,
  settledAt: undefined
}
const data = reactive<PageData<BetsForm, BetsQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userId: undefined,
    oddsId: undefined,
    betAmount: undefined,
    status: undefined,
    createdAt: undefined,
    settledAt: undefined,
    params: {
    }
  },
  rules: {
    betId: [
      { required: true, message: "注单ID, 主键不能为空", trigger: "blur" }
    ],
    userId: [
      { required: true, message: "用户ID (需要关联你的用户表)不能为空", trigger: "blur" }
    ],
    oddsId: [
      { required: true, message: "投注的赔率项ID (关联 biz_odds.id)不能为空", trigger: "blur" }
    ],
    betAmount: [
      { required: true, message: "投注金额不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "注单状态不能为空", trigger: "change" }
    ],
    createdAt: [
      { required: true, message: "创建时间不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询用户注单列表 */
const getList = async () => {
  loading.value = true;
  const res = await listBets(queryParams.value);
  betsList.value = res.rows;
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
  betsFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: BetsVO[]) => {
  ids.value = selection.map(item => item.betId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加用户注单";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: BetsVO) => {
  reset();
  const _betId = row?.betId || ids.value[0]
  const res = await getBets(_betId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改用户注单";
}

/** 提交按钮 */
const submitForm = () => {
  betsFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.betId) {
        await updateBets(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addBets(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: BetsVO) => {
  const _betIds = row?.betId || ids.value;
  await proxy?.$modal.confirm('是否确认删除用户注单编号为"' + _betIds + '"的数据项？').finally(() => loading.value = false);
  await delBets(_betIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('biz/bets/export', {
    ...queryParams.value
  }, `bets_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
