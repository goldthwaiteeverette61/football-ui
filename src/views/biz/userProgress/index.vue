<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="关联的用户ID (sys_user.user_id)" prop="userId">
              <el-input v-model="queryParams.userId" placeholder="请输入关联的用户ID (sys_user.user_id)" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="当前的连续失败次数，默认为 0" prop="consecutiveLosses">
              <el-input v-model="queryParams.consecutiveLosses" placeholder="请输入当前的连续失败次数，默认为 0" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['biz:userProgress:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['biz:userProgress:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['biz:userProgress:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['biz:userProgress:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="userProgressList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="进度记录的唯一ID, 主键" align="center" prop="progressId" v-if="true" />
        <el-table-column label="关联的用户ID (sys_user.user_id)" align="center" prop="userId" />
        <el-table-column label="当前的连续失败次数，默认为 0" align="center" prop="consecutiveLosses" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['biz:userProgress:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['biz:userProgress:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改用户跟投进度对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="userProgressFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="关联的用户ID (sys_user.user_id)" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入关联的用户ID (sys_user.user_id)" />
        </el-form-item>
        <el-form-item label="当前的连续失败次数，默认为 0" prop="consecutiveLosses">
          <el-input v-model="form.consecutiveLosses" placeholder="请输入当前的连续失败次数，默认为 0" />
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

<script setup name="UserProgress" lang="ts">
import { listUserProgress, getUserProgress, delUserProgress, addUserProgress, updateUserProgress } from '@/api/biz/userProgress';
import { UserProgressVO, UserProgressQuery, UserProgressForm } from '@/api/biz/userProgress/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const userProgressList = ref<UserProgressVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const userProgressFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: UserProgressForm = {
  progressId: undefined,
  userId: undefined,
  consecutiveLosses: undefined,
}
const data = reactive<PageData<UserProgressForm, UserProgressQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userId: undefined,
    consecutiveLosses: undefined,
    params: {
    }
  },
  rules: {
    progressId: [
      { required: true, message: "进度记录的唯一ID, 主键不能为空", trigger: "blur" }
    ],
    userId: [
      { required: true, message: "关联的用户ID (sys_user.user_id)不能为空", trigger: "blur" }
    ],
    consecutiveLosses: [
      { required: true, message: "当前的连续失败次数，默认为 0不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询用户跟投进度列表 */
const getList = async () => {
  loading.value = true;
  const res = await listUserProgress(queryParams.value);
  userProgressList.value = res.rows;
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
  userProgressFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: UserProgressVO[]) => {
  ids.value = selection.map(item => item.progressId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加用户跟投进度";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: UserProgressVO) => {
  reset();
  const _progressId = row?.progressId || ids.value[0]
  const res = await getUserProgress(_progressId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改用户跟投进度";
}

/** 提交按钮 */
const submitForm = () => {
  userProgressFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.progressId) {
        await updateUserProgress(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addUserProgress(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: UserProgressVO) => {
  const _progressIds = row?.progressId || ids.value;
  await proxy?.$modal.confirm('是否确认删除用户跟投进度编号为"' + _progressIds + '"的数据项？').finally(() => loading.value = false);
  await delUserProgress(_progressIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('biz/userProgress/export', {
    ...queryParams.value
  }, `userProgress_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
