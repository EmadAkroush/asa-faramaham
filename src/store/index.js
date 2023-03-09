import { createStore } from "vuex" 
import {Auth} from '../plugin/auth/index'
// import authModule from './modules/auth/index.js'
const auth = new Auth({ endPoints: {
    login: '/api/v1/Auth/Login',
    user: '/api/v1/Auth/GetUserInfo',
    refresh: '/api/v1/Auth/RefreshToken',
  },
  redirects:{
    login:'/',
    logout:'/login',
}})
//TODO: Complete reLogin user commit and getter 
const store = createStore({
    // modules:{
    //     auth: authModule
    // },
    state:{
        needReLogin: auth.loggedInUser()
    },
    mutations:{
        setRelogin(state , val){
            state.needRelogin = val
            debugger
        }
    },
    getters:{
        getNeedLogin(state){
            return state.needReLogin
        }
    }
})

export default store