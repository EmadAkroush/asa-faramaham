<template>
  <div class="grid p-fluid h-screen animate__animated animate__fadeIn">
    <div class="col-12">
        <div class="card px-3">
            <h5 class="text-primary">اطلاعات اتاق</h5>
            <TabMenu :model="routeItems" />
            <div class="grid">
                <Transition name="fade">
                    <router-view/>
                </Transition>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return {
            createRouteItems: [
                {
                    label: 'جزئیات',
                    to: 'details'
                },
            ],
            editRouteItems:[
                {
                    label: 'جزئیات',
                    to: 'details'
                },
                {
                    label: 'ویژگی ها',
                    to: 'features'
                },
                {
                    label: 'استثنائات',
                    to: 'exceptions'
                },
            ],
            routeItems:[],
            ids:{
                place:null,
                service:null,
            },
            crudType:'create'
        }
    },
    computed:{
        getRouterAction(){
            const {place_id ,type ,service_id} = {...this.$route.params};
            this.ids.place = place_id;
            this.ids.service = service_id;
            this.crudType = type
            type == 'create' ?this.routeItems = this.createRouteItems:this.routeItems = this.editRouteItems;
            return this.crudType;
        },
    },
    watch:{
        getRouterAction(){}
    },
}
</script>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>