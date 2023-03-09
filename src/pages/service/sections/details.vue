<template>
    <!-- Detail section -->
    <div class="col-12 mt-3">
        <h5 class="mb-5">مشخصات اصلی:</h5>
        <div class="grid p-fluid mt-3" >
            <div class="field col-12 md:col-3 lg:col-3 xl:col-2">
                <span class="p-float-label">
                    <InputText v-model="service.title" type="text" id="serviceTitleId" />
                    <label for="serviceTitleId">عنوان</label>
                </span>
            </div>
            <div class="field col-12 md:col-3 lg:col-3 xl:col-2">
                <span class="p-float-label">
                    <InputNumber v-model="service.prepaymentPercentage" dir="ltr" id="percentId" mode="decimal" :min="1" :max="100" prefix="%" :useGrouping="false"/>
                    <label class="px-1" for="percentId">درصد پیش پرداخت</label>
                </span>
            </div>
            <div class="field col-12 md:col-3 lg:col-3 xl:col-2">
                <span class="p-float-label">
                    <InputNumber v-model="service.standardCapacity" dir="ltr" id="capacityId" mode="decimal" :max="100" :useGrouping="false"/>
                    <label class="px-1" for="capacityId">ظرفیت(نفر)</label>
                </span>
            </div>
            <div class="field col-12 md:col-3 lg:col-3 xl:col-2">
                <span class="p-float-label">
                    <InputNumber v-model="service.additionalCapacity" dir="ltr" id="moreCapacityId" mode="decimal" :max="100" :useGrouping="false"/>
                    <label class="px-1" for="moreCapacityId">ظرفیت اضافه(نفر)</label>
                </span>
            </div>
            <div class="field col-12 md:col-3 lg:col-3 xl:col-2">
                <Button label="Primary" @click="dialog['createRoom'] = true" class="p-button-outlined p-button-secondary justify-content-center">
                    <span>تعداد</span>
                    <span v-if="!!service.floorOfRooms.length">: </span>
                    <span v-if="!!service.floorOfRooms.length">{{sumOfFloorOfRooms}}</span>
                </Button>
            </div>
        </div>
    </div>
    <!-- Detail section -->
    <divider type="dashed"/>
    <!-- Price section -->
    <div class="col-12 ">
        <h5 class="mb-5">قیمت گذاری:</h5>
        <div class="grid p-fluid mt-3" >
            <div class="field col-12 md:col-4 lg:col-4 xl:col-4">
                <span class="p-float-label">
                    <InputNumber v-model="service.price" dir="ltr" id="moreCapacityId" mode="decimal"/>
                    <label for="serviceTitleId">قیمت روز عادی (تومان)</label>
                </span>
            </div>
            <div class="field col-12 md:col-4 lg:col-4 xl:col-4">
                <span class="p-float-label">
                    <InputNumber v-model="service.peakDayPrice" dir="ltr" id="moreCapacityId" mode="decimal"/>
                    <label for="serviceTitleId">قیمت روز پیک (تومان)</label>
                </span>
            </div>
            <div class="field col-12 md:col-4 lg:col-4 xl:col-4">
                <span class="p-float-label">
                    <InputNumber v-model="service.additionalCapacityPrice" dir="ltr" id="moreCapacityId" mode="decimal"/>
                    <label for="serviceTitleId">قیمت هر نفر اضافه (تومان)</label>
                </span>
            </div>
        </div>
    </div>
    <!-- Price section -->
    <divider type="dashed"/>
    <!-- Beds section -->
    <div class="col-12">
        <h5 class="mb-5">تخت ها:</h5>
        <div class="grid p-fluid mt-3" >
            <div class="field col-12 md:col-4 lg:col-4 xl:col-4">
                <span class="p-float-label">
                    <InputNumber v-model="beds[0].count" dir="ltr" id="moreCapacityId" mode="decimal" :useGrouping="false"/>
                    <label for="serviceTitleId">تک نفره</label>
                </span>
            </div>
            <div class="field col-12 md:col-4 lg:col-4 xl:col-4">
                <span class="p-float-label">
                    <InputNumber v-model="beds[1].count" dir="ltr" id="moreCapacityId" mode="decimal" :useGrouping="false"/>
                    <label for="serviceTitleId">دو نفره</label>
                </span>
            </div>
            <div class="field col-12 md:col-4 lg:col-4 xl:col-4">
                <span class="p-float-label">
                    <InputNumber v-model="beds[2].count" dir="ltr" id="moreCapacityId" :max="3" mode="decimal" :useGrouping="false"/>
                    <label for="serviceTitleId">تعداد طبقه(نباید بیشتر از 3 باشد)</label>
                </span>
            </div>
        </div>
    </div>
    <!-- Beds section -->
    <divider type="dashed"/>
    <!-- Multi select tags section -->
    <div class="col-12">
        <h5 class="mb-5">تگ ها:</h5>
        <div class="grid p-fluid mt-3">
            <div class="field col-12 md:col-5">
                <MultiSelect v-model="service.tagsId"  filterMatchMode :filter="true" :options="tags" optionLabel="title" optionValue="id" placeholder="انتخاب تگ مرتبط">
                    <template #option="slotProps">
                        <div class="flex flex-row gap-2">
                            <img :src="'http://77.238.108.125/' + slotProps.option.icon" :alt="slotProps.option.title" width="30" />
                            <span>{{slotProps.option.title}}</span>
                        </div>
                    </template>
                </MultiSelect>
            </div>
        </div>
    </div>
    <!-- Multi select tags section -->
    <divider type="dashed"/>
    <!-- Meals section -->
    <div class="field col-12 mt-3">
        <h5 class="mb-5">وعده های غذایی:</h5>
        <div class="grid">
            <div v-for="(value, key, index) in service.meals" :key="`service-meals-${index}`" class="col-12 md:col-4">
                <div class="field-checkbox mb-0">
                    <Checkbox :id="`checkMealOption${key}`" :binary="true" v-model="service.meals[key]" />
                    <label class="mx-2" :for="`checkMealOption${key}`">{{key == 'hasBreakfast'?'صبحانه':key == 'hasLunch'?'ناهار':'شام'}}</label>
                </div>
            </div>
        </div>
    </div>
    <!-- Meals section -->
    <div class="field col-12 flex flex-row justify-content-end mt-3">
        <span class="p-float-label md:w-2">
            <!-- :label="!!$route.params.place_id?'ویرایش':'ایجاد'" -->
            <Button type="button" class="mr-2 mb-2" :label="getRouterAction === 'edit'?'ویرایش':'ایجاد'" icon="pi pi-check" :loading="loading[getRouterAction]" @click="actionService()"/>
        </span>
    </div>
    <!-- Create Room Dialog Section Begin -->
    <Dialog v-model:visible="dialog['createRoom']" :style="{width: '1000px'}" header="تعریف اتاق جدید" :modal="true">
        <div class="grid p-fluid mt-3">
            <div class="field col-12 md:col-5">
                <span class="p-float-label">
                    <InputNumber v-model="room.floor" mode="decimal" id="floorId" :useGrouping="false"/>
                    <label class="px-1" for="floorId">شماره طبقه</label>
                </span>
            </div>
            <div class="field col-12 md:col-5">
                <span class="p-float-label">
                    <InputNumber v-model="room.roomCount" mode="decimal" id="roomId" :useGrouping="false"/>
                    <label class="px-1" for="roomId">تعداد اتاق</label>
                </span>
            </div>
            <div class="field col-12 md:col-2">
                <Button label="افزودن" icon="pi pi-plus" class="p-button-primary" @click="addRoom(room)"/>
            </div>
            <div v-if="!!service.floorOfRooms.length" class="col-12">
                <div class="flex flex-row justify-content-start align-items-center flex-wrap gap-4">
                    <div v-for="(item , index) in service.floorOfRooms" :key="index" class=" border-1 p-2 border-round">                        
                        <div class="flex flex-column ">
                            <span>طبقه: <strong>{{item.floor}}</strong></span>
                            <span>تعداد اتاق: <strong>{{item.roomCount}}</strong></span>
                        </div>
                        <div class="text-center">
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-outlined p-button-text p-button-danger" @click="removeWithIndex(service.floorOfRooms, index)"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <template #footer >
            <div class="text-left">
                <Button label="تایید" icon="pi pi-check" class="p-button-text" @click="assignQuantity"/>
            </div>
        </template>
    </Dialog>
    <!-- Create Room Dialog Section Ended -->
