<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="联赛全称 (来自JSON中的leagueAllName)" prop="name">
              <el-input v-model="queryParams.name" placeholder="请输入联赛全称 (来自JSON中的leagueAllName)" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="球队简称" prop="abbrName">
              <el-input v-model="queryParams.abbrName" placeholder="请输入球队简称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="联赛背景颜色 (来自JSON中的leagueBackColor)" prop="backColor">
              <el-input v-model="queryParams.backColor" placeholder="请输入联赛背景颜色 (来自JSON中的leagueBackColor)" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['biz:leagues:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['biz:leagues:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['biz:leagues:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['biz:leagues:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="leaguesList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="联赛ID (来自JSON中的leagueId), 主键" align="center" prop="leagueId" v-if="true" />
        <el-table-column label="联赛全称 (来自JSON中的leagueAllName)" align="center" prop="name" />
        <el-table-column label="球队简称" align="center" prop="abbrName" />
        <el-table-column label="联赛背景颜色 (来自JSON中的leagueBackColor)" align="center" prop="backColor" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['biz:leagues:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['biz:leagues:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改联赛信息对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="leaguesFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="联赛全称 (来自JSON中的leagueAllName)" prop="name">
          <el-input v-model="form.name" placeholder="请输入联赛全称 (来自JSON中的leagueAllName)" />
        </el-form-item>
        <el-form-item label="球队简称" prop="abbrName">
          <el-input v-model="form.abbrName" placeholder="请输入球队简称" />
        </el-form-item>
        <el-form-item label="联赛背景颜色 (来自JSON中的leagueBackColor)" prop="backColor">
          <el-input v-model="form.backColor" placeholder="请输入联赛背景颜色 (来自JSON中的leagueBackColor)" />
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

<script setup name="Leagues" lang="ts">
import { listLeagues, getLeagues, delLeagues, addLeagues, updateLeagues } from '@/api/biz/leagues';
import { LeaguesVO, LeaguesQuery, LeaguesForm } from '@/api/biz/leagues/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const leaguesList = ref<LeaguesVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const leaguesFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: LeaguesForm = {
  leagueId: undefined,
  name: undefined,
  abbrName: undefined,
  backColor: undefined,
}
const data = reactive<PageData<LeaguesForm, LeaguesQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: undefined,
    abbrName: undefined,
    backColor: undefined,
    params: {
    }
  },
  rules: {
    leagueId: [
      { required: true, message: "联赛ID (来自JSON中的leagueId), 主键不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询联赛信息列表 */
const getList = async () => {
  loading.value = true;
  const res = await listLeagues(queryParams.value);
  leaguesList.value = res.rows;
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
  leaguesFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: LeaguesVO[]) => {
  ids.value = selection.map(item => item.leagueId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加联赛信息";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: LeaguesVO) => {
  reset();
  const _leagueId = row?.leagueId || ids.value[0]
  const res = await getLeagues(_leagueId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改联赛信息";
}

/** 提交按钮 */
const submitForm = () => {
  leaguesFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.leagueId) {
        await updateLeagues(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addLeagues(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: LeaguesVO) => {
  const _leagueIds = row?.leagueId || ids.value;
  await proxy?.$modal.confirm('是否确认删除联赛信息编号为"' + _leagueIds + '"的数据项？').finally(() => loading.value = false);
  await delLeagues(_leagueIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('biz/leagues/export', {
    ...queryParams.value
  }, `leagues_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
