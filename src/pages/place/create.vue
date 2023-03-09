<template>
    <div class="grid p-fluid animate__animated animate__fadeIn">
		<div class="col-12 md:col-12">
            <div class="card">
                <div v-if="crudType === 'edit'" class="flex flex-row justify-content-between">
                    <span class="text-xl">{{crudType == 'edit'? 'ویرایش هتل/مسافرخانه':'ثبت هتل/مسافرخانه'}}</span>
                    <router-link :to="{name:'serviceList' , params:{place_id: placeId }}" class="flex flex-row align-items-center p-button-outlined p-button-primary">
                        <i class="pi pi-plus"></i>
                        <span class="mr-1" v-text="'مدیریت سرویس ها'"></span>
                    </router-link>
                    <!-- <Button label="مدیریت سرویس" icon="pi pi-plus" class="p-button-success w-2" @click="routeToServicePage" /> -->
                </div>
                <TabView v-model:activeIndex="activeTab">
                    <TabPanel center v-for="tab in tabs" :key="tab.title" :disabled="tab.disabled">
                        <template #header>
                            <i :class="tab.icon"></i>
                            <span class="mr-2">{{tab.title}}</span>
                        </template>
                        <Details 
                            v-if="activeTab === 0"
                            :formData="details" 
                            :categories="categories" 
                            @report-status="investigateStatus" 
                            />
                        <!--************************* On Development *************************-->
                        <keep-alive>
                        
                        <Features v-if="activeTab === 1 && !!featureCollections && crudType == 'edit'" :collections="featureCollections" :placeId="placeId" @create-event="getFeatures">
                             <template v-slot:specifics>
                                <div class="grid p-fluid mt-3">
                                    <div class="field col-12 md:col-5">
                                        <div class="p-inputgroup">
                                            <InputText v-model="specificPlace.name" placeholder="نام مکان خاص" id="catTitle" type="text"/>
                                        </div>
                                    </div>
                                    <div class="field col-12 md:col-5 ">
                                        <div class="p-inputgroup">
                                            <span class="p-inputgroup-addon">
                                                <span>متر</span>
                                            </span>
                                            <InputNumber v-model="specificPlace.distanceByMeters" placeholder="فاصله از هتل" mode="decimal" :min="0" :max="40" :useGrouping="false"/>
                                        </div>
                                    </div>
                                    <div class="field col-12 md:col-2">
                                        <Button icon="pi pi-check" label="ثبت مکان" loadingIcon="pi pi-spinner" :loading="loading['createPlace']" @click="createSpecificPlace(placeId)" class="p-button p-button-primary mr-0 mb-0 md:mr-2 md:mb-2" />
                                    </div>
                                </div>
                                <Divider type="dashed"/>
                                <div class="grid p-fluid mt-3" v-for="(form, index) in insertedForms" :key="index">
                                    <div class="field col-12 md:col-4">
                                        <div class="p-inputgroup">
                                            <InputText v-model="form.name" placeholder="نام مکان خاص" id="catTitle" type="text"/>
                                        </div>
                                    </div>
                                    <div class="field col-12 md:col-4 ">
                                        <div class="p-inputgroup">
                                            <span class="p-inputgroup-addon">
                                                <span>متر</span>
                                            </span>
                                            <InputNumber v-model="form.distanceByMeters" placeholder="فاصله از هتل" mode="decimal" :min="0" :max="40" :useGrouping="false"/>
                                        </div>
                                    </div>
                                    <div class="field col-12 md:col-1 flex flex-row align-items-center justify-content-end">
                                        <Button @click="editSelected(form , placeId)" icon="pi pi-pencil" class="p-button-rounded p-button-info p-button-outlined mx-1" />
                                        <Button @click="dialog['delete'] = true; selected = form" icon="pi pi-times" class="p-button-rounded p-button-danger p-button-outlined mx-1" />
                                    </div>
                                </div>
                             </template>
                        </Features>
                        </keep-alive>
                        <!--************************* On Development *************************-->
                        <Images 
                            v-if="activeTab === 2 && crudType == 'edit'"
                            :pictures="pictures"
                            :placeId="placeId"
                            @create-images="getImages"
                            @remove-image="getImages"
                            />
                        <keep-alive>
                        <Rules 
                            v-if="activeTab === 3 && !!rules && crudType == 'edit'" 
                            :rules="rules" 
                            :placeId="placeId"
                            @create-event="showToast"
                        />
                        </keep-alive>
                    </TabPanel>
                </TabView>
		    </div>
        </div>
        <!-- Delete Dialog Section Begin -->
        <Dialog v-model:visible="dialog['delete']" :style="{width: '450px'}" header="حذف" :modal="true">
            <div class="flex flex-column align-items-center justify-content-center">
                <i class="pi pi-exclamation-triangle" style="font-size: 4rem" />
                <span v-if="selected" class="mt-3">آیا مطمئن هستید؟</span>
            </div>
            <template #footer >
                <div class="text-center">
                    <Button label="خیر" icon="pi pi-times" class="p-button-text" @click="dialog['delete'] = false"/>
                    <Button label="بلی" icon="pi pi-check" class="p-button-text" @click="removeSelected(selected.id , placeId)" />
                </div>
            </template>
        </Dialog>
        <!-- Delete Dialog Section Ended -->
	</div>
