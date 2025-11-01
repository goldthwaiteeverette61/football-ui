<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="场次编号" prop="matchNumStr">
              <el-input v-model="queryParams.matchNumStr" placeholder="请输入场次编号" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="比赛日期" prop="businessDate">
              <el-date-picker clearable v-model="queryParams.businessDate" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择比赛日期" />
            </el-form-item>
            <el-form-item label="比赛时间" prop="matchDatetime">
              <el-date-picker clearable v-model="queryParams.matchDatetime" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择比赛时间" />
            </el-form-item>
            <el-form-item label="联赛信息表id" prop="leagueId">
              <el-input v-model="queryParams.leagueId" placeholder="请输入联赛信息表id" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="" prop="homeTeamId">
              <el-input v-model="queryParams.homeTeamId" placeholder="请输入" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="" prop="awayTeamId">
              <el-input v-model="queryParams.awayTeamId" placeholder="请输入" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="" prop="createdAt">
              <el-date-picker clearable v-model="queryParams.createdAt" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择" />
            </el-form-item>
            <el-form-item label="" prop="updatedAt">
              <el-date-picker clearable v-model="queryParams.updatedAt" type="date" value-format="YYYY-MM-DD"
                placeholder="请选择" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd"
              v-hasPermi="['biz:matches:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()"
              v-hasPermi="['biz:matches:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()"
              v-hasPermi="['biz:matches:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport"
              v-hasPermi="['biz:matches:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="matchesList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="场次id" align="center" prop="matchId" v-if="true" />
        <el-table-column label="场次编号" align="center" prop="matchNumStr" />
        <el-table-column label="比赛日期" align="center" prop="businessDate" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.businessDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="比赛时间" align="center" prop="matchDatetime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.matchDatetime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="主队" align="center" prop="homeTeamName" />
        <el-table-column label="客队" align="center" prop="awayTeamName" />

        <!-- 核心修改：新增比分列 -->
        <el-table-column label="半场比分" align="center" prop="halfScore" />
        <el-table-column label="全场比分" align="center" prop="fullScore" />

        <el-table-column label="状态" align="center" prop="status" />
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
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                v-hasPermi="['biz:matches:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                v-hasPermi="['biz:matches:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改比赛信息对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="matchesFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="场次编号" prop="matchNumStr">
          <el-input v-model="form.matchNumStr" placeholder="请输入场次编号" />
        </el-form-item>
        <el-form-item label="比赛日期" prop="businessDate">
          <el-date-picker clearable v-model="form.businessDate" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择比赛日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="比赛时间" prop="matchDatetime">
          <el-date-picker clearable v-model="form.matchDatetime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择比赛时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="联赛信息表id" prop="leagueId">
          <el-input v-model="form.leagueId" placeholder="请输入联赛信息表id" />
        </el-form-item>
        <el-form-item label="" prop="homeTeamId">
          <el-input v-model="form.homeTeamId" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="" prop="awayTeamId">
          <el-input v-model="form.awayTeamId" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="" prop="createdAt">
          <el-date-picker clearable v-model="form.createdAt" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="" prop="updatedAt">
          <el-date-picker clearable v-model="form.updatedAt" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
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

<script setup name="Matches" lang="ts">
import { listMatches, getMatches, delMatches, addMatches, updateMatches } from '@/api/biz/matches';
import { MatchesVO, MatchesQuery, MatchesForm } from '@/api/biz/matches/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const matchesList = ref<MatchesVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const matchesFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: MatchesForm = {
  matchId: undefined,
  matchNumStr: undefined,
  businessDate: undefined,
  matchDatetime: undefined,
  leagueId: undefined,
  homeTeamId: undefined,
  awayTeamId: undefined,
  status: undefined,
  createdAt: undefined,
  updatedAt: undefined,
}
const data = reactive<PageData<MatchesForm, MatchesQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    matchNumStr: undefined,
    businessDate: undefined,
    matchDatetime: undefined,
    leagueId: undefined,
    homeTeamId: undefined,
    awayTeamId: undefined,
    status: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    params: {
    }
  },
  rules: {
    matchId: [
      { required: true, message: "场次id不能为空", trigger: "blur" }
    ],
    createdAt: [
      { required: true, message: "不能为空", trigger: "blur" }
    ],
    updatedAt: [
      { required: true, message: "不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询比赛信息列表 */
const getList = async () => {
  loading.value = true;
  const res = await listMatches(queryParams.value);
  matchesList.value = res.rows;
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
  form.value = { ...initFormData };
  matchesFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: MatchesVO[]) => {
  ids.value = selection.map(item => item.matchId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加比赛信息";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: MatchesVO) => {
  reset();
  const _matchId = row?.matchId || ids.value[0]
  const res = await getMatches(_matchId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改比赛信息";
}

/** 提交按钮 */
const submitForm = () => {
  matchesFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.matchId) {
        await updateMatches(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addMatches(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: MatchesVO) => {
  const _matchIds = row?.matchId || ids.value;
  await proxy?.$modal.confirm('是否确认删除比赛信息编号为"' + _matchIds + '"的数据项？').finally(() => loading.value = false);
  await delMatches(_matchIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('biz/matches/export', {
    ...queryParams.value
  }, `matches_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
