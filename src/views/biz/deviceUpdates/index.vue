<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="设备唯一标识符" prop="deviceId">
              <el-input v-model="queryParams.deviceId" placeholder="请输入设备唯一标识符" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="平台" prop="platform">
              <el-input v-model="queryParams.platform" placeholder="请输入平台" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="升级前的版本号" prop="fromVersion">
              <el-input v-model="queryParams.fromVersion" placeholder="请输入升级前的版本号" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="目标升级版本号" prop="toVersion">
              <el-input v-model="queryParams.toVersion" placeholder="请输入目标升级版本号" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="下载开始时间" prop="downloadStartedAt">
              <el-date-picker clearable
                v-model="queryParams.downloadStartedAt"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择下载开始时间"
              />
            </el-form-item>
            <el-form-item label="下载完成时间" prop="downloadCompletedAt">
              <el-date-picker clearable
                v-model="queryParams.downloadCompletedAt"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择下载完成时间"
              />
            </el-form-item>
            <el-form-item label="安装开始时间" prop="installStartedAt">
              <el-date-picker clearable
                v-model="queryParams.installStartedAt"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择安装开始时间"
              />
            </el-form-item>
            <el-form-item label="安装完成时间" prop="installCompletedAt">
              <el-date-picker clearable
                v-model="queryParams.installCompletedAt"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择安装完成时间"
              />
            </el-form-item>
            <el-form-item label="失败时的错误信息" prop="errorMessage">
              <el-input v-model="queryParams.errorMessage" placeholder="请输入失败时的错误信息" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="记录创建时间" prop="createdAt">
              <el-date-picker clearable
                v-model="queryParams.createdAt"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择记录创建时间"
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['biz:deviceUpdates:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['biz:deviceUpdates:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['biz:deviceUpdates:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['biz:deviceUpdates:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="deviceUpdatesList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键ID" align="center" prop="id" v-if="true" />
        <el-table-column label="设备唯一标识符" align="center" prop="deviceId" />
        <el-table-column label="平台" align="center" prop="platform" />
        <el-table-column label="升级前的版本号" align="center" prop="fromVersion" />
        <el-table-column label="目标升级版本号" align="center" prop="toVersion" />
        <el-table-column label="更新类型" align="center" prop="updateType" />
        <el-table-column label="下载开始时间" align="center" prop="downloadStartedAt" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.downloadStartedAt, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="下载完成时间" align="center" prop="downloadCompletedAt" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.downloadCompletedAt, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="安装开始时间" align="center" prop="installStartedAt" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.installStartedAt, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="安装完成时间" align="center" prop="installCompletedAt" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.installCompletedAt, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="升级状态" align="center" prop="status" />
        <el-table-column label="失败时的错误信息" align="center" prop="errorMessage" />
        <el-table-column label="记录创建时间" align="center" prop="createdAt" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createdAt, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['biz:deviceUpdates:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['biz:deviceUpdates:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改设备更新记录对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="deviceUpdatesFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备唯一标识符" prop="deviceId">
          <el-input v-model="form.deviceId" placeholder="请输入设备唯一标识符" />
        </el-form-item>
        <el-form-item label="平台" prop="platform">
          <el-input v-model="form.platform" placeholder="请输入平台" />
        </el-form-item>
        <el-form-item label="升级前的版本号" prop="fromVersion">
          <el-input v-model="form.fromVersion" placeholder="请输入升级前的版本号" />
        </el-form-item>
        <el-form-item label="目标升级版本号" prop="toVersion">
          <el-input v-model="form.toVersion" placeholder="请输入目标升级版本号" />
        </el-form-item>
        <el-form-item label="下载开始时间" prop="downloadStartedAt">
          <el-date-picker clearable
            v-model="form.downloadStartedAt"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择下载开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="下载完成时间" prop="downloadCompletedAt">
          <el-date-picker clearable
            v-model="form.downloadCompletedAt"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择下载完成时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="安装开始时间" prop="installStartedAt">
          <el-date-picker clearable
            v-model="form.installStartedAt"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择安装开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="安装完成时间" prop="installCompletedAt">
          <el-date-picker clearable
            v-model="form.installCompletedAt"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择安装完成时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="失败时的错误信息" prop="errorMessage">
            <el-input v-model="form.errorMessage" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="记录创建时间" prop="createdAt">
          <el-date-picker clearable
            v-model="form.createdAt"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择记录创建时间">
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

<script setup name="DeviceUpdates" lang="ts">
import { listDeviceUpdates, getDeviceUpdates, delDeviceUpdates, addDeviceUpdates, updateDeviceUpdates } from '@/api/biz/deviceUpdates';
import { DeviceUpdatesVO, DeviceUpdatesQuery, DeviceUpdatesForm } from '@/api/biz/deviceUpdates/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const deviceUpdatesList = ref<DeviceUpdatesVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const deviceUpdatesFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: DeviceUpdatesForm = {
  id: undefined,
  deviceId: undefined,
  platform: undefined,
  fromVersion: undefined,
  toVersion: undefined,
  updateType: undefined,
  downloadStartedAt: undefined,
  downloadCompletedAt: undefined,
  installStartedAt: undefined,
  installCompletedAt: undefined,
  status: undefined,
  errorMessage: undefined,
  createdAt: undefined
}
const data = reactive<PageData<DeviceUpdatesForm, DeviceUpdatesQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deviceId: undefined,
    platform: undefined,
    fromVersion: undefined,
    toVersion: undefined,
    updateType: undefined,
    downloadStartedAt: undefined,
    downloadCompletedAt: undefined,
    installStartedAt: undefined,
    installCompletedAt: undefined,
    status: undefined,
    errorMessage: undefined,
    createdAt: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "主键ID不能为空", trigger: "blur" }
    ],
    deviceId: [
      { required: true, message: "设备唯一标识符不能为空", trigger: "blur" }
    ],
    platform: [
      { required: true, message: "平台不能为空", trigger: "blur" }
    ],
    toVersion: [
      { required: true, message: "目标升级版本号不能为空", trigger: "blur" }
    ],
    updateType: [
      { required: true, message: "更新类型不能为空", trigger: "change" }
    ],
    createdAt: [
      { required: true, message: "记录创建时间不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询设备更新记录列表 */
const getList = async () => {
  loading.value = true;
  const res = await listDeviceUpdates(queryParams.value);
  deviceUpdatesList.value = res.rows;
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
  deviceUpdatesFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: DeviceUpdatesVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加设备更新记录";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: DeviceUpdatesVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getDeviceUpdates(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改设备更新记录";
}

/** 提交按钮 */
const submitForm = () => {
  deviceUpdatesFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateDeviceUpdates(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addDeviceUpdates(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: DeviceUpdatesVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除设备更新记录编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delDeviceUpdates(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('biz/deviceUpdates/export', {
    ...queryParams.value
  }, `deviceUpdates_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
