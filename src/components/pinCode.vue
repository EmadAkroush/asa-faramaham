<template>
  <div>
    <!--Verification code input start-->
    <div class="d-flex text-center pin-code-section my-3" dir="ltr">
        <input 
            @keyup="goNext($event, 'first')" 
            type="tel" 
            maxlength="1" 
            pattern="[0-9]" 
            class="text-center text-800" 
            :class="{'border-red-600':verify[0] == ''}"
            v-model="verify[0]">
        <input 
            @keyup="goNext($event)" 
            type="tel" 
            maxlength="1" 
            pattern="[0-9]" 
            class="text-center text-800" 
            :class="{'border-red-600':verify[1] == ''}"
            v-model="verify[1]">
        <input 
            @keyup="goNext($event)" 
            type="tel" 
            maxlength="1" 
            pattern="[0-9]" 
            class="text-center text-800" 
            :class="{'border-red-600':verify[2] == ''}"
            v-model="verify[2]">
        <input 
            @keyup="goNext($event, 'last')" 
            type="tel" 
            maxlength="1" 
            pattern="[0-9]" 
            class="text-center text-800" 
            :class="{'border-red-600':verify[3] == ''}"
            v-model="verify[3]">
    </div>
    <!--Verification code input end-->
  </div>
</template>

<script>
export default {
    name: "pinCode",
    data: ()=>{
        return {
            verify:['','','','']
        }
    },
    methods: {
        goNext($e, position = null) {
            if (($e.keyCode < 48 && $e.keyCode != 8 && $e.keyCode != 37) || ($e.keyCode > 57 && $e.keyCode != 8 && $e.keyCode != 37)) {
                position != 'last' ? $e.target.nextElementSibling.focus() : '';
            } else if ($e.keyCode == 8 || $e.keyCode == 37) {
                position != 'first' ? $e.target.previousElementSibling.focus() : '';
            }
            !this.verify.some(i=> i == '') ? this.completeVerification(this.verify.join('')):false
        },
        completeVerification(val){
            this.$emit('pin-callback' , val)
        }
    },
}
</script>

<style lang="scss">
.pin-code-section{
    input{
        padding: 1rem;
        border: none;
        box-shadow: none;
        font-size: 1.75rem;
        width: 4.5rem;
        height: 4.5rem;
        box-shadow: 0px 3px 5px rgb(0 0 0 / 2%), 0px 0px 2px rgb(0 0 0 / 5%), 0px 1px 4px rgb(0 0 0 / 8%) !important;
        margin: 6px 14px;
        border-radius: .25rem;
        transition: all .5s ease-in-out;
        &:focus-visible{
            border: none;
            outline: none;
        }
    }
}
</style>