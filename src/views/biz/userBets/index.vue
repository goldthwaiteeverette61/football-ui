<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="" prop="userId">
              <el-input v-model="queryParams.userId" placeholder="请输入" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="" prop="matchId">
              <el-input v-model="queryParams.matchId" placeholder="请输入" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="" prop="oddId">
              <el-input v-model="queryParams.oddId" placeholder="请输入" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="投注金额" prop="stake">
              <el-input v-model="queryParams.stake" placeholder="请输入投注金额" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="下注时的赔率" prop="oddsValue">
              <el-input v-model="queryParams.oddsValue" placeholder="请输入下注时的赔率" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="预计派彩金额" prop="potentialPayout">
              <el-input v-model="queryParams.potentialPayout" placeholder="请输入预计派彩金额" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="下注时间" prop="placedAt">
              <el-date-picker clearable
                v-model="queryParams.placedAt"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择下注时间"
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['biz:userBets:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['biz:userBets:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['biz:userBets:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['biz:userBets:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="userBetsList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="" align="center" prop="id" v-if="true" />
        <el-table-column label="" align="center" prop="userId" />
        <el-table-column label="" align="center" prop="matchId" />
        <el-table-column label="" align="center" prop="oddId" />
        <el-table-column label="投注金额" align="center" prop="stake" />
        <el-table-column label="下注时的赔率" align="center" prop="oddsValue" />
        <el-table-column label="预计派彩金额" align="center" prop="potentialPayout" />
        <el-table-column label="注单状态" align="center" prop="status" />
        <el-table-column label="下注时间" align="center" prop="placedAt" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.placedAt, '{y}-{m}-{d}') }}</span>
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
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['biz:userBets:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['biz:userBets:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改用户投注记录对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="userBetsFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="" prop="matchId">
          <el-input v-model="form.matchId" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="" prop="oddId">
          <el-input v-model="form.oddId" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="投注金额" prop="stake">
          <el-input v-model="form.stake" placeholder="请输入投注金额" />
        </el-form-item>
        <el-form-item label="下注时的赔率" prop="oddsValue">
          <el-input v-model="form.oddsValue" placeholder="请输入下注时的赔率" />
        </el-form-item>
        <el-form-item label="预计派彩金额" prop="potentialPayout">
          <el-input v-model="form.potentialPayout" placeholder="请输入预计派彩金额" />
        </el-form-item>
        <el-form-item label="下注时间" prop="placedAt">
          <el-date-picker clearable
            v-model="form.placedAt"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择下注时间">
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

<script setup name="UserBets" lang="ts">
import { listUserBets, getUserBets, delUserBets, addUserBets, updateUserBets } from '@/api/biz/userBets';
import { UserBetsVO, UserBetsQuery, UserBetsForm } from '@/api/biz/userBets/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const userBetsList = ref<UserBetsVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const userBetsFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: UserBetsForm = {
  id: undefined,
  userId: undefined,
  matchId: undefined,
  oddId: undefined,
  stake: undefined,
  oddsValue: undefined,
  potentialPayout: undefined,
  status: undefined,
  placedAt: undefined,
  settledAt: undefined,
}
const data = reactive<PageData<UserBetsForm, UserBetsQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userId: undefined,
    matchId: undefined,
    oddId: undefined,
    stake: undefined,
    oddsValue: undefined,
    potentialPayout: undefined,
    status: undefined,
    placedAt: undefined,
    settledAt: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "不能为空", trigger: "blur" }
    ],
    userId: [
      { required: true, message: "不能为空", trigger: "blur" }
    ],
    matchId: [
      { required: true, message: "不能为空", trigger: "blur" }
    ],
    oddId: [
      { required: true, message: "不能为空", trigger: "blur" }
    ],
    stake: [
      { required: true, message: "投注金额不能为空", trigger: "blur" }
    ],
    oddsValue: [
      { required: true, message: "下注时的赔率不能为空", trigger: "blur" }
    ],
    potentialPayout: [
      { required: true, message: "预计派彩金额不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "注单状态不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询用户投注记录列表 */
const getList = async () => {
  loading.value = true;
  const res = await listUserBets(queryParams.value);
  userBetsList.value = res.rows;
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
  userBetsFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: UserBetsVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加用户投注记录";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: UserBetsVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getUserBets(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改用户投注记录";
}

/** 提交按钮 */
const submitForm = () => {
  userBetsFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateUserBets(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addUserBets(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: UserBetsVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除用户投注记录编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delUserBets(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('biz/userBets/export', {
    ...queryParams.value
  }, `userBets_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
