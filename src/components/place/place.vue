<template>
  <div class="product-item">
        <div class="product-item-content p-2 border-round-md">
            <div class="mb-3">
                <img v-lazy :src="!!data.image?`http://77.238.108.125/${data.image}`:require(`~/${staticImage}`)" :alt="data.name" class="w-full border-round-md" />
                <!-- <v-slot name="multi-image"></v-slot> -->
            </div>
            <div class="text-right">
                <h4 class="mb-1 font-semibold">{{data.name}}</h4>
                <h5 class="my-2">دسته بندی: {{data.category}}</h5>
                <h6 class="mt-0 mb-1">آدرس: <span>{{mergeLocation(data)}}</span>/<span>{{ data.address }}</span></h6>
            </div>
            <div class="flex justify-content-center gap-1 mt-5">
                <Button @click="editEvent(data.id)" type="button" icon="pi pi-pencil" v-tooltip.top="'ویرایش'" class="p-button-rounded p-button-secondary" />
                <Button @click="dialog['delete'] = true" type="button" icon="pi pi-trash" v-tooltip.top="'حذف'" class="p-button-rounded p-button-warning" />
                <Button @click="changeActiveStatus(data)" :loading="loading['active']" type="button" :icon="`pi pi-${data.isActive?'check':'times'}`" v-tooltip.top="'وضعیت'" :class="`p-button-rounded p-button-${data.isActive?'success':'danger'}`" ></Button>
                <Button @click="manageUsers(data.id)" type="button" icon="pi pi-user-edit" v-tooltip.top="'مدیریت کاربران'" class="p-button-rounded p-button-primary" />
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
                    <Button label="بلی" icon="pi pi-check" class="p-button-text" @click="deletePlace(data.id)" />
                </div>
            </template>
        </Dialog>
        <!-- Delete Dialog Section Ended -->
    </div>
</template>

<script>
export default {
    name: 'placeComponent',
    emits: ['remove-event','status-event',],
    props:{
        data:{
            type: Object,
            default: {
                "id": 0,
                "name": "",
                "address": "",
                "phoneNumber": "",
                "description": "",
                "latitude": 0.0,
                "longitude": 0.0,
                "walletPrice": 0,
                "category": {
                    "id": 0,
                    "title": null,
                    "description": null,
                    "picture": null
                },
                "state": {
                    "id": 0,
                    "title": null
                },
                "city": {
                    "id": 0,
                    "title": null
                },
                "isActive": false,
                "isCompleted": false
            },
        },
        index:{
            type: Number,
            default: 0,
        }
    },
    data(){
        return {
            selected:null,
            staticImage: 'images/galleria/galleria7.jpg',
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
            return place => { return `${place.state} - ${place.city}` }
        }
    },
    methods: {
        //******* Api methods end *******//
        async changeActiveStatus(selected){
            this.loading['active'] = true;
            let activity = {
                isActive: !selected.isActive
            }
            const {status , data} = await this.axios({method:'patch',url:`Place/${selected.id}/ChangeActiveStatus/`, data:activity});
            this.showToast(status)
            status == 200 || status == 201?selected.isActive = !selected.isActive:false;
            this.loading['active'] = false;
        },
        async deletePlace(id){
            const {status , data} = await this.axios({method:'delete',url:`Place/${id}`})
            this.selected = {}
            this.showToast(status)
            this.dialog['delete'] = false;
            status == 200 || status == 201?this.refreshList(true):false;
        },
        //******* Api methods end *******//
        editEvent(id){
            this.$router.push(`/place/edit/${id}`)
        },
        manageUsers(id){
            this.$router.push(`/place/users/${id}`)
        },
        showToast(status){
            this.$emit('show-toast' , status);
        },
        refreshList(status){
            this.$emit('refresh-list' , status);
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../../assets/demo/badges.scss';
@import '../../assets/demo/items.scss';
</style> 