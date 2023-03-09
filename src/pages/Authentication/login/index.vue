<template>
    <div class="surface-0 flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="grid justify-content-center p-2 lg:p-0" style="min-width:80%">
            <div class="col-12 mt-5 xl:mt-0 text-center">
                <img :src="'layout/images/logo-' + logoColor + '.svg'" class="mb-5 animate__animated animate__fadeIn" style="width:81px; height:60px;">
            </div>
            <div class="col-12 xl:col-6 animate__animated animate__fadeIn" style="border-radius:56px; padding:0.3rem; background: linear-gradient(180deg, var(--primary-color), rgba(33, 150, 243, 0) 80%);">
                <div class="h-full w-full m-0 py-7 px-4" style="border-radius:53px; background: linear-gradient(180deg, var(--surface-50) 38.9%, var(--surface-0));">
                    <div class="text-center mb-5">
                        <div class="text-900 text-3xl font-medium mb-3">خوش آمدید</div>
                        <span class="text-600 font-medium">برای ادامه ورود نمایید</span>
                    </div>
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
                        <Button :loading="loading" @click="login" label="ورود" class="w-full p-3" ></button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import validation from '@/mixin/formValidation'
export default {
    name:"login",
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
    computed: {
        logoColor() {
            if (this.$appState.darkTheme) return 'white';
            return 'dark';
        },
    },
    methods: {
        async login() {
            this.loading = true;
            // const {status , data} = await this.axios({method:'post',url:'/api/v1/Auth/Login',data:this.user})
            this.$auth.login(this.user)
            .then(res=>{
                if(res.status == 200){
                    this.$toast.add({severity: 'success', summary: 'ورود' , detail: 'خوش آمدید', life: 1000})
                    setTimeout(()=>{
                        this.loading = false;
                        // this.display = false
                        this.$router.push('/')
                    },500);
                }else{
                    this.$toast.add({severity: 'error', summary: 'تایید' , detail: 'عملیات با خطا مواجه شد', life: 1000})
                    this.loading = false;
                }
                this.display = true
            })
        }
    },
}
</script>

<style scoped>
.pi-eye {
    transform:scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform:scale(1.6);
    margin-right: 1rem;
}

.fadeIn{
    animation: fade-in 2s;
}
@keyframes fade-in {
    from{
        opacity: 0;
    }
    to{
        opacity: 1;
    }
}
</style>