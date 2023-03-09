import axios from 'axios';
import router from '../../router';
import * as _cookie from './utils/cookie';
import * as _storage from './utils/storage';
// import * as _state from './utils/state';
const jwt = require('jsonwebtoken');
    //TODO: Customize constructor data 
export class Auth {
    constructor({endPoints , redirects}) {
        this.endPoints = endPoints;
        this.redirects = redirects;
    }
    async login(user){
        const {status , data} = await axios({method:'post',url:`http://77.238.108.125/api/v1/${this.endPoints.login}`,data:user})
        if(status == 200){
            _storage.set('token' , `Bearer ${data['accessToken']}`);
            _storage.set('refresh' , data['refreshToken']);
            this.setExpiration('tokenExp',this.tokenParser(data['accessToken']).payload.exp)
            this.setExpiration('refreshExp',this.tokenParser(data['refreshToken']).payload.exp)
            this.getUser()
        }
        return {status , data}
    }
    //TODO: Complete implement getUser method
    async getUser(){
        const config = {
            'Authorization': _storage.get('token') || ''
        }
        const { status , data } = await axios.get(`http://77.238.108.125/api/v1/${this.endPoints.user}`, config);
        _storage.set('user', JSON.stringify({...data}));
    }
    // func = null , ...param
    async refreshToken(){
            const { status, data } = await axios.post(`http://77.238.108.125/api/v1/${this.endPoints.refresh}`, { "refreshToken": _storage.get('refresh') })
            if (status === 200) {
                _storage.set('token' , `Bearer ${data['accessToken']}`);
                _storage.set('refresh' , data['refreshToken']);
                _cookie.set('token' , data['accessToken'])
                this.setExpiration('tokenExp',this.tokenParser(data['accessToken']).payload.exp)
                this.setExpiration('refreshExp',this.tokenParser(data['refreshToken']).payload.exp)
                return {status , token: `Bearer ${data['accessToken']}`}
                // },1500)
            } else if (status === 401 || status === 500) {
                return {status}
            }
    }

    async logout(){
        // await ['token','refresh'].forEach((pr)=>{
            _storage.clear()
        // })
        router.push(this.redirects.logout)
    }

    checkExpiration(token) {
        const now = Math.trunc(Date.now()/1000);
        const expTime = +_cookie.get(token) || 0;
        return now > expTime
    }

    loggedInUser() {
        return !this.checkExpiration('refreshExp') && (!!_storage.get('token'))
    }

    redirect(isLogin){
        isLogin? router.push('/'):router.push('/login');
    }

    //Manage token this section
    tokenParser(token){
        return jwt.decode(token, {complete: true});
    }

    setExpiration(key , value){
        _storage.set(key , value);
        _cookie.set(key , value);
    }
    //Manage token this section
    processToSetTokenInStorages(){

    }
}
// store
// debugger


export default {
    install: (app, options) => {
       app.config.globalProperties.$auth = new Auth(options);
    },
}