</template>

<script>
export default {
    name:'ServiceDetails',
    data(){
        return {
            crudType:'create',
            dialog:{
                createRoom:false,
            },
            ids:{
                place:null,
                service:null,
            },
            loading:{
                create:false,
                edit:false,
            },
            service:{
                title: '',
                quantity: null,
                prepaymentPercentage: null,
                standardCapacity: null,
                price: null,
                peakDayPrice: null,
                additionalCapacity: null,
                additionalCapacityPrice: null,
                isWednesdayWeekend: false,
                meals: {
                    hasBreakfast: false,
                    hasLunch: false,
                    hasDinner: false
                },
                beds: [],
                floorOfRooms: [],
                tagsId: [] 
            },
            beds:[
                {bedType:0,count:null},
                {bedType:1,count:null},
                {bedType:2,count:null},
            ],
            room:{
                floor:null,
                roomCount:null,
            },
            tags:[],
            selectedTags:[],
        }
    },
    computed:{
        getRouterAction(){
            const {place_id ,type ,service_id} = {...this.$route.params};
            this.ids.place = place_id;
            this.ids.service = service_id;
            this.crudType = type
            if(this.crudType == 'edit'){
                this.getService(service_id)
                this.getTagsList()
            }
            return this.crudType;
        },
        sumOfFloorOfRooms(){
            return this.service.floorOfRooms.reduce((a, b) => a + (b['roomCount'] || 0), 0);
        },
    },
    watch:{
        getRouterAction(){}
    },
    methods:{
        //******* Api methods begin *******//
        actionService(){
            if(this.getRouterAction === 'create'){
                this.createService()
            }else{
                this.updateService(this.ids.service)
            }
        },
        async getService(id){
            const {status , data} = await this.axios({method:'get',url:`Place/${this.ids.place}/Service/${id}`})
            this.service = {...data}
            this.service.beds.forEach((item , index)=>{
                if(item.count != 0){
                    this.beds[index] = item
                }
            }),
            this.service.tagsId = data.tags.map(({id})=> id)
        },
        async getTagsList(query = '', page = 1 , pageSize = 10){
            const {status , data} = await this.axios({method:'get',url:`Tag/GetAll?TitleQuery=${query}&PageIndex=1&PageSize=10`})
            this.pageSize = data.pageSize;
            this.tags = [...data.data];
        },
        async createService(){
            this.service.beds = this.filterExistBeds()
            // this.service.placeId = this.$route.params.placeId
            this.loading['create'] = true;
            const {status , data} = await this.axios({method:'post',url:`Place/${this.ids.place}/Service`, data:this.service});
            this.showToast(status , data.errors);
            this.loading['create'] = false;
            if(status === 200){
                setTimeout(()=>{
                    this.$router.push({name:'serviceDetails' , params:{place_id: this.ids.place ,type:'edit', service_id:data}})
                }, 1500)
            }
        },
        async updateService(_id){
            this.service.beds = this.filterExistBeds()
            this.loading['edit'] = true;
            const {status , data} = await this.axios({method:'put',url:`Place/${this.ids.place}/Service/${this.ids.service}`, data:this.service});
            this.showToast(status , data.errors);
            this.loading['edit'] = false;
        },
        //******* Api methods begin *******//
        addRoom(){
            this.service.floorOfRooms.push(this.room);
            this.room = {floor:null,roomCount:null}
        },
        removeWithIndex(array , index){
            array.splice(index, 1);
        },
        assignQuantity(){
            this.service.quantity = this.sumOfFloorOfRooms
            this.dialog['createRoom'] = false;
        },
        filterExistBeds(){
            return this.beds.filter(item => !!item.count)
        },
    },
    mounted(){
        this.getTagsList()
    }
}
</script>