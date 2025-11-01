<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="ossId" prop="ossId">
              <el-input v-model="queryParams.ossId" placeholder="请输入ossId" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="平台 (android 或 ios)" prop="platform">
              <el-input v-model="queryParams.platform" placeholder="请输入平台 (android 或 ios)" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="构建号" prop="buildNumber">
              <el-input v-model="queryParams.buildNumber" placeholder="请输入构建号" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="APK文件大小 (单位: 字节)" prop="fileSize">
              <el-input v-model="queryParams.fileSize" placeholder="请输入APK文件大小 (单位: 字节)" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="APK下载地址" prop="downloadUrl">
              <el-input v-model="queryParams.downloadUrl" placeholder="请输入APK下载地址" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="文件校验和 (推荐使用SHA-256)" prop="checksum">
              <el-input v-model="queryParams.checksum" placeholder="请输入文件校验和 (推荐使用SHA-256)" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="版本更新日志" prop="releaseNotes">
              <el-input v-model="queryParams.releaseNotes" placeholder="请输入版本更新日志" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="最低支持的客户端版本" prop="minSupportedVersion">
              <el-input v-model="queryParams.minSupportedVersion" placeholder="请输入最低支持的客户端版本" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="是否强制更新 (0: 否, 1: 是)" prop="forceUpdate">
              <el-input v-model="queryParams.forceUpdate" placeholder="请输入是否强制更新 (0: 否, 1: 是)" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="强制更新的最后期限" prop="updateDeadline">
              <el-date-picker clearable
                v-model="queryParams.updateDeadline"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择强制更新的最后期限"
              />
            </el-form-item>
            <el-form-item label="该版本是否为活跃版本，可供检查 (0: 否, 1: 是)" prop="isActive">
              <el-input v-model="queryParams.isActive" placeholder="请输入该版本是否为活跃版本，可供检查 (0: 否, 1: 是)" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="创建时间" prop="createdAt">
              <el-date-picker clearable
                v-model="queryParams.createdAt"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择创建时间"
              />
            </el-form-item>
            <el-form-item label="更新时间" prop="updatedAt">
              <el-date-picker clearable
                v-model="queryParams.updatedAt"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择更新时间"
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['biz:appVersions:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['biz:appVersions:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['biz:appVersions:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['biz:appVersions:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="appVersionsList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键ID" align="center" prop="id" v-if="true" />
        <el-table-column label="ossId" align="center" prop="ossId" />
        <el-table-column label="平台 (android 或 ios)" align="center" prop="platform" />
        <el-table-column label="构建号" align="center" prop="buildNumber" />
        <el-table-column label="APK文件大小 (单位: 字节)" align="center" prop="fileSize" />
        <el-table-column label="APK下载地址" align="center" prop="downloadUrl" />
        <el-table-column label="文件校验和 (推荐使用SHA-256)" align="center" prop="checksum" />
        <el-table-column label="版本更新日志" align="center" prop="releaseNotes" />
        <el-table-column label="最低支持的客户端版本" align="center" prop="minSupportedVersion" />
        <el-table-column label="是否强制更新 (0: 否, 1: 是)" align="center" prop="forceUpdate" />
        <el-table-column label="强制更新的最后期限" align="center" prop="updateDeadline" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.updateDeadline, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="该版本是否为活跃版本，可供检查 (0: 否, 1: 是)" align="center" prop="isActive" />
        <el-table-column label="创建时间" align="center" prop="createdAt" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createdAt, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center" prop="updatedAt" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.updatedAt, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['biz:appVersions:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['biz:appVersions:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改应用版本信息对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="appVersionsFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="ossId" prop="ossId">
          <el-input v-model="form.ossId" placeholder="请输入ossId" />
        </el-form-item>
        <el-form-item label="平台 (android 或 ios)" prop="platform">
          <el-input v-model="form.platform" placeholder="请输入平台 (android 或 ios)" />
        </el-form-item>
        <el-form-item label="构建号" prop="buildNumber">
          <el-input v-model="form.buildNumber" placeholder="请输入构建号" />
        </el-form-item>
        <el-form-item label="APK文件大小 (单位: 字节)" prop="fileSize">
          <el-input v-model="form.fileSize" placeholder="请输入APK文件大小 (单位: 字节)" />
        </el-form-item>
        <el-form-item label="APK下载地址" prop="downloadUrl">
            <el-input v-model="form.downloadUrl" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="文件校验和 (推荐使用SHA-256)" prop="checksum">
          <el-input v-model="form.checksum" placeholder="请输入文件校验和 (推荐使用SHA-256)" />
        </el-form-item>
        <el-form-item label="版本更新日志" prop="releaseNotes">
            <el-input v-model="form.releaseNotes" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="最低支持的客户端版本" prop="minSupportedVersion">
          <el-input v-model="form.minSupportedVersion" placeholder="请输入最低支持的客户端版本" />
        </el-form-item>
        <el-form-item label="是否强制更新 (0: 否, 1: 是)" prop="forceUpdate">
          <el-input v-model="form.forceUpdate" placeholder="请输入是否强制更新 (0: 否, 1: 是)" />
        </el-form-item>
        <el-form-item label="强制更新的最后期限" prop="updateDeadline">
          <el-date-picker clearable
            v-model="form.updateDeadline"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择强制更新的最后期限">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="该版本是否为活跃版本，可供检查 (0: 否, 1: 是)" prop="isActive">
          <el-input v-model="form.isActive" placeholder="请输入该版本是否为活跃版本，可供检查 (0: 否, 1: 是)" />
        </el-form-item>
        <el-form-item label="创建时间" prop="createdAt">
          <el-date-picker clearable
            v-model="form.createdAt"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="更新时间" prop="updatedAt">
          <el-date-picker clearable
            v-model="form.updatedAt"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择更新时间">
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

<script setup name="AppVersions" lang="ts">
import { listAppVersions, getAppVersions, delAppVersions, addAppVersions, updateAppVersions } from '@/api/biz/appVersions';
import { AppVersionsVO, AppVersionsQuery, AppVersionsForm } from '@/api/biz/appVersions/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const appVersionsList = ref<AppVersionsVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const appVersionsFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: AppVersionsForm = {
  id: undefined,
  ossId: undefined,
  platform: undefined,
  buildNumber: undefined,
  fileSize: undefined,
  downloadUrl: undefined,
  checksum: undefined,
  releaseNotes: undefined,
  minSupportedVersion: undefined,
  forceUpdate: undefined,
  updateDeadline: undefined,
  isActive: undefined,
  createdAt: undefined,
  updatedAt: undefined,
}
const data = reactive<PageData<AppVersionsForm, AppVersionsQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    ossId: undefined,
    platform: undefined,
    buildNumber: undefined,
    fileSize: undefined,
    downloadUrl: undefined,
    checksum: undefined,
    releaseNotes: undefined,
    minSupportedVersion: undefined,
    forceUpdate: undefined,
    updateDeadline: undefined,
    isActive: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "主键ID不能为空", trigger: "blur" }
    ],
    platform: [
      { required: true, message: "平台 (android 或 ios)不能为空", trigger: "blur" }
    ],
    downloadUrl: [
      { required: true, message: "APK下载地址不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询应用版本信息列表 */
const getList = async () => {
  loading.value = true;
  const res = await listAppVersions(queryParams.value);
  appVersionsList.value = res.rows;
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
  appVersionsFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: AppVersionsVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加应用版本信息";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: AppVersionsVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getAppVersions(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改应用版本信息";
}

/** 提交按钮 */
const submitForm = () => {
  appVersionsFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateAppVersions(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addAppVersions(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: AppVersionsVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除应用版本信息编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delAppVersions(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('biz/appVersions/export', {
    ...queryParams.value
  }, `appVersions_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
