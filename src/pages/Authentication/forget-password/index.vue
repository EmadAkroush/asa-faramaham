<template>
    <div class="surface-0 flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="grid justify-content-center p-2 lg:p-0" style="min-width:80%">
            <div class="col-12 mt-5 xl:mt-0 text-center">
                <img :src="'layout/images/logo-' + logoColor + '.svg'" alt="Sakai logo" class="mb-5 animate__animated animate__fadeIn" style="width:81px; height:60px;">
            </div>
            <div class="col-12 xl:col-6 animate__animated animate__fadeIn" style="border-radius:56px; padding:0.3rem; background: linear-gradient(180deg, var(--primary-color), rgba(33, 150, 243, 0) 120%);">
                <div class="h-full w-full m-0 py-7 px-4" style="border-radius:53px; background: linear-gradient(180deg, var(--surface-50) 38.9%, var(--surface-0));">
                    <div class="text-center mb-5">
                        <div class="text-900 text-3xl font-medium mb-3">فراموشی رمز عبور</div>
                        <span class="text-600 font-medium">لطفا شماره همراه خود را وارد نمایید</span>
                    </div>
                
                    <div class="w-full md:w-10 mx-auto ">
                        <div>
                            <label for="phone" class="block text-900 text-md font-medium my-2">شماره همراه</label>
                            <InputText 
                                id="phone"
                                :disabled="showCodeSection"
                                @input="phoneNumber_validation(user.phoneNumber , $refs.phone_error_message)"
                                @focus="phoneNumber_validation(user.phoneNumber , $refs.phone_error_message)" 
                                v-model="user.phoneNumber" 
                                type="text" 
                                class="w-full text-2xl" 
                                dir="ltr"/>
                            <small ref="phone_error_message" class="text-red-500"></small>
                            <Button 
                                v-if="!showCodeSection"
                                label="ارسال کد تایید" 
                                :disabled="!user.phoneNumber || !!$refs.phone_error_message?.innerText" 
                                :loading="loading" 
                                @click="sendCode(user.phoneNumber)" 
                                class="w-full p-3 text-lg mt-4">
                            </Button>
                        </div>
                        <div v-if="showCodeSection">
                            <pin-code @pin-callback="completeVerification"/>
                            <div class="flex flex-row justify-content-center">
                                <div v-if="counting">
                                    <vue-countdown :time="timerTimeOut" @end="onCountDownEnded" v-slot="{  minutes, seconds }">
                                        <span>زمان باقی مانده:  </span>
                                        <span>{{ minutes }}</span>
                                        <span>:</span>
                                        <span>{{ seconds }}</span>  
                                    </vue-countdown>
                                </div>
                                <span v-if="showResend" @click="onResendCode" class="text-primary cursor-pointer">ارسال مجدد کد</span>
                            </div>
                            <Button 
                                label="تایید" 
                                :disabled="disableLogin" 
                                @click="login"
                                class="w-full p-3 text-lg mt-4">
                            </Button>
                        </div>
                        
                        <div class="flex align-items-center justify-content-end mt-5">
                            <router-link to="/login" class="font-medium no-underline ml-2 text-right cursor-pointer">بازگشت به صفحه ورود</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Dialog v-model:visible="display"  :breakpoints="{'960px': '75vw'}" :style="{width: '30vw'}" :modal="true">
            <div class="text-center py-4">
                <i class="pi" :class="[dialog.status == 200 ? 'pi-check-circle text-green-700':'pi-exclamation-triangle text-red-700']" style="font-size: 4rem;"></i>
            </div>
            <h3 class="line-height-3 text-lg text-center m-0" :class="[dialog.status === 200?'text-green-700':'text-red-700']">
                <span>
                    {{dialog.message}}
                </span>
            </h3>
        </Dialog>
    </div>
</template>

<script>
import validation from '@/mixin/formValidation';
// import OtpInput from "@bachdgvn/vue-otp-input";
export default {
    name: "forget-pass",
    mixins:[validation],
    data() {
        return {
            user:{
                phoneNumber: '',
                code: '',
            },
            timerTimeOut:2 * 60 * 1000, //default => 2 * 60 * 1000
            counting:false,
            activeCode:false,
            loading: false,
            showCode: false,
            display:false,
            disableLogin:true,
            showResend:false,
            showCodeSection:false,
            dialog:{
                message: "",
                status: null,
            }
        }
    },
    computed: {
        logoColor() {
            if (this.$appState.darkTheme) return 'white';
            return 'dark';
        },
    },
    methods: {
        handleOnComplete(value) {
            console.log('OTP completed: ', value);
        },
        handleOnChange(value) {
            console.log('OTP changed: ', value);
        },
        async sendCode(phone){
            this.loading = true;
            const {status , data} = await this.axios({method:'get',url:`/api/v1/Auth/LoginWithCode?phoneNumber=${phone}`})
            if(status == 200 && data){
                this.loading = false;
                this.counting = true;
                this.showCodeSection = true
                this.dialog.message = "کد با موفقیت ارسال شد"
                this.dialog.status = 200
            }else{
                this.loading = false;
                this.counting = false;
                this.showCodeSection = false
                this.dialog.message = "خطایی رخ داده است!"
                this.dialog.status = status
            }
            this.display = true
            setTimeout(()=>{
                this.loading = false;
            },1500)
        },
        async login() {
            this.loading = true;
            const {status , data} = await this.axios({method:'post',url:'/api/v1/Auth/Login',data:this.user})
            if(status == 200){
                this.dialog.message = "عملیات با موفقیت انجام شد"
                this.dialog.status = 200
            }else{
                this.dialog.message = "خطایی رخ داده است!"
                this.dialog.status = status
            }
            this.display = true
            setTimeout(()=>{
                this.loading = false;
            },1500)
        },
        completeVerification(val){
            this.user.code = val
            this.disableLogin = false
        },
        onCountDownEnded(){
            this.showResend = true
            this.counting = false
        },
        onResendCode(){
            this.showResend = false
            this.counting = true
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