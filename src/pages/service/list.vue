<template>
      <div class="grid p-fluid animate__animated animate__fadeIn">
		<div class="col-12 md:col-12">
            <div class="card card-w-title">
                <div class="flex flex-row justify-content-between">
                    <span class="text-xl" v-text="'لیست اتاق ها'"></span>
                    <div @click="routeToService('create')" class="flex flex-row align-items-center p-button-outlined p-button-primary text-primary cursor-pointer">
                        <i class="pi pi-plus"></i>
                        <span class="mr-1" v-text="'اتاق جدید'"></span>
                    </div>
                </div>
                <Divider type="dashed"/>
                <!-- Show service section Begin -->
                <div v-if="!!services.length" class="grid p-fluid">
                    <div v-for="(service , index) in services" :key="index" class="col-12 md:col-2">
                        <ServiceItem :data="service" @refresh-list="refreshList"></ServiceItem>
                    </div>
                </div>
                <!-- Show service section Ended -->
                <div v-if="loading['noData'] && !services.length" class="w-full text-center my-3">
                    <InlineMessage>موردی وجود ندارد</InlineMessage>
                </div>
                <Paginator v-if="!loading['getData'] && !!services.length" @page="changePage($event)" v-model:rows="perPage" :totalRecords="totalItemsCount" ></Paginator>
            </div>
		</div>
	</div>
</template>

<script>
import Service from '@/components/service/service.vue';
export default {
    name: 'placeList',
    components:{
        ServiceItem: Service,
    },
    data(){
        return {
            filter:{
                placeId: null,
                Title:'',
                Accepted:null,
                PageIndex: 1,
                PageSize: 10,
            },
            services:[],
            selected:{},
            dialog:{
                delete: false,
            },
            pageIndex:1,
            perPage:1,
            pageSize:10,
            totalItemsCount:1,
            loading:{
                getData:true,
                noData:null,
            },
            placeId:null,
        }
    },
    computed:{
        processPlaceId(){
            this.placeId = this.$route.params.place_id
            return this.placeId
        }
    },
    watch:{
        processPlaceId(){
            this.$route.params.place_id
        }
    },
    methods:{
        //******* Api methods end *******//
        async getListServices(page = 1){
            this.filter.placeId = this.placeId
            //TODO: change add place id from data to route
            const {status , data} = await this.axios({method:'get',url:`Place/${this.processPlaceId}/Service/?TitleQuery=&PageIndex=${page}&PageSize=${this.pageSize}` , data:this.filter})
            this.totalItemsCount = data.pageCount
            this.services = [...data.data];
            setTimeout(()=>{
                this.loading['getData'] = false;
            },1000)
            this.loading['noData']= true;
        },
        //******* Api methods end *******//
        changePaging(e){
            this.pageIndex = ++e.page;
            this.getListServices(++e.page);
        },
        refreshList(status){
            status && this.getListServices(this.pageIndex)
        },
        createEvent(status){
            status && this.$router.push('/service/create')
        },
        changePage(e){
            this.pageIndex = ++e.page
            this.getListServices(this.pageIndex)
        },
        routeToService(mode , id = null){
            // {name:'createService' , params:{place_id: this.placeId , type: mode , service_id:null}}
            this.$router.push(`/place/${this.placeId}/${mode}/service/${'-'}/details`)
        },
    },
    mounted(){
        this.getListServices(this.pageIndex)
    }
}
</script>

<style lang="scss" scoped>
.h-fill{
    height: 100%;
    height: -moz-available;
    height: -webkit-fill-available;
    height: fill-available;
}
</style>