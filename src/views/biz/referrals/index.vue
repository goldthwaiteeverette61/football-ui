<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="推荐人ID" prop="referrerUserId">
              <el-input v-model="queryParams.referrerUserId" placeholder="请输入推荐人ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="被推荐人ID" prop="referredUserId">
              <el-input v-model="queryParams.referredUserId" placeholder="请输入被推荐人ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="是否已发放奖励" prop="bonusAwarded">
              <el-input v-model="queryParams.bonusAwarded" placeholder="请输入是否已发放奖励" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="" prop="createdAt">
              <el-date-picker clearable
                v-model="queryParams.createdAt"
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['biz:referrals:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['biz:referrals:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['biz:referrals:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['biz:referrals:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="referralsList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="" align="center" prop="id" v-if="true" />
        <el-table-column label="推荐人ID" align="center" prop="referrerUserId" />
        <el-table-column label="被推荐人ID" align="center" prop="referredUserId" />
        <el-table-column label="状态(例如被推荐人完成首次存款或投注后变为completed)" align="center" prop="status" />
        <el-table-column label="是否已发放奖励" align="center" prop="bonusAwarded" />
        <el-table-column label="" align="center" prop="createdAt" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createdAt, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['biz:referrals:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['biz:referrals:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改好友推荐关系对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="referralsFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="推荐人ID" prop="referrerUserId">
          <el-input v-model="form.referrerUserId" placeholder="请输入推荐人ID" />
        </el-form-item>
        <el-form-item label="被推荐人ID" prop="referredUserId">
          <el-input v-model="form.referredUserId" placeholder="请输入被推荐人ID" />
        </el-form-item>
        <el-form-item label="是否已发放奖励" prop="bonusAwarded">
          <el-input v-model="form.bonusAwarded" placeholder="请输入是否已发放奖励" />
        </el-form-item>
        <el-form-item label="" prop="createdAt">
          <el-date-picker clearable
            v-model="form.createdAt"
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

<script setup name="Referrals" lang="ts">
import { listReferrals, getReferrals, delReferrals, addReferrals, updateReferrals } from '@/api/biz/referrals';
import { ReferralsVO, ReferralsQuery, ReferralsForm } from '@/api/biz/referrals/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const referralsList = ref<ReferralsVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const referralsFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: ReferralsForm = {
  id: undefined,
  referrerUserId: undefined,
  referredUserId: undefined,
  status: undefined,
  bonusAwarded: undefined,
  createdAt: undefined,
}
const data = reactive<PageData<ReferralsForm, ReferralsQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    referrerUserId: undefined,
    referredUserId: undefined,
    status: undefined,
    bonusAwarded: undefined,
    createdAt: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "不能为空", trigger: "blur" }
    ],
    referrerUserId: [
      { required: true, message: "推荐人ID不能为空", trigger: "blur" }
    ],
    referredUserId: [
      { required: true, message: "被推荐人ID不能为空", trigger: "blur" }
    ],
    bonusAwarded: [
      { required: true, message: "是否已发放奖励不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询好友推荐关系列表 */
const getList = async () => {
  loading.value = true;
  const res = await listReferrals(queryParams.value);
  referralsList.value = res.rows;
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
  referralsFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: ReferralsVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加好友推荐关系";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: ReferralsVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getReferrals(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改好友推荐关系";
}

/** 提交按钮 */
const submitForm = () => {
  referralsFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateReferrals(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addReferrals(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: ReferralsVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除好友推荐关系编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delReferrals(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('biz/referrals/export', {
    ...queryParams.value
  }, `referrals_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
