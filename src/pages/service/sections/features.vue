<template>
    <!-- Features section -->
    <div v-if="getRouterAction === 'edit'" class="col-12">
        <h5 class="my-1">ویژگی ها:</h5>
        <div v-for="(collection , index) in collections" :key="index" v-memo="[collections]" class="field col-12 mb-0">
            <Divider type="dashed" align="center">
                <div class="flex align-content-center">
                    <img v-lazy :src="'http://77.238.108.125/' + collection.icon" width="20" />
                    <span class=" p-tag">{{collection.title}}</span>
                </div>
            </Divider>
            <div class="grid p-fluid mt-3">
                <div v-for="(feature , index) in collection.features" :key="index" class="field col-12 md:col-3">
                    <div class="card">
                    <div class="flex flex-row justify-content-between">
                        <div class="flex flex-row">
                        <img v-lazy :src="'http://77.238.108.125/' + feature.icon" width="20" />
                        <span class="mx-2">{{feature.title || 'ویژگی'}}</span>
                        </div>
                        <!-- <Checkbox :value="feature" size="small" v-model="selectedFeatures" /> -->
                    </div>
                    <div class="mt-2">
                        <span>نوع ویژگی:</span>
                        <small class="mx-1">{{featureType(feature)}}</small>
                    </div>
                    <div v-if="feature.featureValueType !== ''" class="field my-3" >
                        <h6>مقدار اولیه:</h6>
                        <div v-if="feature.featureValueType === 0" class="field-checkbox mb-0">
                            <Checkbox v-model="feature.value" :binary="true" :falseValue="'false'" :trueValue="'true'" />
                            <label for="checkOption1" class="mr-2">{{feature.value}}</label>
                        </div>
                        <InputText v-else-if="feature.featureValueType === 1" type="text" v-model="feature.value" />
                        <InputNumber v-else id="numberDefaultValue" v-model="feature.value" :useGrouping="false"/>
                    </div>
                    </div>
                </div>
            </div>
        </div>
            <div class="field col-12 flex flex-row align-items-center justify-content-end">
                <div class="md:w-2">
                    <Button icon="pi pi-check" label="ثبت ویژگی ها" loadingIcon="pi pi-spinner" :loading="loading['create']" @click="createServiceFeature" class="p-button p-button-primary" />
                </div>
            </div>
    </div>
    <!-- Features section -->
</template>

<script>
export default {
    name:'ServiceFeatures',
    data() {
        return {
            crudType:'create',
            ids:{
                place:null,
                service:null,
            },
            loading:{
                create:false,
                edit:false,
            },
            collections:null,
        }
    },
    computed:{
        getRouterAction(){
            const {place_id ,service_id , type} = {...this.$route.params};
            this.ids.place = place_id;
            this.ids.service = service_id;
            this.crudType = type
            if(!!service_id){
                this.getFeatures(service_id)
            }
            return this.crudType;
        },
        featureType(){
            return item => item.featureValueType === 0?'چک باکس':item.featureValueType === 1?'متنی':'عددی' 
        },

    },
    watch:{
        getRouterAction(){}
    },
    methods:{
        async getFeatures(_id){
            const {status , data} = await this.axios({method:'get',url:`Place/${this.ids.place}/Service/${_id}/features`})
            this.collections = [...data];
        },
        async createServiceFeature(){
            let _features = []
            this.collections.forEach(function(col){
                col.features.forEach(function(f){
                    _features.push({"featureId": f.featureId , "value": f.value})
                })
            })
            const {status , data} = await this.axios({method:'put',url:`Place/${this.ids.place}/Service/${this.ids.service}/features` , data: {'features':_features}  });
            this.getFeatures(this.ids.service)
            this.showToast(status , data.errors)
        },

    },
}
</script>

<style>

</style>