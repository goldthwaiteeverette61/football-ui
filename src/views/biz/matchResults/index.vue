<template>
  <div class="p-2">
    <!-- 搜索表单 -->
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="比赛ID" prop="matchId">
              <el-input v-model.trim="queryParams.matchId" placeholder="请输入比赛ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="玩法代码" prop="poolCode">
              <el-input v-model.trim="queryParams.poolCode" placeholder="请输入玩法代码" clearable
                @keyup.enter="handleQuery" />
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
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()"
              v-hasPermi="['biz:matchResults:remove']">删除</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <!-- 表格改为分组展示 -->
      <el-table v-loading="loading" :data="pagedData" @selection-change="handleSelectionChange" row-key="matchId">
        <el-table-column type="selection" width="55" align="center" />

        <!-- 展开列，用于显示详细玩法 -->
        <el-table-column type="expand">
          <template #default="props">
            <div class="p-4 bg-gray-50">
              <h4 class="text-base font-semibold mb-2">玩法详情</h4>
              <el-table :data="props.row.plays" border>
                <el-table-column label="玩法" prop="poolCode" align="center" />
                <el-table-column label="赛果" align="center">
                  <template #default="scope">
                    <el-tag>{{ scope.row.combinationDesc }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="让球" prop="goalLine" align="center" />
                <el-table-column label="最终赔率" prop="odds" align="center" />
              </el-table>
            </div>
          </template>
        </el-table-column>

        <!-- 主表只显示比赛公共信息 -->
        <el-table-column label="比赛信息" align="center" width="300">
          <template #default="scope">
            <div class="text-left">
              <div><strong>{{ scope.row.matchNumStr }}</strong></div>
              <div>{{ scope.row.homeTeamName }} <span class="text-red-500 font-bold mx-1">{{ scope.row.fullScore
                  }}</span> {{ scope.row.awayTeamName }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="玩法数量" align="center">
          <template #default="scope">
            <el-tag type="success">{{ scope.row.plays.length }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="创建时间" align="center" prop="createdAt" width="180">
          <template #default="scope">
            <span>{{ proxy?.parseTime(scope.row.createdAt) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="删除整场比赛结果" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                v-hasPermi="['biz:matchResults:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- *** 调试步骤7: 恢复 Pagination 组件 *** -->
      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize">
      </pagination>
    </el-card>
  </div>
</template>

<script setup name="MatchResults" lang="ts">
import { ref, onMounted, reactive, toRefs, getCurrentInstance, ComponentInternalInstance, computed, watch } from 'vue';
import { listMatchResults, delMatchResults } from '@/api/biz/matchResults';
import { MatchResultsVO, MatchResultsQuery } from '@/api/biz/matchResults/types';
import type { FormInstance } from 'element-plus';
// *** 调试步骤8: 恢复所有组件的导入 ***
import Pagination from '@/components/Pagination/index.vue';
import RightToolbar from '@/components/RightToolbar/index.vue';


const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const matchResultsList = ref<MatchResultsVO[]>([]);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<FormInstance>();

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    matchId: '',
    poolCode: '',
  }
});

const { queryParams } = toRefs(data);

// 1. 计算属性：将原始列表数据进行分组
const groupedData = computed(() => {
  if (!matchResultsList.value || matchResultsList.value.length === 0) {
    return [];
  }
  const map = new Map();
  matchResultsList.value.forEach(item => {
    const match = map.get(item.matchId);
    if (match) {
      match.plays.push(item);
    } else {
      map.set(item.matchId, {
        matchId: item.matchId,
        matchNumStr: item.matchNumStr,
        homeTeamName: item.homeTeamName,
        awayTeamName: item.awayTeamName,
        fullScore: item.fullScore,
        createdAt: item.createdAt,
        plays: [item]
      });
    }
  });
  return Array.from(map.values());
});

// 2. 计算属性：基于分组后的数据，根据搜索条件进行客户端过滤
const filteredData = computed(() => {
  let dataToFilter = groupedData.value;
  if (queryParams.value.matchId) {
    dataToFilter = dataToFilter.filter(group => group.matchId.toString().includes(queryParams.value.matchId));
  }
  if (queryParams.value.poolCode) {
    dataToFilter = dataToFilter.filter(group =>
      group.plays.some((play: MatchResultsVO) => play.poolCode.toLowerCase().includes(queryParams.value.poolCode.toLowerCase()))
    );
  }
  return dataToFilter;
});

// 3. 计算属性：对过滤后的数据进行客户端分页
const pagedData = computed(() => {
  const start = (queryParams.value.pageNum - 1) * queryParams.value.pageSize;
  const end = start + queryParams.value.pageSize;
  return filteredData.value.slice(start, end);
});

// 4. 监听过滤后的数据变化，更新总数
watch(filteredData, (newValue) => {
  total.value = newValue.length;
});

/** 查询比赛赛果列表 */
const getList = async () => {
  loading.value = true;
  // *** 调试步骤9: 恢复真实的API请求 ***
  const res = await listMatchResults({ pageNum: 1, pageSize: 99999 });
  matchResultsList.value = res.rows;
  loading.value = false;
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: any[]) => {
  ids.value = selection.map(group => group.plays.map((p: MatchResultsVO) => p.id)).flat();
  multiple.value = !selection.length;
}

/** 删除按钮操作 */
const handleDelete = async (row?: any) => {
  let _ids: (string | number)[] = [];
  let confirmMessage = '';

  if (row) {
    _ids = row.plays.map((p: MatchResultsVO) => p.id);
    confirmMessage = `是否确认删除比赛 "${row.matchNumStr}" 的所有 ${row.plays.length} 条赛果数据项？`;
  } else {
    _ids = ids.value;
    confirmMessage = `是否确认删除选中的所有数据项？`;
  }

  if (_ids.length === 0) {
    proxy?.$modal.msgWarning("请选择要删除的数据");
    return;
  }

  await proxy?.$modal.confirm(confirmMessage);
  loading.value = true;
  // *** 调试步骤10: 恢复真实的删除操作 ***
  await delMatchResults(_ids).finally(() => loading.value = false);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

onMounted(() => {
  getList();
});
</script>
