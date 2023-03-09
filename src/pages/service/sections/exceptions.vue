<template>
    <!-- Exceptions section -->
    <div v-if="getRouterAction === 'edit'" class="col-12">
        <div class="grid p-fluid mt-3" >
            <div class="field col-12 md:col-3">
                <label for="serviceTitleId">تاریخ (برای افزودن کلیک کلید)</label>
                <span class="p-input-icon-left">
                    <i style="font-size: 1.5rem" class="pi pi-calendar" />
                    <InputText dir="ltr" v-model="date" @click="dialog['calendar'] = true" type="text" id="calendarInputId" />
                </span>
            </div>
            <div v-if="!!serviceExceptions.length" class="field col-12">
                <div class="flex flex-row justify-content-start align-items-center">
                    <TransitionGroup class="flex gap-4 flex-wrap" name="exception" tag="div">
                        <div v-for="(item , index) in serviceExceptions" :key="index" class="flex flex-row align-items-center border-round-2xl border-1 border-500 border-dashed p-2">
                            <div class="flex flex-column">
                                <span>تاریخ: {{convertDate(item.date)}}</span>
                                <span v-if="!item.isClosed">قیمت:{{item.price.toLocaleString()}}</span>
                                <span class="text-red-500" v-if="item.isClosed">تعطیل</span>
                            </div>
                            <Button icon="pi pi-times" @click="deleteExceptions(index)" class="p-button-text p-button-rounded p-button-danger p-button-sm mr-2" />
                        </div>
                    </TransitionGroup>
                </div>
            </div>
        </div>
        <custom-date-picker v-model="exception.date" :min="currentDate" :show="dialog['calendar']" format="YYYY-MM-DD" @change="changeOnAccept($event)" display-format="jYYYY/jMM/jDD" custom-input="#calendarInputId" @close="dialog['calendar']=false"/>
    </div>
    <!-- Exceptions section -->
    <Dialog v-model:visible="dialog['exception']" :style="{width: '450px'}" :closable="false" :modal="true">
        <div class="grid p-fluid mt-3">
            <div class="field col-12">
                <span>تاریخ: </span>
                <span>{{convertDate(exception.date)}}</span>
            </div>
            <div class="field col-12">
                <div class="flex flex-row align-items-center">
                    <RadioButton id="rb1" name="exception" value="price" v-model="exceptionType" />
                    <label class="mr-2" for="rb1">استثناء در قیمت</label>
                </div>
            </div>
            <div v-if="exceptionType === 'price'" class="field col-12">
                <span class="p-float-label">
                    <InputNumber v-model="exception.price" dir="ltr" id="moreCapacityId" mode="decimal"/>
                    <label for="serviceTitleId">قیمت مورد نظر را وارد کنید (تومان)</label>
                </span>
            </div>
            <div class="field col-12">
                <div class="flex flex-row align-items-center">
                    <RadioButton id="rb2" name="exception" value="holiday" v-model="exceptionType" />
                    <label class="mr-2" for="rb2">تعطیلی</label>
                </div>
            </div>
            <div class="field col-6">
                <Button :disabled="!exceptionType" @click="addException" type="button" label="ایجاد" icon="pi pi-check"/>
            </div>
            <div class="field col-6">
                <Button type="button" @click="dialog['exception'] = false" class="p-button-outlined p-button-danger" label="بستن" icon="pi pi-times"/>
            </div>
        </div>
    </Dialog>
</template>

<script>
export default {
    name:'ServiceExceptions',
    data(){
        return {
            crudType:'create',
            dialog:{
                calendar:false,
                exception:false,
            },
            ids:{
                place:null,
                service:null,
            },
            loading:{
                create:false,
                edit:false,
            },
            serviceExceptions: [],
            // {
            //     "date": "2022-09-18T11:50:10.725Z",
            //     "isClosed": true,
            //     "price": 0
            // }
            exception:{
                date:'',
                price:null,
                isClosed:false
            },
            currentDate: `${new Date(Date.now()).getFullYear()}-${new Date(Date.now()).getMonth()+1}-${new Date(Date.now()).getDate()+1}`,
            exceptions:[],
            exceptionType:null,
            date:'',
        }
    },
    computed:{
        getRouterAction(){
            const {place_id ,service_id ,type } = {...this.$route.params};
            this.ids.place = place_id;
            this.ids.service = service_id;
            this.crudType = type;
            if(!!service_id){
                this.getExceptions(service_id)
            }
            return this.crudType;
        },    
        convertDate(){
            return faDate => new Date(faDate).toLocaleDateString('fa-IR')
        },
    },
    watch:{
        getRouterAction(){}
    },
    methods:{
        //******* Api methods begin *******//
        async getExceptions(id){
            const currentDate = {
                year: new Date(Date.now()).getFullYear(),
                month: new Date(Date.now()).getMonth()+1
            };
            const {status , data} = await this.axios({method:'get',url:`Place/${this.ids.place}/Service/${id}/exceptions/?year=${currentDate.year}&month=${currentDate.month}`})
            this.serviceExceptions = [...data]
        },
        async addException(){
            this.exceptionType == 'holiday' && (this.exception.isClosed = true)
            this.exception.date = this.changeDateFormat(this.exception.date)
            this.serviceExceptions.push(this.exception)
            const {status , data} = await this.axios({method:'put',url:`Place/${this.ids.place}/Service/${this.ids.service}/exceptions` , data: {'serviceExceptions':[...this.serviceExceptions]} });
            this.showToast(status , data.errors);
            this.exception = {
                date:'',
                price:null,
                isClosed:false,
            };
            this.date = '';
            this.exceptionType = null;
            this.dialog['exception'] = false;
        },
        async deleteExceptions(index){
            const {status , data} = await this.axios({method:'delete',url:`Place/${this.ids.place}/Service/${this.ids.service}/exceptions` , data: {'date':this.serviceExceptions[index].date} });
            this.showToast(status , data.errors);
            status === 200 && this.serviceExceptions.splice(index, 1);
        },
        //******* Api methods begin *******//
        changeOnAccept(e){
            this.exception.date = e._d
            this.dialog['exception'] = true
        },
        changeDateFormat(date){
            return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
        }
    },
}
</script>

<style lang="scss">
.exception-move, /* apply transition to moving elements */
.exception-enter-active,
.exception-leave-active {
  transition: all 0.5s ease;
}

.exception-enter-from,
.exception-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.exception-leave-active {
  position: absolute;
}
</style>