<template>
  <form class="grid p-fluid" >
    <div class="field col-12 md:col-4 mt-3">	
        <span class="p-float-label">
            <Calendar id="startTimeId" v-model="form.entranceTime" :showTime="true" :timeOnly="true" hourFormat="24" dir="ltr"/>
            <label for="startTimeId">ساعت ورود</label>
        </span>
    </div>
    <div class="field col-12 md:col-4 mt-3">	
        <span class="p-float-label">
            <Calendar id="endTimeId" v-model="form.leavingTime" :showTime="true" :timeOnly="true" hourFormat="24" dir="ltr"/>
            <label for="endTimeId">ساعت خروج</label>
        </span>
    </div>
    <div class="field col-12 md:col-4 mt-3">	
        <span class="p-float-label">
            <Dropdown id="ruleId" v-model="form.extraditionRule" :options="extraditionRules" optionLabel="title" optionValue="id"/>
            <label for="ruleId">قوانین استرداد</label>
        </span>
    </div>
    <div class="field col-12 flex flex-row justify-content-end mt-3">
        <span class="p-float-label w-1">
            <Button type="button" class="mr-2 mb-2" label="ایجاد" icon="pi pi-check" :loading="loading['create']" @click="completePlaceRules(placeId)"/>
        </span>
    </div>
  </form>
</template>

<script>
export default {
    name:'placeRules',
    props:{
        placeId:{
            type: Number,
            default: null,
        },
        rules:{
            type: Object,
            default: ()=>({}),
        }
    },
    data(){
        return {
            form:{
                entranceTime: '',
                leavingTime: '',
                extraditionRule: ''
            },
            loading:{
                create:false,
            },
            // public enum ExtraditionRules {Permissive, Balanced,Strict}
            extraditionRules:[
                {
                    id: 0,
                    title:'سهل گیرانه'
                },
                {
                    id: 1,
                    title:'متعادل'
                },
                {
                    id: 2,
                    title:'سخت گیرانه'
                },
            ],
            // regexController: /(11:23)/g,
        }
    },
    watch:{
        '$props.rules': {
            handler: function(newVal){
                this.form = {
                    entranceTime:newVal.entranceTime,
                    leavingTime:newVal.leavingTime,
                    extraditionRule:newVal.extraditionRule,
                };

            },
            immediate: true,
            deep: true,
        },
    },
    methods:{
        async completePlaceRules(id){
            this.loading['create'] = true;
            const formData = {
                entranceTime : this.convertDate(this.form.entranceTime),
                leavingTime : this.convertDate(this.form.leavingTime),
                extraditionRule : this.form.extraditionRule,
            }
            const {status , data} = await this.axios.put(`Place/${id}/rules`, formData)
            this.$emit('create-event',status)
            this.loading['create'] = false;
        },
        convertDate(date){
            if(date === '' || typeof date == 'object') return `${new Date(date).getHours()}:${new Date(date).getMinutes()}`
                return date
        },
    },
}
</script>

<style lang="scss">
.p-datepicker.p-component.p-datepicker-timeonly{
    direction: ltr;
}
</style>