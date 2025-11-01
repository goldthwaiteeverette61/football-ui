<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="用户id" prop="userId">
              <el-input v-model="queryParams.userId" placeholder="用户id" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="订单状态" prop="status">
              <el-select v-model="queryParams.status" placeholder="请选择订单状态" clearable style="width: 180px">
                <el-option
                  v-for="dict in statusOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['biz:betOrders:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['biz:betOrders:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['biz:betOrders:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['biz:betOrders:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <!-- 【核心修改】增加了 :key="tableKey" 屬性 -->
      <el-table :key="tableKey" v-loading="loading" :data="betOrdersList" @selection-change="handleSelectionChange" @expand-change="handleExpandChange" row-key="orderId">
        <el-table-column type="expand">
          <template #default="props">
            <div class="p-4 bg-gray-100">
              <div class="flex justify-between items-center mb-2">
                  <h4 class="font-bold">投注详情</h4>
                  <el-button type="primary" size="small" @click="handleBatchUpdateOdds(props.row)" :loading="buttonLoading">确认订单</el-button>
              </div>
              <!-- 【核心修改】增加 :span-method 屬性以啟用合併功能 -->
              <el-table :data="props.row.details" border :span-method="detailsSpanMethod">
                <el-table-column label="比赛" prop="matchName" align="center" />
                <el-table-column label="玩法" prop="poolCode" align="center">
                   <template #default="scope">
                      <span>{{ translatePoolCode(scope.row.poolCode) }}</span>
                   </template>
                </el-table-column>
                <el-table-column label="选项" prop="selection" align="center" />
                <el-table-column label="赔率" prop="odds" align="center">
                   <template #default="scope">
                      <el-input-number v-model="scope.row.odds" :precision="2" :step="0.01" size="small" controls-position="right" style="width: 100px" />
                   </template>
                </el-table-column>
                <el-table-column label="是否命中" prop="isWinning" align="center">
                   <template #default="scope">
                      <el-tag v-if="scope.row.isWinning === 1" type="success">是</el-tag>
                      <el-tag v-else-if="scope.row.isWinning === 2" type="danger">否</el-tag>
                      <el-tag v-else type="info">待定</el-tag>
                   </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" align="center" prop="orderId" v-if="true" />
        <el-table-column label="用户名称" align="center" prop="userName" />
        <el-table-column label="投注金額" align="center" prop="betAmount" />
        <el-table-column label="過關類型" align="center" prop="combinationType" />
        <el-table-column label="赔率" align="center" prop="oddsDesc" />

        <el-table-column label="訂單狀態" align="center" prop="status">
            <template #default="scope">
                <el-tag v-if="scope.row.status === 'won'" type="success">已中獎</el-tag>
                <el-tag v-else-if="scope.row.status === 'lost'" type="danger">未中獎</el-tag>
                <el-tag v-else-if="scope.row.status === 'pending'" type="warning">待開獎</el-tag>
                <el-tag v-else-if="scope.row.status === 'draft'" type="info">等待投注</el-tag>
                <el-tag v-else-if="scope.row.status === 'void'" type="info">订单失效</el-tag>
                <el-tag v-else type="info">{{ scope.row.status }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="中奖金额" align="center" prop="payoutAmount" />
        <el-table-column label="创建时间" align="center" prop="createTime" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['biz:betOrders:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['biz:betOrders:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改使用者投注訂單对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="betOrdersFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="用户id" />
        </el-form-item>
        <el-form-item label="總投注金額" prop="betAmount">
          <el-input v-model="form.betAmount" placeholder="请输入總投注金額" />
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

<script setup name="BetOrders" lang="ts">
import { listBetOrders, getBetOrders, delBetOrders, addBetOrders, updateBetOrders } from '@/api/biz/betOrders';
import { listDetails, batchUpdateOdds } from '@/api/biz/betOrderDetails';
import { BetOrdersVO, BetOrdersQuery, BetOrdersForm } from '@/api/biz/betOrders/types';
import { BetOrderDetailsQuery, BatchUpdateOddsDto, BetOrderDetailsVO } from '@/api/biz/betOrderDetails/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

// 【新增】玩法代码翻译 Map
const poolCodeMap: Record<string, string> = {
  'HAD': '胜平负',
  'HHAD': '让球胜平负',
  'CRS': '比分',
  'TTG': '总进球',
  'HAFU': '半全场'
};

const translatePoolCode = (code: string) => {
  return poolCodeMap[code.toUpperCase()] || code;
};

// 【新增】订单状态选项
const statusOptions = ref([
  { value: 'draft', label: '等待投注' },
  { value: 'pending', label: '待开奖' },
  { value: 'won', label: '已中獎' },
  { value: 'lost', label: '未中獎' },
  { value: 'void', label: '作廢' }
]);


const betOrdersList = ref<BetOrdersVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const tableKey = ref(0); // 【新增】用于强制刷新表格的 key

const queryFormRef = ref<ElFormInstance>();
const betOrdersFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: BetOrdersForm = {
  orderId: undefined,
  userId: undefined,
  userName: undefined,
  betAmount: undefined,
  combinationType: undefined,
  status: undefined,
  payoutAmount: undefined,
}
const data = reactive<PageData<BetOrdersForm, BetOrdersQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userId: undefined,
    betAmount: undefined,
    combinationType: undefined,
    status: 'draft', // 【核心修改】设置默认筛选值为 'draft'
    payoutAmount: undefined,
    params: {
    }
  },
  rules: {
    orderId: [
      { required: true, message: "訂單ID, 主鍵不能为空", trigger: "blur" }
    ],
    userId: [
      { required: true, message: "下注使用者ID不能为空", trigger: "blur" }
    ],
    betAmount: [
      { required: true, message: "總投注金額不能为空", trigger: "blur" }
    ],
    combinationType: [
      { required: true, message: "過關類型不能为空", trigger: "change" }
    ],
    status: [
      { required: true, message: "訂單狀態不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询使用者投注訂單列表 */
const getList = async () => {
  loading.value = true;
  const res = await listBetOrders(queryParams.value);
  // 为每行数据添加一个空的 details 数组，用于存放子表数据
  res.rows.forEach((row: any) => row.details = []);
  betOrdersList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 【新增】處理投注詳情表格的合併邏輯 */
const detailsSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  // 合併「比賽」列
  if (columnIndex === 0) {
    return {
      rowspan: row.matchSpan,
      colspan: 1
    };
  }
  // 合併「玩法」列
  if (columnIndex === 1) {
    return {
      rowspan: row.poolSpan,
      colspan: 1
    };
  }
};

/** 【新增】預處理投注詳情數據，計算行合併信息 */
const getProcessedDetails = (details: BetOrderDetailsVO[]) => {
    if (!details || details.length === 0) return [];

    // 1. 為了正確合併，先按比賽和玩法排序
    details.sort((a, b) => {
        if (a.matchId! - b.matchId! !== 0) {
          return a.matchId! - b.matchId!;
        }
        return a.poolCode!.localeCompare(b.poolCode!);
    });

    const matchSpans: Record<number, number> = {};
    const poolSpans: Record<string, number> = {};

    // 2. 第一遍：計算每個比賽和玩法的總行數
    details.forEach(detail => {
        matchSpans[detail.matchId!] = (matchSpans[detail.matchId!] || 0) + 1;
        const poolKey = `${detail.matchId}-${detail.poolCode}`;
        poolSpans[poolKey] = (poolSpans[poolKey] || 0) + 1;
    });

    const processedMatches = new Set<number>();
    const processedPools = new Set<string>();

    // 3. 第二遍：為每行分配 rowspan 值
    return details.map(detail => {
        let matchSpan = 0;
        if (!processedMatches.has(detail.matchId!)) {
            matchSpan = matchSpans[detail.matchId!];
            processedMatches.add(detail.matchId!);
        }

        let poolSpan = 0;
        const poolKey = `${detail.matchId}-${detail.poolCode}`;
        if (!processedPools.has(poolKey)) {
            poolSpan = poolSpans[poolKey];
            processedPools.add(poolKey);
        }

        return { ...detail, matchSpan, poolSpan };
    });
};


/** 【已重構】处理行展开事件，增加行合併處理 */
const handleExpandChange = async (row: BetOrdersVO, expandedRows: BetOrdersVO[]) => {
    // 判断行是否被展开
    const isExpanded = expandedRows.some(r => r.orderId === row.orderId);
    if (isExpanded && (!row.details || row.details.length === 0)) {
        // 如果行被展开且尚未加载过详情数据
        try {
            const query: BetOrderDetailsQuery = { orderId: row.orderId };
            const res = await listDetails(query);
            const rawDetails = res.rows || res;
            // 【核心修改】在渲染前處理數據以支持行合併
            row.details = getProcessedDetails(rawDetails);
        } catch (error) {
            console.error(`加载订单 ${row.orderId} 的详情失败`, error);
            proxy?.$modal.msgError("加载详情失败");
        }
    }
}

/** 【已重构】批量保存赔率按钮操作 */
const handleBatchUpdateOdds = async (orderRow: BetOrdersVO) => {
  if (!orderRow.details || orderRow.details.length === 0) {
    proxy?.$modal.msgWarning("没有可保存的详情数据");
    return;
  }

  const updatedDetails = orderRow.details.map((detail: BetOrderDetailsVO) => ({
    detailId: detail.detailId,
    odds: detail.odds
  }));

  const dto: BatchUpdateOddsDto = {
    details: updatedDetails
  };

  buttonLoading.value = true;
  try {
    await batchUpdateOdds(dto);
    proxy?.$modal.msgSuccess("赔率保存成功");

    // 优化刷新逻辑：只更新当前行数据，避免表格折叠
    const [mainOrderRes, detailsRes] = await Promise.all([
        getBetOrders(orderRow.orderId),
        listDetails({ orderId: orderRow.orderId })
    ]);

    const index = betOrdersList.value.findIndex(o => o.orderId === orderRow.orderId);
    if (index !== -1 && mainOrderRes.data) {
        const rawDetails = detailsRes.rows || detailsRes;
        // 【核心修改】刷新後同樣需要處理數據以保持合併效果
        const newDetails = getProcessedDetails(rawDetails);
        betOrdersList.value[index] = { ...mainOrderRes.data, details: newDetails };
    } else {
        await getList(); // Fallback
    }

  } finally {
    buttonLoading.value = false;
  }
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  betOrdersFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  tableKey.value++; // 【核心修改】递增 key 值，强制 Element Plus 表格重新渲染，从而收起所有展开行
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: BetOrdersVO[]) => {
  ids.value = selection.map(item => item.orderId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加使用者投注訂單";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: BetOrdersVO) => {
  reset();
  const _orderId = row?.orderId || ids.value[0]
  const res = await getBetOrders(_orderId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改使用者投注訂單";
}

/** 提交按钮 */
const submitForm = () => {
  betOrdersFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.orderId) {
        await updateBetOrders(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addBetOrders(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: BetOrdersVO) => {
  const _orderIds = row?.orderId || ids.value;
  await proxy?.$modal.confirm('是否确认删除使用者投注訂單编号为"' + _orderIds + '"的数据项？').finally(() => loading.value = false);
  await delBetOrders(_orderIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('biz/betOrders/export', {
    ...queryParams.value
  }, `betOrders_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>

