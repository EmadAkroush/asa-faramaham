<template>
    <!-- <span class="p-float-label">
        <label for="inputNameId">اندازه </label>
    </span> -->
      <!-- <Divider align="center">
          <div class="inline-flex align-items-center"> -->
              <h5 class="mb-0">مشاهده ویژگی ها:</h5>
          <!-- </div>
      </Divider> -->
    <div class="grid p-fluid mt-3" >
      <div class="field col-12 md:col-4 ">
        <div class="p-inputgroup">
            <span class="p-inputgroup-addon">
                <span>متر</span>
            </span>
            <InputNumber v-model="form.totalAreaByMeters" placeholder="مساحت سازه" mode="decimal" :useGrouping="false"/>
        </div>
      </div>
      <div class="field col-12 md:col-4 ">
        <div class="p-inputgroup">
            <span class="p-inputgroup-addon">
                <span>طبقه</span>
            </span>
              <InputNumber v-model="form.numberOfFloors" placeholder="تعداد طبقات" mode="decimal" :min="0" :max="40" :useGrouping="false"/>
        </div>
      </div>
      <!-- TODO: On development -->
      <div v-for="(collection , index) in collections.featureCollections" :key="index" v-memo="[collections.featureCollections]" class="field col-12">
        <div class="flex align-content-center">
          <img v-lazy :src="'http://77.238.108.125/' + collection.icon" width="20" />
          <span class="mx-1">{{collection.title}}</span>
          </div>
        <div class="grid p-fluid mt-3">
          <div v-for="(feature , index) in collection.features" :key="index" class="field col-12 md:col-3">
            <div class="card h-full">
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
                      <Checkbox v-model="feature.value" :binary="true" />
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
          <Button icon="pi pi-check" label="ثبت ویژگی ها" loadingIcon="pi pi-spinner" :loading="loading['create']" @click="createPlaceFeature" class="p-button p-button-primary mr-2 mb-2" />
        </div>
      </div>
      <h5 class="mb-0">فاصله تا مکان های خاص:</h5>
      <div class="field col-12">
        <slot name="specifics"></slot>
      </div>
    </div>
</template>

<script>
export default {
    name: 'placeFeatures',
    props:{
      collections:{
        type: Object,
        default: null
      },
      placeId:{
        type:Number,
        default: null
      },
    },
    data(){
      return {
        form: { 
          "totalAreaByMeters": 0,
          "numberOfFloors": 0,
          "features": []
        },
        featureValueTypes: [
            {'value': 'چک باکس', 'id': 0},
            {'value': 'متنی', 'id': 1},
            {'value': 'عددی', 'id':  2},
        ],
        loading:{
          create:false
        },
        selectedFeatures:[],
      }
    },
    watch:{
      '$props.collections':{
        handler:(val)=>{
          val
        },
        immediate: true,
        deep: true,
      }
    },
    computed:{
      featureType(){
        return item => item.featureValueType === 0?'چک باکس':item.featureValueType === 1?'متنی':'عددی' 
      }
    },
    methods:{
      //******* Api methods begin *******//
      async createPlaceFeature(){
        this.loading['create'] = true;
        let test = []
        this.collections.featureCollections.forEach(function(col){
          col.features.forEach(function(f){
            test.push({"featureId": f.featureId , "value": f.value})
          })
        })
        this.form.features = test
        const {status , data} = await this.axios({method:'put',url:`Place/${this.placeId}/features` , data: this.form  });
        this.$emit('create-event')
        this.showToast(status)
        this.loading['create'] = false;
      },
      //******* Api methods end *******//
    },
    mounted(){
      if(!!this.collections){
        this.form.totalAreaByMeters = this.collections.totalAreaByMeters
        this.form.numberOfFloors = this.collections.numberOfFloors
      }
    }
}
</script>