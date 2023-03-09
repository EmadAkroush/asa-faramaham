<template>
    <Dialog :closable="false" :showHeader="false" :modal="true" contentClass="login-dialog" v-model:visible="getNeedLogin" :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '50vw'}">
        <!-- <div class="surface-0 flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden"> -->
        <div class="grid justify-content-center w-full lg:p-0" style="min-width:80%">
            <div class="col-12 animate__animated animate__fadeIn" >
                <div class="h-full w-full m-0 px-4">
                    <form @submit.prevent="login" class="w-full md:w-10 mx-auto">
                        <label for="email1" class="block text-900 text-md font-medium my-3">نام کاربری</label>
                        <InputText 
                            @input="campaginName_validation(user.phoneNumber , $refs.username_error_message)"
                            @focus="campaginName_validation(user.phoneNumber , $refs.username_error_message)"
                            id="email1" 
                            v-model.trim="user.phoneNumber" 
                            type="text" 
                            class="w-full mb-0" 
                            dir="ltr"
                            :class="{'border-red-500 hover:border-red-500 focus:shadow-none':!!$refs.username_error_message?.innerText}"/>
                        <small ref="username_error_message" class="text-red-500"></small>
                
                        <label for="password1" class="block text-900 font-medium text-md my-3">رمز عبور</label>
                            <!-- @input="password_validate(user.password,$refs.password_error_message)" 
                            @focus="password_validate(user.password,$refs.password_error_message)"  -->
                        <InputText 
                            id="password1" 
                            v-model.trim="user.password" 
                            type="password" 
                            class="w-full mb-3" 
                            dir="ltr" 
                            :class="{'border-red-500 hover:border-red-500 focus:shadow-none':!!$refs.password_error_message?.innerText}"/>
                        <small ref="password_error_message" class="text-red-500"></small>
                
                        <div class="flex align-items-center justify-content-between my-5">
                            <div class="flex align-items-center">
                                <Checkbox id="rememberme1" v-model="checked" :binary="true" class="mr-2"></Checkbox>
                                <label for="rememberme1" class="text-700 mr-1">مرا به خاطر داشته باش</label>
                            </div>
                            <router-link to="/forget-password" class="font-medium no-underline ml-2 text-right cursor-pointer">فراموشی رمز عبور</router-link>
                        </div>
                        <div class="flex flex-column md:flex-row justify-content-center gap-2">
                            <Button :loading="loading" @click="login" label="ورود" class="px-7 py-2" ></button>
                            <Button :loading="loading" @click="logout" label="خروج" class="p-button-danger p-button-outlined px-7 py-2" ></button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    <!-- </div> -->
    </Dialog>
</template>
<script>
import validation from '@/mixin/formValidation';
import {mapGetters} from 'vuex'
export default {
    mixins:[validation],
    data() {
        return {
            user:{
                phoneNumber: '',
                password: '',
            },
            checked: false,
            loading: false,
            display:false,
        }
    },
    computed:{
        // needRelogin(){ 
        //     this.display = !this.$store.getters.isAuthenticated
        //     // this.$store
        //     // console.log(this.$store.getters.isAuthenticated);
        //     // debugger
        //     this.display
        //     debugger
        //     return this.display
        // },
        ...mapGetters({getNeedLogin: 'getNeedLogin'})
    },
    watch:{
        // needRelogin(){},
        getNeedLogin(){}
    },
    methods:{
        async login() {
            this.loading = true;
            this.$auth.login(this.user)
            .then(res=>{
                if(res.status == 200){
                    this.showToast(res.status)
                    setTimeout(()=>{
                        this.loading = false;
                        this.$store.commit('setRelogin' , false)
                        this.$store.state.needReLogin
                        debugger
                    },1500)
                }else{
                    this.showToast(res.status.status)
                    this.loading = false;
                }
                this.display = true
            })
        },
        logout(){
            this.$auth.logout()
            this.$store.commit('setRelogin' , false)
            this.getNeedLogin
        }
    }
}
</script>
<style lang="scss">
.p-dialog-content.login-dialog{
    // background: linear-gradient(180deg, var(--primary-color), rgba(33, 150, 243, 0) 80%);
    border-radius: 1rem !important;
}
</style>