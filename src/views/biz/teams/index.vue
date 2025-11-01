<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="球队全称 (来自JSON中的allHomeTeam/allAwayTeam)" prop="fullName">
              <el-input v-model="queryParams.fullName" placeholder="请输入球队全称 (来自JSON中的allHomeTeam/allAwayTeam)" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="球队简称 (来自JSON中的homeTeam/awayTeam)" prop="abbrName">
              <el-input v-model="queryParams.abbrName" placeholder="请输入球队简称 (来自JSON中的homeTeam/awayTeam)" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['biz:teams:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['biz:teams:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['biz:teams:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['biz:teams:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="teamsList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="球队ID (来自JSON中的homeTeamId/awayTeamId), 主键" align="center" prop="teamId" v-if="true" />
        <el-table-column label="球队全称 (来自JSON中的allHomeTeam/allAwayTeam)" align="center" prop="fullName" />
        <el-table-column label="球队简称 (来自JSON中的homeTeam/awayTeam)" align="center" prop="abbrName" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['biz:teams:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['biz:teams:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改球队信息对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="teamsFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="球队全称 (来自JSON中的allHomeTeam/allAwayTeam)" prop="fullName">
          <el-input v-model="form.fullName" placeholder="请输入球队全称 (来自JSON中的allHomeTeam/allAwayTeam)" />
        </el-form-item>
        <el-form-item label="球队简称 (来自JSON中的homeTeam/awayTeam)" prop="abbrName">
          <el-input v-model="form.abbrName" placeholder="请输入球队简称 (来自JSON中的homeTeam/awayTeam)" />
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

<script setup name="Teams" lang="ts">
import { listTeams, getTeams, delTeams, addTeams, updateTeams } from '@/api/biz/teams';
import { TeamsVO, TeamsQuery, TeamsForm } from '@/api/biz/teams/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const teamsList = ref<TeamsVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const teamsFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: TeamsForm = {
  teamId: undefined,
  fullName: undefined,
  abbrName: undefined,
}
const data = reactive<PageData<TeamsForm, TeamsQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    fullName: undefined,
    abbrName: undefined,
    params: {
    }
  },
  rules: {
    teamId: [
      { required: true, message: "球队ID (来自JSON中的homeTeamId/awayTeamId), 主键不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询球队信息列表 */
const getList = async () => {
  loading.value = true;
  const res = await listTeams(queryParams.value);
  teamsList.value = res.rows;
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
  teamsFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: TeamsVO[]) => {
  ids.value = selection.map(item => item.teamId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加球队信息";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: TeamsVO) => {
  reset();
  const _teamId = row?.teamId || ids.value[0]
  const res = await getTeams(_teamId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改球队信息";
}

/** 提交按钮 */
const submitForm = () => {
  teamsFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.teamId) {
        await updateTeams(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addTeams(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: TeamsVO) => {
  const _teamIds = row?.teamId || ids.value;
  await proxy?.$modal.confirm('是否确认删除球队信息编号为"' + _teamIds + '"的数据项？').finally(() => loading.value = false);
  await delTeams(_teamIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('biz/teams/export', {
    ...queryParams.value
  }, `teams_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
