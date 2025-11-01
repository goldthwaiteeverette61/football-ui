<template>
  <div class="p-4 md:p-6 font-sans bg-gray-100 min-h-screen">
    <!-- 页面标题和信息 -->
    <div class="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h1 class="text-2xl font-bold text-gray-800">方案 [{{ periodId || '加载中...' }}] 投注详情</h1>
      <p class="text-sm text-gray-500 mt-1">
        您正在为 <span class="font-semibold text-blue-600">{{ followIds.length }}</span> 条跟投记录批量设置赔率快照。
      </p>
    </div>

    <!-- 投注项列表 -->
    <div v-if="!isLoading && groupedByMatch.size > 0" class="space-y-4">
      <div v-for="[matchId, matchGroup] in groupedByMatch" :key="matchId" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="match-item flex items-center">
            <!-- 左侧：比赛信息 -->
            <div class="match-info w-1/4 text-center p-4">
              <div class="text-sm text-gray-600">{{ matchGroup.bizMatchesVo.leagueName }}</div>
              <div class="font-semibold">{{ matchGroup.bizMatchesVo.matchNumStr }}</div>
              <div class="text-xs text-gray-400">{{ formatTime(matchGroup.bizMatchesVo.matchDatetime) }}</div>
            </div>

            <!-- 右侧：赔率编辑 -->
            <div class="odds-info flex-1 flex flex-col space-y-2 p-4 border-l border-gray-200">
              <div class="team-names flex justify-around items-center font-bold text-gray-800">
                <div class="text-center">{{ matchGroup.bizMatchesVo.homeTeamName }}</div>
                <div class="text-gray-400 text-sm">VS</div>
                <div class="text-center">{{ matchGroup.bizMatchesVo.awayTeamName }}</div>
              </div>

              <!-- 不让球 (HAD) 行 -->
              <div v-if="matchGroup.bizMatchesVo.had" class="odds-row flex items-center">
                <div class="goal-line w-8 text-center font-bold bg-gray-200 rounded mr-2">[0]</div>
                <div class="odds-grid flex-1 grid grid-cols-3 gap-2">
                  <div :class="getOddsCellClass(matchGroup.selections, 'HAD', 'H')" class="odds-cell">
                    <span v-if="!isSelectionEditable(matchGroup.selections, 'HAD', 'H')">胜 {{ matchGroup.bizMatchesVo.had.homeOdds }}</span>
                     <input v-else type="number" step="0.01" v-model.number="findEditableItem(matchGroup.selections, 'HAD', 'H').odds" class="odds-input" />
                  </div>
                  <div :class="getOddsCellClass(matchGroup.selections, 'HAD', 'D')" class="odds-cell">
                    <span v-if="!isSelectionEditable(matchGroup.selections, 'HAD', 'D')">平 {{ matchGroup.bizMatchesVo.had.drawOdds }}</span>
                    <input v-else type="number" step="0.01" v-model.number="findEditableItem(matchGroup.selections, 'HAD', 'D').odds" class="odds-input" />
                  </div>
                  <div :class="getOddsCellClass(matchGroup.selections, 'HAD', 'A')" class="odds-cell">
                    <span v-if="!isSelectionEditable(matchGroup.selections, 'HAD', 'A')">负 {{ matchGroup.bizMatchesVo.had.awayOdds }}</span>
                    <input v-else type="number" step="0.01" v-model.number="findEditableItem(matchGroup.selections, 'HAD', 'A').odds" class="odds-input" />
                  </div>
                </div>
              </div>

              <!-- 让球 (HHAD) 行 -->
              <div v-if="matchGroup.bizMatchesVo.hhad && matchGroup.bizMatchesVo.hhad.goalLine" class="odds-row flex items-center">
                <div class="goal-line w-8 text-center font-bold rounded mr-2" :class="parseInt(matchGroup.bizMatchesVo.hhad.goalLine) > 0 ? 'bg-red-500 text-white' : 'bg-green-500 text-white'">
                  {{ matchGroup.bizMatchesVo.hhad.goalLine }}
                </div>
                <div class="odds-grid flex-1 grid grid-cols-3 gap-2">
                   <div :class="getOddsCellClass(matchGroup.selections, 'HHAD', 'H')" class="odds-cell">
                    <span v-if="!isSelectionEditable(matchGroup.selections, 'HHAD', 'H')">胜 {{ matchGroup.bizMatchesVo.hhad.homeOdds }}</span>
                     <input v-else type="number" step="0.01" v-model.number="findEditableItem(matchGroup.selections, 'HHAD', 'H').odds" class="odds-input" />
                  </div>
                  <div :class="getOddsCellClass(matchGroup.selections, 'HHAD', 'D')" class="odds-cell">
                    <span v-if="!isSelectionEditable(matchGroup.selections, 'HHAD', 'D')">平 {{ matchGroup.bizMatchesVo.hhad.drawOdds }}</span>
                    <input v-else type="number" step="0.01" v-model.number="findEditableItem(matchGroup.selections, 'HHAD', 'D').odds" class="odds-input" />
                  </div>
                  <div :class="getOddsCellClass(matchGroup.selections, 'HHAD', 'A')" class="odds-cell">
                    <span v-if="!isSelectionEditable(matchGroup.selections, 'HHAD', 'A')">负 {{ matchGroup.bizMatchesVo.hhad.awayOdds }}</span>
                    <input v-else type="number" step="0.01" v-model.number="findEditableItem(matchGroup.selections, 'HHAD', 'A').odds" class="odds-input" />
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
    <p v-else class="text-gray-500 text-center py-4 bg-white rounded-lg shadow-sm">
      {{ isLoading ? '正在加载方案详情...' : '未找到方案详情或方案为空' }}
    </p>

    <!-- 底部操作栏 -->
    <div class="mt-6 flex justify-end space-x-3">
        <button @click="handleCancel" class="action-button bg-gray-300 hover:bg-gray-400 text-gray-800">取消</button>
        <button @click="handleSave" :disabled="isSaving || !canSave" class="action-button bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
            {{ isSaving ? '保存中...' : '保存快照' }}
        </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, getCurrentInstance, ComponentInternalInstance } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getSchemePeriods } from '@/api/biz/schemePeriods';
