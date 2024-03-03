<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'

import { ref } from 'vue'

//data-model 文章分类数据模型
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

//用户搜索时选中的分类id
const categoryId = ref('')

//用户搜索时选中的发布状态
const state = ref('')

//文章列表数据模型
const articles = ref([
    {
        "id": 5,
        "title": "China travel guide",
        "content": "Beijing, Shanghai, Nanjing...",
        "coverImg": "https://big-event-gwd.oss-cn-beijing.aliyuncs.com/9bf1cf5b-1420-4c1b-91ad-e0f4631cbed4.png",
        "state": "Draft",
        "categoryId": 2,
        "createTime": "2024-03-03 11:55:30",
        "updateTime": "2024-03-03 11:55:30"
    },
    {
        "id": 5,
        "title": "China travel guide",
        "content": "Beijing, Shanghai, Nanjing...",
        "coverImg": "https://big-event-gwd.oss-cn-beijing.aliyuncs.com/9bf1cf5b-1420-4c1b-91ad-e0f4631cbed4.png",
        "state": "Draft",
        "categoryId": 2,
        "createTime": "2024-03-03 11:55:30",
        "updateTime": "2024-03-03 11:55:30"
    },
    {
        "id": 5,
        "title": "China travel guide",
        "content": "Beijing, Shanghai, Nanjing...",
        "coverImg": "https://big-event-gwd.oss-cn-beijing.aliyuncs.com/9bf1cf5b-1420-4c1b-91ad-e0f4631cbed4.png",
        "state": "Draft",
        "categoryId": 2,
        "createTime": "2024-03-03 11:55:30",
        "updateTime": "2024-03-03 11:55:30"
    },
])

//分页条数据模型 pagination data model
const pageNum = ref(1)// current page
const total = ref(20)// totle items
const pageSize = ref(3)// items on each page

//当每页条数发生了变化，调用此函数  call this function when items on page changes
const onSizeChange = (size) => {
    pageSize.value = size
    articleList()
}
//当前页码发生变化，调用此函数 call this function when current page changes
const onCurrentChange = (num) => {
    pageNum.value = num
    articleList()
}


//display article category 回显文章分类
import { articleCategoryListService, articleListService, articleAddService, articleUpdateService, articleDeleteService } from '@/api/article.js'
const articleCategoryList = async () => {
    let result = await articleCategoryListService();

    categorys.value = result.data;
}

//获取文章列表数据  get data of article category
const articleList = async () => {
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        categoryId: categoryId.value ? categoryId.value : null,
        state: state.value ? state.value : null
    }
    let result = await articleListService(params);

    // render view
    total.value = result.data.total;
    articles.value = result.data.items;

    //handle data, extend the data-model with an attribute categoryName,分类名称
    for (let i = 0; i < articles.value.length; i++) {
        let article = articles.value[i];
        for (let j = 0; j < categorys.value.length; j++) {
            if (article.categoryId == categorys.value[j].id) {
                article.categoryName = categorys.value[j].categoryName;
            }
        }
    }
}

articleCategoryList()
articleList();

// //add article pop-up window  文章列表弹窗
// const dialogVisible = ref(false)  // default: hide the window

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { Plus } from '@element-plus/icons-vue'
//Control whether the drawer is displayed
const visibleDrawer = ref(false)
//添加表单数据模型 Add form data model
const articleModel = ref({
    title: '',
    categoryId: '',
    coverImg: '',
    content: '',
    state: ''
})


//import token
import { useTokenStore } from '@/stores/token.js';
const tokenStore = useTokenStore();

//上传成功的回调函数 Callback function for successful upload
const uploadSuccess = (result) => {
    articleModel.value.coverImg = result.data;
    console.log(result.data);
}

//添加文章 add article
import { ElMessage } from 'element-plus'
const addArticle = async (clickState) => {
    //assign state to the data-model 
    articleModel.value.state = clickState;

    // call API
    let result = await articleAddService(articleModel.value);

    ElMessage.success(result.msg ? result.msg : 'Successfully added');

    // hide Drawer
    visibleDrawer.value = false;

    // refresh current list
    articleList()
}

// Define variables to control the display of titles 
const title = ref('')

