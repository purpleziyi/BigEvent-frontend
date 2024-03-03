<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { ref } from 'vue'
const categorys = ref([
    {
        "id": 3,
        "categoryName": "food",
        "categoryAlias": "fd",
        "createTime": "2023-09-02 12:06:59",
        "updateTime": "2023-09-02 12:06:59"
    },
    {
        "id": 4,
        "categoryName": "entertainment",
        "categoryAlias": "et",
        "createTime": "2023-09-02 12:08:16",
        "updateTime": "2023-09-02 12:08:16"
    },
    {
        "id": 5,
        "categoryName": "military",
        "categoryAlias": "ml",
        "createTime": "2023-09-02 12:08:33",
        "updateTime": "2023-09-02 12:08:33"
    }
])
// Declare an asynchronous function
import { articleCategoryListService, articleCategoryAddService, articleCategoryUpdateService, articleCategoryDeleteService } from '@/api/article.js'
const articleCategoryList = async () => {
    let result = await articleCategoryListService();
    categorys.value = result.data;

}
articleCategoryList();
//add category pop-up window
const dialogVisible = ref(false)  // default: hide the window

//Add a categorical data model
const categoryModel = ref({
    categoryName: '',
    categoryAlias: ''
})

//添加分类表单校验 Add category form validation
const rules = {
    categoryName: [
        { required: true, message: 'Please enter the category name', trigger: 'blur' },
    ],
    categoryAlias: [
        { required: true, message: 'Please enter the category alias', trigger: 'blur' },
    ]
}


//调用接口,添加表单 Call the API, add a form   "Confirm"BUTTON in add category
import { ElMessage } from 'element-plus'
const addCategory = async () => {
    // Call the API 
    let result = await articleCategoryAddService(categoryModel.value);
    ElMessage.success(result.msg ? result.msg : 'Successfully added')

    // call the function for getting all article-categories
    articleCategoryList();
    dialogVisible.value = false;  // after refreshing list, Hide pop-up window
}

// Define variables to control the display of titles 定义变量,控制标题的展示
const title = ref('')

// display edit-popUp 
const showDialog = (row) => {
    dialogVisible.value = true; title.value = 'Edit Category'
    // copy data
    categoryModel.value.categoryName = row.categoryName;
    categoryModel.value.categoryAlias = row.categoryAlias;
    // extend id-attribute, will pass to the background to complete the modification 将来需要传递给后台,完成分类的修改 
    categoryModel.value.id = row.id
}

// edit category , "Confirm"BUTTON  
const updateCategory = async () => {
    // call API
    let result = await articleCategoryUpdateService(categoryModel.value);

    ElMessage.success(result.msg ? result.msg : 'Successfully modified')

    //call the function for getting all article-categories
    articleCategoryList();

    //Hide pop-up window
    dialogVisible.value = false;
}

// clear data model
const clearData = () => {
    categoryModel.value.categoryName = '';
    categoryModel.value.categoryAlias = '';
}

// Delete category
import { ElMessageBox } from 'element-plus'
const deleteCategory = (row) => {
    // reminder user with a confirm-MessageBox, refer to Element-plus demo-code
    ElMessageBox.confirm(
        'Are you sure you want to delete this category?',
        'Warning',
        {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
        }
    )
        .then(async () => {
            // call API
            let result = await articleCategoryDeleteService(row.id);
            ElMessage({
                type: 'success',
                message: 'Delete completed',
            })
            // refresh list
            articleCategoryList();
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: 'Delete canceled',
            })
        })
}
</script>
<template>
    <!---模版部分-->
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>Article Category</span>
                <div class="extra">
                    <el-button type="primary" @click="dialogVisible = true; title = 'Add Category'; clearData()">Add
                        Category</el-button>
                </div>
            </div>
        </template>
        <el-table :data="categorys" style="width: 100%">
            <el-table-column label="No." width="100" type="index"> </el-table-column>
            <el-table-column label="Category Name" prop="categoryName"></el-table-column>
            <el-table-column label="Category Alias" prop="categoryAlias"></el-table-column>
            <el-table-column label="Operation" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="showDialog(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteCategory(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="No Data" />
            </template>
        </el-table>

        <!-- 添加分类弹窗 Add category pop-up window -->
        <el-dialog v-model="dialogVisible" :title="title" width="30%">
            <el-form :model="categoryModel" :rules="rules" label-width="100px" style="padding-right: 30px">
                <el-form-item label="CategoryName" prop="categoryName">
                    <el-input v-model="categoryModel.categoryName" minlength="1" maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="CategoryAlias" prop="categoryAlias">
                    <el-input v-model="categoryModel.categoryAlias" minlength="1" maxlength="15"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="title == 'Add Category' ? addCategory() : updateCategory()"> Confirm
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </el-card>
</template>

<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
</style>