import { saveUserFollowDetails } from '@/api/biz/userFollowDetails';
import type { SchemeDetailItem, MatchInfo } from '@/api/biz/schemePeriods/types';
import type { UserFollowDetailsSaveBo } from '@/api/biz/userFollowDetails/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const router = useRouter();
const route = useRoute();

const followIds = ref<(string | number)[]>([]);
const periodId = ref<string | null>(null);
const combinations = ref<SchemeDetailItem[][]>([]);
const isSaving = ref(false);
const isLoading = ref(true);

onMounted(async () => {
    const ids = route.query.followIds as string;
    const pid = route.query.periodId as string;

    followIds.value = ids ? ids.split(',') : [];
    periodId.value = pid || null;

    if (periodId.value) {
        try {
            const res = await getSchemePeriods(periodId.value);
            const details = res.data.details || [];

            details.forEach(item => {
                const oddsValue = parseFloat(item.odds as any);
                if (isNaN(oddsValue) || oddsValue <= 0) {
                    item.odds = 1.00;
                } else {
                    item.odds = oddsValue;
                }
            });

            const comboMap = new Map<number, SchemeDetailItem[]>();
            details.forEach(item => {
                const group = item.combinationGroup || 0;
                if (!comboMap.has(group)) {
                    comboMap.set(group, []);
                }
                comboMap.get(group)?.push(item);
            });
            combinations.value = Array.from(comboMap.values());

        } catch (error) {
            console.error("获取方案详情失败:", error);
            proxy?.$modal.msgError("获取方案详情失败");
        } finally {
            isLoading.value = false;
        }
    } else {
        isLoading.value = false;
    }
});