</template>

<script>
import placeDetail from '@/components/place/details.vue';
import placeImages from '@/components/place/images.vue';
import placeRules from '@/components/place/rules.vue';
import placeFeatures from '@/components/place/features.vue';
export default {
    name: 'placeCreate',
    components:{
        Details: placeDetail,
        Images: placeImages,
        Rules: placeRules,
        Features: placeFeatures,
    },
    data(){
        return {
            activeTab:0,
            tabs: [
                {
                    title: 'مشخصات', 
                    component: 'details' , 
                    icon:'pi pi-id-card',
                    disabled:false,
                },
                {
                    title:'ویژگی ها',
                    component: 'features' , 
                    icon:'pi pi-palette',
                    disabled:true,
                },
                {
                    title: 'تصاویر', 
                    component: 'images' , 
                    icon:'pi pi-images',
                    disabled:true,
                },
                {
                    title: 'قوانین', 
                    component: 'rules' , 
                    icon:'pi pi-info-circle',
                    disabled:true,
                },
            ],
            rules:null,
            placeId:null,
            categories:[],
            pictures:[],
            pageSize:10,
            crudType:'create',
            details:null,
            featureCollections:null,
            specificPlace:{
                name: '',
                distanceByMeters: null,
            },
            insertedForms:[],
            loading:{
                createPlace:false
            },
            selectedSpecificPlace:null,
            dialog:{
                delete:false,
            }
        } 
    },
    computed:{
        getRouterId(){
            this.placeId = this.$route.params.place_id;
            if(this.placeId){
                this.crudType = 'edit';
                this.getPlaceSpecification(this.placeId)
                this.getRules(this.placeId)
                this.getImages(200 , this.placeId)
                this.getFeatures(this.placeId)
            }
            this.changeTabActivities(this.crudType);
            return this.crudType;
        }
    },
    watch:{
        getRouterId(){}
        // '$route.params': {
        //     handler: function(val) {
        //         this.placeId = !!val.place_id && val.place_id || '';
        //         if(this.placeId){
        //             this.crudType = 'edit';
        //             this.changeTabActivities(this.crudType);
        //             this.getPlaceSpecification(id) 
        //             this.getRules(id) 
        //             this.getImages(200 , id)
        //             this.getFeatures(id)
        //         }
        //     },
        //     deep: true,
        //     immediate: true
        // },
    },
    methods:{
        //******* Api methods end *******//
        async getListCategory(page = 1){
            const {status , data} = await this.axios({method:'get',url:`Category/GetAll?Title=&PageIndex=${page}&PageSize=${this.pageSize}`})
            this.pageSize = data.pageSize;
            this.categories = [...data.data];
        },
        async getPlaceSpecification(id = this.placeId){
            const {status , data} = await this.axios({method:'get',url:`Place/${id}/Specifications`})
            status == 200? this.details = {...data}:false;
        },
        async getRules(id){
            const {status , data} = await this.axios({method:'get',url:`Place/${id}/rules`})
            status == 200? this.rules = {...data}:false;
        },
        async getImages(status = 200 , id = this.placeId){
            if(status == 200){
                const {status , data} = await this.axios({method:'get',url:`Place/${id}/pictures`})
                this.pictures = [...data]
            } 
        },
        async getFeatures(id = this.placeId){
            const {status , data} = await this.axios({method:'get',url:`Place/${id}/features`});
            this.insertedForms = data['specificPlaces'];
            this.featureCollections = {...data};
        },
        async createSpecificPlace(id = this.placeId){
            this.loading['createPlace'] = true;
            const {status , data} = await this.axios({method:'post',url:`Place/${id}/specificplace`, data:this.specificPlace});
            status == 200?this.getFeatures(id):false;
            this.showToast(status, data.errors)
            this.loading['createPlace'] = false;
            this.specificPlace = {name: '',distanceByMeters: 0}
        },
        async editSelected(selected , placeId){
            const {status , data} = await this.axios({method:'put',url:`Place/${placeId}/specificplace/${selected. id}`, data:selected});
            this.showToast(status, data.errors);
        },
        async removeSelected(id , placeId){
            const {status , data} = await this.axios({method:'delete',url:`Place/${placeId}/specificplace/${id}`});
            this.showToast(status, data.errors);
            this.dialog['delete'] = false;
            status == 200 && (this.insertedForms = this.insertedForms.filter(item => item.id !== id))
            this.selectedSpecificPlace = null
        },
        //******* Api methods end *******//
        changeTabActivities(type){
            if(type == 'edit'){
                this.tabs.map(t=>  t.disabled = false)
            }
        },
        //******* Creation methods begin *******//
        investigateStatus(data){
            data.status == 200 ? this.$router.push(`/place/edit/${data.id}`):false;
        },
        //******* Creation methods end *******//
        addForm: function () {
            this.insertedForms.push({ title: '', distance:0 });
        }
    },
    mounted(){
        this.getListCategory()
    }
}
</script>

<style lang="scss" scoped>

</style>