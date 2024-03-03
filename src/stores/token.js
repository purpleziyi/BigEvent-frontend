import { defineStore } from 'pinia'
import { ref } from 'vue'

/*
     1st parameter: name--unique
     2nd parameter: function, all contents of the state can be defined inside the function

     Return value: functions
*/

export const useTokenStore = defineStore('token', () => {
    //define state-content

    // 1. Reactive variable
    const token = ref('')

    // 2. modify the value of the token
    const setToken = (newToken) => {
        token.value = newToken
    }

    // 3. remove the value of the token
    const removeToken = () => {
        token.value = ''
    }

    return {
        token, setToken, removeToken
    }
}, {
    persist: true // persistent storage
});