const groupedByMatch = computed(() => {
    const groups = new Map<number, { bizMatchesVo: MatchInfo, selections: SchemeDetailItem[] }>();
    combinations.value.flat().forEach(item => {
        if (!groups.has(item.matchId)) {
            groups.set(item.matchId, {
                bizMatchesVo: item.bizMatchesVo,
                selections: []
            });
        }
        groups.get(item.matchId)?.selections.push(item);
    });
    return groups;
});

const canSave = computed(() => {
    if (isLoading.value) return false;
    if (combinations.value.length === 0) return false;

    return combinations.value.every(combo => {
        if (combo.length === 0) return false;
        return combo.every(item => {
            const oddsValue = parseFloat(item.odds as any);
            return !isNaN(oddsValue) && oddsValue > 0;
        });
    });
});


// --- Helper Functions ---
const formatTime = (datetime: string) => {
  if (!datetime) return '';
  return datetime.substring(11, 16);
};

const getMatchInfo = (matchId: number, key: keyof MatchInfo) => {
    const group = groupedByMatch.value.get(matchId);
    return group?.bizMatchesVo[key] || '未知';
};

const getReferenceOdds = (matchId: number, poolCode: 'HAD' | 'HHAD', selection: 'H' | 'D' | 'A') => {
    const match = groupedByMatch.value.get(matchId)?.bizMatchesVo;
    if (!match) return '-';
    const oddsSet = poolCode === 'HAD' ? match.had : match.hhad;
    if (!oddsSet) return '-';
    if (selection === 'H') return oddsSet.homeOdds;
    if (selection === 'D') return oddsSet.drawOdds;
    if (selection === 'A') return oddsSet.awayOdds;
    return '-';
};

const getGoalLineClass = (goalLine: string) => {
    const num = parseFloat(goalLine);
    return num > 0 ? 'bg-red-500' : 'bg-green-500';
};

const isSelectionEditable = (selections: SchemeDetailItem[], poolCode: 'HAD' | 'HHAD', selection: 'H' | 'D' | 'A') => {
    return selections.some(s => s.poolCode === poolCode && s.selection === selection);
};

const findEditableItem = (selections: SchemeDetailItem[], poolCode: 'HAD' | 'HHAD', selection: 'H' | 'D' | 'A') => {
    return selections.find(s => s.poolCode === poolCode && s.selection === selection);
};

const getOddsCellClass = (selections: SchemeDetailItem[], poolCode: 'HAD' | 'HHAD', selection: 'H' | 'D' | 'A') => {
    return isSelectionEditable(selections, poolCode, selection) ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-800';
};

const handleCancel = () => {
    router.back();
};

const handleSave = async () => {
    if (!canSave.value) {
        proxy?.$modal.msgError('所有投注项的赔率都必须是有效的正数');
        return;
    }
    isSaving.value = true;
    try {
        // 【核心修改】增加 matchName 字段的提交
        const payload: UserFollowDetailsSaveBo = {
            followIds: followIds.value,
            combinations: combinations.value.flat().map(item => ({
                periodId: periodId.value,
                periodDetailsId: item.detailId,
                matchId: item.matchId,
                poolCode: item.poolCode,
                selection: item.selection,
                odds: Number(item.odds),
                goalLine: item.goalLine,
                // 直接使用从API获取的 matchName
                matchName: item.matchName,
            })),
        };
        await saveUserFollowDetails(payload);
        proxy?.$modal.msgSuccess("快照保存成功！");
    } catch (error) {
        console.error("保存失败:", error);
        proxy?.$modal.msgError("保存失败，请稍后重试");
    } finally {
        isSaving.value = false;
    }
};
</script>

<style>
.action-button {
    @apply px-4 py-2 text-sm font-semibold text-white rounded-md shadow-sm transition-colors duration-200;
}
.odds-cell {
    @apply p-3 rounded-md transition-colors duration-200 text-center text-sm;
}
.odds-input {
    @apply w-full bg-transparent text-white font-bold text-center outline-none p-0 mt-1;
    -moz-appearance: textfield;
}
.odds-input::-webkit-outer-spin-button,
.odds-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