// dispay edit-Drawer
const showDrawer = (row) => {
    visibleDrawer.value = true; title.value = 'Edit Article'
    // copy data
    articleModel.value.title = row.title;
    articleModel.value.categoryId = row.categoryId;
    articleModel.value.coverImg = row.coverImg;
    articleModel.value.content = row.content;
    // extend id-attribute, will pass to the background to complete the modification  
    articleModel.value.id = row.id
}

// edit article, "Confirm"BUTTON  
const updateArticle = async () => {
    // call API
    let result = await articleUpdateService(articleModel.value);

    ElMessage.success(result.msg ? result.msg : 'Successfully modified')

    //call the function for getting all articleList
    articleList();

    //Hide drawer
    visibleDrawer.value = false;
}

// clear data model
const clearData = () => {
    articleModel.value.title = '';
    articleModel.value.categoryId = '';
    articleModel.value.coverImg = '';
    articleModel.value.content = '';
}

// Delete article
import { ElMessageBox } from 'element-plus'
const deleteArticle = (row) => {
    // reminder user with a confirm-MessageBox, refer to Element-plus demo-code
    ElMessageBox.confirm(
        'Are you sure you want to delete this article?',
        'Warning',
        {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
        }
    )
        .then(async () => {
            // call API
            let result = await articleDeleteService(row.id);
            ElMessage({
                type: 'success',
                message: 'Delete completed',
            })
            // refresh list
            articleList();
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
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>Article Management</span>
                <div class="extra">
                    <el-button type="primary" @click="visibleDrawer = true">Add Article</el-button>
                </div>
            </div>
        </template>
        <!-- 搜索表单 -->
        <el-form inline>
            <el-form-item label="Article Category:">
                <el-select placeholder="please choose" v-model="categoryId">
                    <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="Post status:">
                <el-select placeholder="please choose" v-model="state">
                    <el-option label="Published" value="Published"></el-option>
                    <el-option label="Draft" value="Draft"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="articleList">Search</el-button>
                <el-button @click="categoryId = ''; state = ''">Reset</el-button>
            </el-form-item>
        </el-form>
        <!-- Article List -->
        <el-table :data="articles" style="width: 100%">
            <el-table-column label="Article Title" width="400" prop="title"></el-table-column>
            <el-table-column label="Category" prop="categoryName"></el-table-column>
            <el-table-column label="Create Time" prop="createTime"> </el-table-column>
            <el-table-column label="State" prop="state"></el-table-column>
            <el-table-column label="Operation" width="100">
                <template #default="{ row }">
                    <!-- Edit + Delete -->
                    <el-button :icon="Edit" circle plain type="primary" @click="showDrawer(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteArticle(row)"> </el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="No Data" />
            </template>
        </el-table>

        <!-- pagination -->
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5, 10, 15]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />

        <!-- Drawer -->
        <el-drawer v-model="visibleDrawer" title="Add Article" direction="rtl" size="50%">
            <!--  add article list-->
            <el-form :model="articleModel" label-width="100px">
                <el-form-item label="Article Title">
                    <el-input v-model="articleModel.title" placeholder="Enter title"></el-input>
                </el-form-item>
                <el-form-item label="Category">
                    <el-select placeholder="please choose" v-model="articleModel.categoryId">
                        <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Article Cover">

                    <!-- 
                        auto-upload:设置是否自动上传
                        action:设置服务器接口路径
                        name:设置上传的文件字段名
                        headers:设置上传的请求头
                        on-success:设置上传成功的回调函数
                     -->

                    <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false" action="/api/upload"
                        name="file" :headers="{ 'Authorization': tokenStore.token }" :on-success="uploadSuccess">
                        <img v-if="articleModel.coverImg" :src="articleModel.coverImg" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item label="Article Content">
                    <div class="editor"> <!--rich text editor QUILL-->>
                        <quill-editor theme="snow" v-model:content="articleModel.content" contentType="html">
                        </quill-editor>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary"
                        @click="title == 'Add Article' ? addArticle('Published') : updateArticle()">Publish</el-button>
                    <el-button type="info" @click="addArticle('Draft')">Draft</el-button>
                    <el-button @click="visibleDrawer = false">Cancel</el-button> <!--自己添加-->>
                </el-form-item>
            </el-form>
        </el-drawer>
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

/* Drawer Style */
.avatar-uploader {
    :deep() {
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            text-align: center;
        }
    }
}

.editor {
    width: 100%;

    :deep(.ql-editor) {
        min-height: 200px;
    }
}
</style>