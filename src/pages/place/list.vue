<template>
      <div class="grid p-fluid animate__animated animate__fadeIn">
		<div class="col-12 md:col-12">
            <div class="card card-w-title">
                <HeaderBar createButton="true" @new-event="createEvent" title="لیست مکان ها"/>
                <!-- Show place section Begin -->
                <div v-if="!!places.length" class="grid p-fluid">
                    <div v-for="(place , index) in places" :key="index" class="col-12 md:col-4">
                        <PlaceItem :data="place" @refresh-list="refreshList"></PlaceItem>
                    </div>
                </div>
                <!-- Show place section Ended -->
                <div v-if="loading['noData'] && !places.length" class="w-full text-center my-3">
                    <InlineMessage>موردی وجود ندارد</InlineMessage>
                </div>
                <Paginator v-if="!loading['getData'] && !!places.length" @page="changePage($event)" v-model:rows="perPage" :totalRecords="totalItemsCount" ></Paginator>
            </div>
		</div>
	</div>
</template>

<script>
import Place from '@/components/place/place.vue';
export default {
    name: 'placeList',
    components:{
        PlaceItem: Place,
    },
    data(){
        return {
            places:[],
            elected:{},
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
            }
            // {
            //   "id": 10,
            //   "name": "هتل پارس",
            //   "address": "سلطانیه",
            //   "phoneNumber": "new.jpj",
            //   "description": "descr",
            //   "latitude": 213123123.123123,
            //   "longitude": 12312321312.123213,
            //   "walletPrice": 2300000,
            //   "category": {
            //     "id": 0,
            //     "title": null,
            //     "description": null,
            //     "picture": null
            //   },
            //   "state": {
            //     "id": 0,
            //     "title": null
            //   },
            //   "city": {
            //     "id": 0,
            //     "title": null
            //   },
            //   "isActive": false,
            //   "isCompleted": false
            // }
        }
    },
    methods:{
        //******* Api methods end *******//
        async getListPlaces(page = 1){
            const {status , data} = await this.axios({method:'get',url:`Place/GetAll?TitleQuery=&PageIndex=${page}&PageSize=${this.pageSize}`})
                this.totalItemsCount = data.pageCount
                this.places = [...data.data];
                setTimeout(()=>{
                    this.loading['getData'] = false;
                },1000)
        },
        //******* Api methods end *******//
        changePaging(e){
            this.pageIndex = ++e.page;
            this.getListPlaces(++e.page);
        },
        refreshList(status){
            status && this.getListPlaces(this.pageIndex)
        },
        createEvent(status){
            if(status){
                this.$router.push(`/place/create/${''}`)
            }
        },
        changePage(e){
            this.pageIndex = ++e.page
            this.getListPlaces(this.pageIndex)
        }
    },
    mounted(){
        this.getListPlaces(this.pageIndex)
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