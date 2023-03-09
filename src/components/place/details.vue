<template>
  <form class="grid p-fluid mt-3" >
    <div class="field col-12 md:col-3 ">
        <span class="p-float-label">
            <InputText v-model="form.name" type="text" id="inputNameId" />
            <label for="inputNameId">نام اقامتگاه</label>
            <small ref="test_ref"></small>
        </span>
    </div>
    <div class="field col-12 md:col-3">
        <span class="p-float-label">
            <Dropdown v-model="form.categoryId" id="CategoryId" :options="categories" optionLabel="title" optionValue="id">
                <template #option="slotProps">
                    <div class="flex flex-row">
                        <img :alt="slotProps.option.picture" :src="'http://77.238.108.125/' + slotProps.option.picture" />
                        <span class="mr-2">{{slotProps.option.title}}</span>
                    </div>
                </template>
            </Dropdown>
            <label for="CategoryId">نوع اقامتگاه</label>
        </span>
    </div>
    <div class="field col-12 md:col-3 ">
        <span class="p-float-label">
            <Dropdown v-model="form.provinceId" :options="states" optionLabel="title" optionValue="id"/>
            <label for="stateId">استان:</label>
        </span>
    </div>
    <div v-if="!!form.provinceId" class="field col-12 md:col-3">
        <span class="p-float-label">
            <Dropdown v-model="form.cityId" :options="getCities(form.provinceId)" optionLabel="title" optionValue="id"/>
            <label for="cityId">شهر</label>
        </span>
    </div>
    <div class="field col-12 md:col-3 lg:col-3 xl:col-3">
        <span class="p-float-label">
            <InputNumber v-model="form.latitude" dir="ltr" id="latitudeId" mode="decimal" :useGrouping="false"/>
            <label class="px-1" for="latitudeId">موقعیت جغرافیایی(عرض)</label>
        </span>
    </div>
    <div class="field col-12 md:col-3 lg:col-3 xl:col-3 mt-3">
        <span class="p-float-label">
            <InputNumber v-model="form.longitude" dir="ltr" id="longitudeId" mode="decimal" :useGrouping="false"/>
            <label class="px-1" for="longitudeId">موقعیت جغرافیایی(طول)</label>
        </span>
    </div>
    <div class="field col-12 mt-3">
        <span class="p-float-label">
            <Textarea inputId="addressId" rows="2" cols="30" v-model="form.address"></Textarea>
            <label for="addressId">آدرس دقیق</label>
        </span>
    </div>
    <div class="field col-12 flex flex-row justify-content-end mt-3">
        <span class="p-float-label md:w-2">
            <Button type="button" class="mr-2 mb-2" :label="!!$route.params.place_id?'ویرایش':'ایجاد'" icon="pi pi-check" :loading="loading['create']" @click="completePlaceDetail()"/>
        </span>
    </div>
  </form>
</template>

<script>
import states from '../../../public/data/location.json';
export default {
    name: 'placeDetail',
    emits:['report-status'],
    props:{
        categories:{
            type: Array,
            default: [],
        },
        formData:{
            type: Object,
            default: ()=>{},
        },
    },
    computed:{
        onlyForUpdateComponent(){
            this.form = {...this.formData}
            return this.form
        }
    },
    data(){
        return {
            types:[
                {
                    id:'hotel',
                    title:'هتل'
                },
                {
                    id:'motel',
                    title:'مسافرخانه'
                },
            ],
            form:{
                "name": "",
                "categoryId": 0,
                "provinceId": '',
                "cityId": '',
                "address": "",
                "latitude": 0,
                "longitude": 0,
            },
            loading:{
                create: false,
            },
            radioValue: null,
            states: states,
            value:null,
        }
    },
    watch:{
        onlyForUpdateComponent(){}
    },
    methods:{
        //******* Api methods end *******//
        async completePlaceDetail(){
            this.loading['create'] = true;
            if(!!this.$route.params.place_id){
                const {status , data} = await this.axios({method:'put',url:`Place/${this.$route.params.place_id}`, data: this.form})
                this.$emit('report-status' , {status:status , id:data});
                this.showToast(status);
            }else{
                const {status , data} = await this.axios({method:'post',url:`Place`, data: this.form})
                this.$emit('report-status' , {status:status , id:data});
                this.showToast(status);
            }
            this.loading['create'] = false;
        },
        //******* Api methods end *******//
        getCities(id){
            return this.states.filter(state=> state.id === id)[0].cities
        },
    },
}
</script>