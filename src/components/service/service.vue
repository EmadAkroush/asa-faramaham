<template>
  <div class="product-item h-full">
        <div class="product-item-content flex flex-column justify-content-between p-2 border-round-md h-full">
            <div class="text-right mt-1">
                <span class="font-semibold">نام سرویس:</span>
                <span class="mr-1 ">{{data.title}}</span>
            </div>
            <div class="text-right mt-1">
                <span class="font-semibold">مکان مرتبط:</span>
                <span class="mr-1">{{data.place.name}}</span>
            </div>
            <div class="text-right mt-1">
                <span class="font-semibold">قیمت:</span>
                <span class="mr-1">{{data.price}}</span>
                <span class="mr-1">(تومان)</span>
            </div>
            <div class="text-right mt-1">
                <span class="font-semibold">ظرفیت اضافه:</span>
                <span class="mr-1">{{data.additionalCapacity}}</span>
                <span class="mr-1">(نفر)</span>
            </div>
            <div class="text-right mt-1">
                <span class="font-semibold">ظرفیت استاندارد:</span>
                <span class="mr-1">{{data.standardCapacity}}</span>
                <span class="mr-1">(نفر)</span>
            </div>
            <!-- <div class="text-right">
                <span class="font-semibold">تگ ها:</span>
                <span class="mr-1">{{data.tags.length?data.tags.join(','):'ثبت نشده'}}</span>
            </div> -->
            <div class="car-buttons mt-5">
                <Button @click="editEvent(data)" type="button" icon="pi pi-pencil" v-tooltip.top="'ویرایش'" class="p-button-rounded p-button-success ml-2" />
                <Button @click="dialog['delete'] = true" type="button" icon="pi pi-trash" v-tooltip.top="'حذف'" class="p-button-rounded p-button-warning ml-2" />
                <Button @click="changeActiveStatus(data)" :loading="loading['active']" type="button" :icon="`pi pi-${data.isActive?'check':'times'}`" v-tooltip.top="'وضعیت'" :class="`p-button-rounded p-button-${data.isActive?'success':'danger'}`" ></Button>
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
                    <Button label="بلی" icon="pi pi-check" class="p-button-text" @click="deleteService(data.id)" />
                </div>
            </template>
        </Dialog>
        <!-- Delete Dialog Section Ended -->
    </div>
</template>

<script>
export default {
    name: 'placeComponent',
    emits: ['remove-event'],
    props:{
        data:{
            type: Object,
            default: {
                "title": "",
                "quantity": null,
                "standardCapacity": null,
                "price": null,
                "additionalCapacity": null,
                "additionalCapacityPrice": null,
                "isWednesdayWeekend": false,
                "peakDayPrice": null,
                "isActive": false,
                "prepaymentPercentage": null,
                "beds": [],
                "floorOfRooms": [],
                "tags": [],
                "features": [],
            },
        },
    },
    data(){
        return {
            selected:null,
            dialog:{
                delete: false,
            },
            loading:{
                active:false
            }
        }
    },
    computed:{
        mergeLocation(){
            this.data
            return this.data
        }
    },
    watch:{
        mergeLocation(){}
    },
    methods: {
        //******* Api methods end *******//
        async changeActiveStatus(selected){
            this.loading['active'] = true;
            let activity = {
                isActive: !selected.isActive
            }
            const {status , data} = await this.axios({method:'patch',url:`Place/${this.data.place.id}/Service/${selected.id}/ChangeServiceStatus`, data:activity});
            this.showToast(status)
            status == 200 || status == 201?selected.isActive = !selected.isActive:false;
            this.loading['active'] = false;
        },
        //TODO: Add delete service in request header
        async deleteService(id){
            const {status , data} = await this.axios({method:'delete',url:`Place/${this.data.place.id}/Service/${id}/DeleteService`})
            this.selected = {}
            this.showToast(status)
            this.dialog['delete'] = false;
            status == 200 || status == 201?this.refreshList(true):false;
        },
        //******* Api methods end *******//
        refreshList(status){
            this.$emit('refresh-list' , status);
        },
        editEvent(selected){
            this.$router.push({name:'serviceDetails' , params:{place_id: selected.place.id ,type:'edit', service_id:selected.id}})
            // this.$router.push(`place/${selected.place.id}/service/edit/${selected.id}`);   
        }
    },
}
</script>

<style lang="scss" scoped>
    @import '../../assets/demo/badges.scss';
    @import '../../assets/demo/items.scss';
</style> 