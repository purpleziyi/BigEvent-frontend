<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'

import { ref } from 'vue'

//data-model 文章分类数据模型
const categorys = ref([])
 
const categoryId = ref('')
 
const state = ref('')

//文章列表数据模型
const articles = ref([])

// pagination data model
const pageNum = ref(1)// current page
const total = ref(20)// totle items
const pageSize = ref(5)// items on each page

// call this function when items on page changes
const onSizeChange = (size) => {
    pageSize.value = size
    articleList()
}
// call this function when current page changes
const onCurrentChange = (num) => {
    pageNum.value = num
    articleList()
}


//display article category 
import { articleCategoryListService, articleListService, articleAddService, articleUpdateService, articleDeleteService } from '@/api/article.js'
const articleCategoryList = async () => {
    let result = await articleCategoryListService();
    categorys.value = result.data;
}

// get data of article category
const articleList = async () => {
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        categoryId: categoryId.value ? categoryId.value : null,  // optional 
        state: state.value ? state.value : null  // optional 
    }
    let result = await articleListService(params);  // 用result接收获取的数据结果

    total.value = result.data.total;  // 将获取的total赋值给const total总条数
    articles.value = result.data.items;  // 将获取来的item赋值给table的数据模型articles

    //处理数据模型，给数据模型扩展一个属性categoryName
    for (let i = 0; i < articles.value.length; i++) {
        let article = articles.value[i];
        for (let j = 0; j < categorys.value.length; j++) {
            if (article.categoryId == categorys.value[j].id) { // 若当前article的categoryId与某个category的id相同，就把这个类别的名字赋值给这个article的类别
                article.categoryName = categorys.value[j].categoryName;
            }
        }
    }
}

articleCategoryList(); // 先调用
articleList();  // 后调用

// //add article pop-up window 
// const dialogVisible = ref(false)  // default: hide the window
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { Plus } from '@element-plus/icons-vue'
//Control whether the drawer is displayed
const visibleDrawer = ref(false)
// Add form data model
const articleModel = ref({
    title: '',
    categoryId: '',
    coverImg: '',
    content: '',
    state: ''
})

// form validation
const rules = {
    title: [
        { required: true, message: 'Please enter the article title', trigger: 'blur' },
    ],
    categoryId: [
        { required: true, message: 'Please choose the article category', trigger: 'blur' },
    ],
    coverImg: [
        { required: true, message: 'Please upload the cover image', trigger: 'blur' },
    ],
    content: [
        { required: true, message: 'Please enter the article content', trigger: 'blur' },
    ]
}

//import token
import { useTokenStore } from '@/stores/token.js';
const tokenStore = useTokenStore();  // 调用函数得到一个tokenStore

//  Callback function for successful upload
const uploadSuccess = (result) => {
    articleModel.value.coverImg = result.data;
    console.log(result.data);
}

//  add article
import { ElMessage } from 'element-plus'
const addArticle = async (clickState) => {
    //assign state to the data-model 
    articleModel.value.state = clickState;
    // call API
    let result = await articleAddService(articleModel.value);
    ElMessage.success(result.msg ? result.msg : 'Post Successfully ');

    // hide Drawer
    visibleDrawer.value = false;

    // refresh current list
    articleList();
}

// Define variables to control the display of titles 
const title = ref('')

// dispay edit-Drawer
const showDrawer = (row) => {
    visibleDrawer.value = true; 
    title.value = 'Edit Article'
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

    ElMessage.success(result.msg ? result.msg : 'Edit Successfully')

    // Refresh the article list to reflect changes
    await articleList();  // 加入 await 以确保数据在列表刷新之前已更新

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
                    <el-button type="primary" @click="visibleDrawer = true; title ='Add Article'; clearData()">Add
                        Article</el-button>
                </div>
            </div>
        </template>
        <!-- search form -->
        <el-form inline>
            <el-form-item label="Article Category:">
                <el-select placeholder="please choose" v-model="categoryId" style="width: 200px;">
                    <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="Post status:">
                <el-select placeholder="please choose" v-model="state" style="width: 200px;">
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
            layout="jumper, total, sizes, prev, pager, next" background :total="10" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end " />

        <!-- Drawer -->
        <el-drawer v-model="visibleDrawer" title="Add Article" direction="rtl" size="50%">
            <!--  add article list-->
            <el-form :model="articleModel" :rules="rules" label-width="120px">
                <el-form-item label="Article Title" prop="title">
                    <el-input v-model="articleModel.title" placeholder="Enter title"></el-input>
                </el-form-item>
                <el-form-item label="Category" prop="categoryId">
                    <el-select placeholder="please choose" v-model="articleModel.categoryId">
                        <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Article Cover" prop="coverImg">
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
                <el-form-item label="Article Content" prop="content">
                    <div class="editor"> <!--rich text editor QUILL-->>
                        <quill-editor theme="snow" v-model:content="articleModel.content" contentType="html">
                        </quill-editor>
                    </div>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary"
                        @click="title == 'Add Article' ? addArticle('Published') : updateArticle()">Publish</el-button>
                    <el-button type="info"
                        @click="title == 'Edit Article' ? updateArticle() : addArticle('Draft')">Draft</el-button>
                    <el-button @click="visibleDrawer = false">Cancel</el-button> 
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
