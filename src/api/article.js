import request from '@/utils/request.js'
import { useTokenStore } from '@/stores/token.js'

// arcitle categoty list query
export const articleCategoryListService = () => {
    // const tokenStore = useTokenStore();
    // the responsive data defined in pinia does not require .value
    // return request.get('/category', { headers: { 'Authorization': tokenStore.token } })
    return request.get('/category')
}

// Add Article Category (parameter is JSON-format)
export const articleCategoryAddService = (categoryData) => {
    return request.post('/category', categoryData)
}

// Update Article Category (parameter is JSON-format)
export const articleCategoryUpdateService = (categoryData) => {
    return request.put('/category', categoryData)
}

// Delete Article Category
export const articleCategoryDeleteService = (id) => {
    return request.delete('/category?id=' + id)
}

// Query Article List
export const articleListService = (params) => {
    return request.get('/article', { params: params })
}

// Add Article
export const articleAddService = (articleData) => {
    return request.post('/article', articleData);

}

// edit article
export const articleUpdateService = (articleData) => {
    return request.put('/article', articleData)
}

// delete article
export const articleDeleteService = (id) => {
    return request.delete('/article?id=' + id)
}