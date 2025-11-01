<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="方案名称" prop="name">
              <el-input v-model="queryParams.name" placeholder="请输入方案名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
                <el-option label="草稿" value="draft"></el-option>
                <el-option label="待开奖" value="pending"></el-option>
                <el-option label="已中奖" value="won"></el-option>
                <el-option label="未中奖" value="lost"></el-option>
              </el-select>
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
              v-hasPermi="['biz:schemePeriods:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()"
              v-hasPermi="['biz:schemePeriods:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()"
              v-hasPermi="['biz:schemePeriods:remove']">删除</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="schemePeriodsList" row-key="periodId"
        @selection-change="handleSelectionChange">
        <el-table-column type="expand">
          <template #default="props">
            <div class="p-4 bg-gray-50 rounded">
              <h4 class="text-base font-semibold mb-3 border-l-4 border-red-500 pl-2">方案【{{ props.row.name }}】投注详情</h4>
              <div v-if="props.row.details && props.row.details.length > 0">
                <div v-for="matchGroup in groupDetailsByMatch(props.row.details)" :key="matchGroup.bizMatchesVo.matchId" class="expanded-match-item">
                   <div class="match-item flex items-center border-b py-3">
                    <div class="match-info w-1/4 text-center">
                      <div class="text-sm text-gray-600">{{ matchGroup.bizMatchesVo.leagueName }}</div>
                      <div class="font-semibold">{{ matchGroup.bizMatchesVo.matchNumStr }}</div>
                      <div class="text-xs text-gray-400">{{ formatTime(matchGroup.bizMatchesVo.matchDatetime) }}</div>
                    </div>
                    <div class="odds-info flex-1 flex flex-col space-y-2">
                      <div class="team-names flex justify-around items-center font-bold text-gray-800">
                        <div class="text-center">{{ matchGroup.bizMatchesVo.homeTeamName }}</div>
                        <div class="text-gray-400 text-sm">VS</div>
                        <div class="text-center">{{ matchGroup.bizMatchesVo.awayTeamName }}</div>
                      </div>
                      <div v-if="matchGroup.bizMatchesVo.had" class="odds-row flex items-center">
                        <div class="goal-line w-8 text-center font-bold bg-gray-200 rounded mr-2">[0]</div>
                        <div class="odds-grid flex-1 grid grid-cols-3 gap-2">
                          <div :class="getDetailButtonClass(matchGroup.selections, 'HAD', 'H')" class="detail-odds-btn">胜 {{ matchGroup.bizMatchesVo.had.homeOdds }}</div>
                          <div :class="getDetailButtonClass(matchGroup.selections, 'HAD', 'D')" class="detail-odds-btn">平 {{ matchGroup.bizMatchesVo.had.drawOdds }}</div>
                          <div :class="getDetailButtonClass(matchGroup.selections, 'HAD', 'A')" class="detail-odds-btn">负 {{ matchGroup.bizMatchesVo.had.awayOdds }}</div>
                        </div>
                      </div>
                      <div v-if="matchGroup.bizMatchesVo.hhad && matchGroup.bizMatchesVo.hhad.goalLine" class="odds-row flex items-center">
                        <div class="goal-line w-8 text-center font-bold rounded mr-2" :class="parseInt(matchGroup.bizMatchesVo.hhad.goalLine) > 0 ? 'bg-red-500 text-white' : 'bg-green-500 text-white'">{{ matchGroup.bizMatchesVo.hhad.goalLine }}</div>
                        <div class="odds-grid flex-1 grid grid-cols-3 gap-2">
                          <div :class="getDetailButtonClass(matchGroup.selections, 'HHAD', 'H')" class="detail-odds-btn">胜 {{ matchGroup.bizMatchesVo.hhad.homeOdds }}</div>
                          <div :class="getDetailButtonClass(matchGroup.selections, 'HHAD', 'D')" class="detail-odds-btn">平 {{ matchGroup.bizMatchesVo.hhad.drawOdds }}</div>
                          <div :class="getDetailButtonClass(matchGroup.selections, 'HHAD', 'A')" class="detail-odds-btn">负 {{ matchGroup.bizMatchesVo.hhad.awayOdds }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-gray-500 text-center py-4">
                暂无投注详情
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="方案ID" align="center" prop="periodId" />
        <el-table-column label="方案名称" align="center" prop="name" />
        <el-table-column label="截止投注时间" align="center" prop="deadlineTime" />
        <el-table-column label="投注内容" align="center">
          <template #default="scope">
            <span>{{ scope.row.details ? scope.row.details.length : 0 }} 场比赛</span>
          </template>
        </el-table-column>
        <el-table-column label="投注进度" align="center" width="150">
            <template #default="scope">
                <div>
                    <span class="font-semibold">{{ scope.row.accumulatedAmount || '0.00' }}</span>
                    <span v-if="scope.row.limitAmount === -1" class="text-gray-400"> / 不限制</span>
                    <span v-else class="text-gray-400"> / {{ scope.row.limitAmount }}</span>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="本期状态" align="center" prop="status">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 'draft'" type="info">草稿</el-tag>
            <el-tag v-else-if="scope.row.status === 'pending'" type="warning">待开奖</el-tag>
            <el-tag v-else-if="scope.row.status === 'won'" type="success">已中奖</el-tag>
            <el-tag v-else-if="scope.row.status === 'lost'" type="danger">未中奖</el-tag>
            <el-tag v-else type="primary">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
          <template #default="scope">
            <el-tooltip content="发布方案"
              v-if="scope.row.status === 'draft' && scope.row.details && scope.row.details.length > 0">
              <el-button link type="success" icon="Promotion" @click="handlePublish(scope.row)"
                v-hasPermi="['biz:schemePeriods:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="选择比赛" placement="top" v-if="scope.row.status === 'draft'">
              <el-button link type="primary" icon="Plus" @click="handleSelectMatches(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                v-hasPermi="['biz:schemePeriods:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                v-hasPermi="['biz:schemePeriods:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>

    <!-- 添加或修改方案期数对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="schemePeriodsFormRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="方案名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入方案名称" />
        </el-form-item>
        <el-form-item label="截止时间" prop="deadlineTime">
          <el-date-picker
            v-model="form.deadlineTime"
            type="datetime"
            placeholder="请选择截止时间"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%;"
            clearable
          />
        </el-form-item>
        <el-form-item label="方案限额" prop="limitAmount">
          <el-input-number v-model="form.limitAmount" :min="-1" placeholder="-1为不限制" style="width: 100%;" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 计算器弹窗 -->
    <el-dialog :title="calculatorDialogTitle" v-model="calculatorDialogVisible" width="80%" top="5vh" append-to-body
      destroy-on-close @close="clearSelection">
      <div class="calculator-content" style="height: 70vh; overflow-y: auto; padding-right: 15px;">
        <div class="match-list bg-white">
          <div v-if="calculatorLoading" class="text-center p-8">加载中...</div>
          <div v-else-if="matchGroups.length === 0" class="text-center p-8 text-gray-500">暂无比赛数据</div>
          <div v-else v-for="group in matchGroups" :key="group.businessDate" class="match-group mb-4">
            <div class="date-header bg-gray-100 p-2 text-sm text-gray-700 rounded">
              {{ group.weekday }} {{ group.businessDate }} 共{{ group.bizMatchesVoList.length }}场比赛
            </div>
            <div v-for="match in group.bizMatchesVoList" :key="match.matchId"
              class="match-item flex items-center border-b py-3">
              <div class="match-info w-1/4 text-center">
                <div class="text-sm text-gray-600">{{ match.leagueName }}</div>
                <div class="font-semibold">{{ match.matchNumStr }}</div>
                <div class="text-xs text-gray-400">{{ formatTime(match.matchDatetime) }}</div>
              </div>
              <div class="odds-info flex-1 flex flex-col space-y-2">
                <div class="team-names flex justify-around items-center font-bold text-gray-800">
                  <div class="text-center">{{ match.homeTeamName }}<span class="text-xs text-gray-500 ml-1">{{
                    match.homeRanks }}</span></div>
                  <div class="text-gray-400 text-sm">VS</div>
                  <div class="text-center">{{ match.awayTeamName }}<span class="text-xs text-gray-500 ml-1">{{
                    match.awayRanks }}</span></div>
                </div>
                <div v-if="match.had" class="odds-row flex items-center">
                  <div class="goal-line w-8 text-center font-bold bg-gray-200 rounded mr-2">[0]</div>
                  <div class="odds-grid flex-1 grid grid-cols-3 gap-2">
                    <el-button :type="isSelected(match.matchId, 'HAD', 'H') ? 'danger' : ''"
                      @click="toggleSelection(match, 'HAD', 'H', match.had)" class="w-full">胜 {{ match.had.homeOdds
                      }}</el-button>
                    <el-button :type="isSelected(match.matchId, 'HAD', 'D') ? 'danger' : ''"
                      @click="toggleSelection(match, 'HAD', 'D', match.had)" class="w-full">平 {{ match.had.drawOdds
                      }}</el-button>
                    <el-button :type="isSelected(match.matchId, 'HAD', 'A') ? 'danger' : ''"
                      @click="toggleSelection(match, 'HAD', 'A', match.had)" class="w-full">负 {{ match.had.awayOdds
                      }}</el-button>
                  </div>
                </div>
                <div v-if="match.hhad && match.hhad.goalLine" class="odds-row flex items-center">
                  <div class="goal-line w-8 text-center font-bold rounded mr-2"
                    :class="parseInt(match.hhad.goalLine) > 0 ? 'bg-red-500 text-white' : 'bg-green-500 text-white'">{{
                      match.hhad.goalLine }}</div>
                  <div class="odds-grid flex-1 grid grid-cols-3 gap-2">
                    <el-button :type="isSelected(match.matchId, 'HHAD', 'H') ? 'danger' : ''"
                      @click="toggleSelection(match, 'HHAD', 'H', match.hhad)" class="w-full">胜 {{ match.hhad.homeOdds
                      }}</el-button>
                    <el-button :type="isSelected(match.matchId, 'HHAD', 'D') ? 'danger' : ''"
                      @click="toggleSelection(match, 'HHAD', 'D', match.hhad)" class="w-full">平 {{ match.hhad.drawOdds
                      }}</el-button>
                    <el-button :type="isSelected(match.matchId, 'HHAD', 'A') ? 'danger' : ''"
                      @click="toggleSelection(match, 'HHAD', 'A', match.hhad)" class="w-full">负 {{ match.hhad.awayOdds
                      }}</el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="bet-slip-container">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="relative">
                <span class="font-bold text-lg">已选</span>
                <el-badge :value="selectedItems.length" class="item absolute -top-2 -right-4" type="danger"></el-badge>
              </div>
            </div>
            <el-button icon="Delete" @click="clearSelection">清空</el-button>
          </div>
          <div class="calculation-info flex items-center mt-4 text-sm">
            <div class="ml-auto text-right">
              <div>已选 <span class="text-red-500 font-bold mx-1">{{ selectedItems.length }}</span> 场比赛</div>
            </div>
            <el-button type="danger" class="ml-4" @click="handleSubmit">提交方案</el-button>
          </div>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup name="SchemePeriods" lang="ts">
import { ref, onMounted, reactive, toRefs, getCurrentInstance, ComponentInternalInstance, computed } from 'vue';
import { listSchemePeriods, getSchemePeriods, delSchemePeriods, addSchemePeriods, updateSchemePeriods, publishSchemePeriod } from '@/api/biz/schemePeriods';
import { SchemePeriodsVO, SchemePeriodsQuery, SchemePeriodsForm } from '@/api/biz/schemePeriods/types';
import { ElForm, ElFormInstance } from 'element-plus';
import { getCalculatorList, updatePeriod, CalculatorMatchGroup, CalculatorMatchVo, CalculatorOddsVo, UpdatePeriodDto } from '@/api/biz/calculator/index';
import { log } from 'console';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

// --- 列表页面状态 ---
const schemePeriodsList = ref<SchemePeriodsVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const queryFormRef = ref<ElFormInstance>();
const schemePeriodsFormRef = ref<ElFormInstance>();
const dialog = reactive<DialogOption>({ visible: false, title: '' });

const initFormData: SchemePeriodsForm = { periodId: undefined, name: undefined, status: undefined, deadlineTime: undefined, limitAmount: -1 };
const data = reactive<PageData<SchemePeriodsForm, SchemePeriodsQuery>>({
  form: { ...initFormData },
  queryParams: { pageNum: 1, pageSize: 10, name: undefined, status: undefined },
  rules: {
    name: [{ required: true, message: "方案名称不能为空", trigger: "blur" }],
    limitAmount: [{ required: true, message: "请输入方案限额, -1代表不限制", trigger: "blur" }],
  }
});
const { queryParams, form, rules } = toRefs(data);

// --- 计算器弹窗状态 ---
const calculatorDialogVisible = ref(false);
const calculatorLoading = ref(true);
const currentPeriod = ref<SchemePeriodsVO | null>(null);
const matchGroups = ref<CalculatorMatchGroup[]>([]);
// 【核心修改】更新 SelectedItem 接口
interface SelectedItem {
  matchId: number;
  matchName: string; // 新增比赛名称
  poolCode: 'HAD' | 'HHAD';
  selection: 'H' | 'D' | 'A';
  odds: string;
  goalLine: string;
}
const selectedItems = ref<SelectedItem[]>([]);

const calculatorDialogTitle = computed(() => {
  if (currentPeriod.value) {
    return `方案【${currentPeriod.value.name}】选择比赛`;
  }
  return '方案选择比赛';
});

const getTeamClass = (teamType: 'home' | 'away', detail: any) => {
  const selection = detail.selection;
  if (selection === 'D') return 'text-blue-500';
  if (teamType === 'home' && selection === 'H') return 'text-red-500 font-bold';
  if (teamType === 'away' && selection === 'A') return 'text-red-500 font-bold';
  return '';
};

const getDetailButtonClass = (selections: any[], poolCode: string, selection: string) => {
  const baseClasses = 'p-2 text-center rounded border text-sm';
  const isSelected = selections.some(s => s.poolCode === poolCode && s.selection === selection);
  if (isSelected) {
    return `${baseClasses} bg-red-500 text-white border-red-500`;
  }
  return `${baseClasses} bg-gray-100 border-gray-200 text-gray-600`;
};

const groupDetailsByMatch = (details: any[]) => {
  if (!details || details.length === 0) return [];
  
  const matchMap = new Map();
  const result = [];

  details.forEach(detail => {
    const matchId = detail.matchId;
    if (!matchMap.has(matchId)) {
      const newGroup = {
        bizMatchesVo: detail.bizMatchesVo,
        selections: []
      };
      matchMap.set(matchId, newGroup);
      result.push(newGroup);
    }
    matchMap.get(matchId).selections.push(detail);
  });

  return result;
};


// --- 列表页面方法 ---
const getList = async () => {
  loading.value = true;
  const res = await listSchemePeriods(queryParams.value);
  schemePeriodsList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};
const cancel = () => {
  reset();
  dialog.visible = false;
};
const reset = () => {
  form.value = { ...initFormData };
  schemePeriodsFormRef.value?.resetFields();
};
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};
const handleSelectionChange = (selection: SchemePeriodsVO[]) => {
  ids.value = selection.map(item => item.periodId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加方案";
};
const handleUpdate = async (row?: SchemePeriodsVO) => {
  reset();
  const _periodId = row?.periodId || ids.value[0]
  const res = await getSchemePeriods(_periodId as number);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改方案";
};
const submitForm = () => {
  schemePeriodsFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.periodId) {
        await updateSchemePeriods(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addSchemePeriods(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
};
const handleDelete = async (row?: SchemePeriodsVO) => {
  const _periodIds = row?.periodId || ids.value;
  await proxy?.$modal.confirm('是否确认删除方案编号为"' + _periodIds + '"的数据项？');
  loading.value = true;
  await delSchemePeriods(_periodIds as string | number | (string | number)[]).finally(() => loading.value = false);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
};

const handlePublish = async (row: SchemePeriodsVO) => {
  await proxy?.$modal.confirm('是否确认发布方案【' + row.name + '】？发布后将进入待开奖状态。');
  loading.value = true;
  await publishSchemePeriod(row.periodId as number).finally(() => loading.value = false);
  proxy?.$modal.msgSuccess("发布成功");
  await getList();
};


// --- 计算器弹窗方法 ---
const handleSelectMatches = (row: SchemePeriodsVO) => {
  currentPeriod.value = row;
  if (row.details && row.details.length > 0) {
    selectedItems.value = row.details.map(d => ({
      matchId: d.matchId,
      matchName: d.matchName, // 假设后端返回了 matchName
      poolCode: d.poolCode,
      selection: d.selection,
      odds: d.odds,
      goalLine: d.goalLine,
    }));
  } else {
    selectedItems.value = [];
  }
  calculatorDialogVisible.value = true;
  fetchMatchList();
};

const fetchMatchList = async () => {
  calculatorLoading.value = true;
  try {
    const response = await getCalculatorList();
    matchGroups.value = response.rows;
  } catch (error) {
    console.error("获取比赛列表失败:", error);
  } finally {
    calculatorLoading.value = false;
  }
};

const handleSubmit = async () => {
  if (selectedItems.value.length === 0) {
    proxy?.$modal.msgWarning("请至少选择一场比赛");
    return;
  }
  if (!currentPeriod.value?.periodId) {
    proxy?.$modal.msgError("未获取到期数ID，无法提交");
    return;
  }

  // 【核心修改】提交时包含 matchName
  const details = selectedItems.value.map(item => ({
    matchId: item.matchId,
    matchName: item.matchName,
    poolCode: item.poolCode,
    selection: item.selection,
    odds: item.odds,
    goalLine: item.goalLine
  }));

  const periodData: UpdatePeriodDto = {
    periodId: currentPeriod.value.periodId as number,
    details: details
  };

  try {
    await updatePeriod(periodData);
    proxy?.$modal.msgSuccess("方案提交成功！");
    calculatorDialogVisible.value = false;
    getList();
  } catch (error) {
    console.error("提交方案失败:", error);
  }
};

const formatTime = (datetime: string) => {
  if (!datetime) return '';
  return datetime.substring(11, 16);
};

const toggleSelection = (match: CalculatorMatchVo, poolCode: 'HAD' | 'HHAD', selection: 'H' | 'D' | 'A', oddsData: CalculatorOddsVo) => {
  const matchId = match.matchId;
  const existingIndex = selectedItems.value.findIndex(item =>
    item.matchId === matchId &&
    item.poolCode === poolCode &&
    item.selection === selection
  );

  
  if (existingIndex > -1) {
    selectedItems.value.splice(existingIndex, 1);
  } else {
    let odds: string;
    if (selection === 'H') odds = oddsData.homeOdds;
    else if (selection === 'D') odds = oddsData.drawOdds;
    else odds = oddsData.awayOdds;

    const goalLine = poolCode === 'HHAD' ? (oddsData.goalLine || '0') : '0';
    
    // 【核心修改】创建新选中项时，拼接 matchName
    const newItem: SelectedItem = {
      matchId,
      matchName: `${match.homeTeamName} vs ${match.awayTeamName}`,
      poolCode,
      selection,
      odds,
      goalLine
    };
    
    selectedItems.value.push(newItem);
  }
};

const isSelected = (matchId: number, poolCode: 'HAD' | 'HHAD', selection: 'H' | 'D' | 'A') => {
  return selectedItems.value.some(item =>
    item.matchId === matchId &&
    item.poolCode === poolCode &&
    item.selection === selection
  );
};

const clearSelection = () => {
  selectedItems.value = [];
};


onMounted(() => {
  getList();
});
</script>

<style scoped>
.detail-odds-btn {
  /* 模拟 Element Plus 按钮的内边距和过渡效果 */
  padding: 8px 15px;
  transition: all 0.3s;
  font-size: 12px;
}
</style>
