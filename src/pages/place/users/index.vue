<template>
    <div class="grid p-fluid animate__animated animate__fadeIn">
		<div class="col-12 md:col-12">
            <div class="card card-w-title h-screen">
                <HeaderBar title="لیست کاربران"/>
                <div class="grid p-fluid border-dashed border-1 border-gray-500 border-round-3xl py-3">
                    <form class="col-12" @submit.prevent="assignUser">
                        <div class="grid p-fluid">
                            <div class="col-12 md:col-4">
                                <span class="p-float-label">
                                    <AutoComplete forceSelection v-model="form.user" :suggestions="users" @complete="searchCountry($event)" optionLabel="firstName">
                                        <template #item="slotProps">
                                            <div class="flex flex-row justify-content-between">
                                                <span>{{slotProps.item.firstName}} {{slotProps.item.lastName}}</span>
                                                <span>{{slotProps.item.mobile}}</span>
                                            </div>
                                        </template>
                                    </AutoComplete>
                                    <label for="ruleId">انتخاب کاربر</label>
                                </span>
                            </div>
                            <div class="col-12 md:col-4">
                                <span class="p-float-label">
                                    <Dropdown v-model="form.role" id="ruleId" :options="userRolesEnum" optionLabel="title" optionValue="id"/>
                                    <label for="ruleId">انتخاب نقش</label>
                                </span>
                            </div>
                            <div class="field col-4 flex flex-row justify-content-center">
                                <span class="w-4">
                                    <Button type="submit" class="mr-2 mb-2" label="تایید" icon="pi pi-check" :loading="loading['create']" />
                                </span>
                            </div>
                        </div>
                    </form>
                </div>
                <!-- Table Section Begin -->
                <DataTable v-if="!!placeUsers.length" ref="dt" @page="changePaging($event)" :value="placeUsers" dataKey="id" :paginator="true" :rows="pageSize" class="mt-5 shadow-5 animate__animated animate__fadeIn" 
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink  RowsPerPageDropdown" responsiveLayout="scroll">
					<Column field="title" header="نام" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">نام</span>
							{{slotProps.data.userFullName}}
						</template>
					</Column>
					<Column field="title" header="نقش کاربر" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">نقش کاربر</span>
							{{getRoleName(slotProps.data.role)}}
						</template>
					</Column>
                    <Column header="عملیات" headerStyle="min-width:10rem;">
						<template #body="slotProps" class="flex flex-row ">
							<Button icon="pi pi-pencil" v-tooltip.top="'ویرایش'" class="p-button-rounded p-button-secondary" @click="confirmEditUserRole(slotProps.data)" />
							<Button icon="pi pi-trash" v-tooltip.top="'حذف'" class="p-button-rounded p-button-warning mx-2" @click="confirmDeleteUser(slotProps.data)" />
                            <Button :icon="`pi pi-${slotProps.data.isActive?'check':'times'}`" v-tooltip.top="'تغییر وضعیت'" :class="`p-button-rounded p-button-${slotProps.data.isActive?'success':'danger'} mt-2`" @click="changeActiveStatus(slotProps.data)" />
						</template>
					</Column>
				</DataTable>
                <div v-else class="w-full text-center my-3">
                    <InlineMessage>موردی وجود ندارد</InlineMessage>
                </div>
                <!-- Table Section End -->
                <!-- Delete Dialog Section Begin -->
                <Dialog v-model:visible="dialog['delete']" :style="{width: '450px'}" header="حذف" :modal="true">
					<div class="flex flex-column align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle" style="font-size: 4rem" />
						<span v-if="selectedUserId['delete']" class="mt-3">آیا مطمئن هستید؟</span>
					</div>
					<template #footer >
                        <div class="text-center">
                            <Button label="خیر" icon="pi pi-times" class="p-button-text" @click="dialog['delete'] = false"/>
                            <Button label="بلی" icon="pi pi-check" class="p-button-text" @click="removeUser" />
                        </div>
					</template>
				</Dialog>
                <!-- Delete Dialog Section Ended -->
                <!-- Edit Dialog Section Begin -->
                <Dialog v-model:visible="dialog['edit']" :style="{width: '450px'}" header="ویرایش نقش" :modal="true">
                    <div class="grid p-fluid mt-3">
                        <div class="col-12">
                            <span class="p-float-label">
                                <Dropdown v-model="editRole" id="ruleId" :options="userRolesEnum" optionLabel="title" optionValue="id"/>
                                <label for="ruleId">انتخاب نقش</label>
                            </span>
                        </div>
                    </div>
					<template #footer >
                        <div class="text-center">
                            <Button label="خیر" icon="pi pi-times" class="p-button-text" @click="dialog['edit'] = false"/>
                            <Button label="بلی" icon="pi pi-check" class="p-button-text" @click="editUserRole" />
                        </div>
					</template>
				</Dialog>
                <!-- Edit Dialog Section Ended -->
            </div>
		</div>
	</div>
</template>

<script>
export default {
    name:'placeUserManagement',
    data(){
        return{
            dialog:{
                edit:false,
                delete: false,
            },
            pageIndex:1,
            perPage:1,
            pageSize:10,
            totalItemsCount:1,
            loading:{
                getData:true,
                noData:null,
                create:false,
            },
            users:[],
            assignedUsers:[],
            placeUsers:[],
            form:{
                user:null,
                role:null,
            },
            editRole:null,
            userRolesEnum:[
                {
                    'title':'مالک',
                    'id':0,
                },
                {
                    'title':'اپراتور',
                    'id':1,
                },
            ],
            selectedUserId:{
                delete: null,
                status: null,
                edit:null,
            },
        }
    },
    watch:{
        '$route.params.place_id':{
            handler: function(id){
                this.getPlaceListUsers()
            },
            immediate: true,
        }
    },
    computed:{
        getRoleName(){
            return id => this.userRolesEnum.filter(role=>role.id == id)[0].title
        }
    },
    methods:{
        //******* Api methods end *******//
        async getListUsers(query , page = 1){
            const {status , data} = await this.axios({method:'get',url:`UserManagment/GetAll?TitleQuery=${query}&PageIndex=1&PageSize=5`})
            this.pageIndex = data.pageIndex
            this.users = [...data.data];
        },
        async getPlaceListUsers(page = 1){
            const {status , data} = await this.axios({method:'get',url:`${this.$route.params.place_id}/PlaceUserManagement`})
            this.totalItemsCount = data.pageCount
            this.placeUsers = [...data];
            setTimeout(()=>{
                this.loading['getData'] = false;
            },1000)
        },
        async assignUser(){
            let form = {
                userId: this.form.user.id,
                role: this.form.role,
            }
            const {status , data} = await this.axios({method:'post',url:`${this.$route.params.place_id}/PlaceUserManagement`, data: form})
            this.showToast(status)
            status === 200 && (this.getPlaceListUsers());
            this.form = {user :null , role :null}
        },
        async removeUser(){
            const {status , data} = await this.axios({method:'delete',url:`${this.$route.params.place_id}/PlaceUserManagement/${this.selectedUserId['delete']}`})
            this.showToast(status)
            status === 200 && this.getPlaceListUsers();
            this.selectedUserId['delete'] = null;
			this.dialog['delete'] = false;
        },
        async changeActiveStatus(selected){
            const {status , data} = await this.axios({method:'patch',url:`${this.$route.params.place_id}/PlaceUserManagement/${selected.userId}/changeActiveStatus`});
            this.showToast(status)
            status == 200 || status == 201?this.placeUsers.map(user=>{
                user.userId == selected.userId ? user.isActive = !selected.isActive:false;
            }):false;
        },
        async editUserRole(){
            let form = {
                userId: this.selectedUserId['edit'],
                role: this.editRole,
                alternateUserId: null,
            };
            const {status , data} = await this.axios({method:'put',url:`${this.$route.params.place_id}/PlaceUserManagement`, data: form});
            this.showToast(status)
            status === 200 && (this.getPlaceListUsers());
            this.form = {role :null}
            this.selectedUserId['edit'] = null;
            this.dialog['edit'] = false;
        },
        //******* Api methods end *******//
        searchCountry(event) {
            this.getListUsers(event.query);
		},
        changePaging(e){
            this.getListUsers(++e.page)
        },
        confirmDeleteUser(selected) {
			this.selectedUserId['delete'] = selected.userId;
			this.dialog['delete'] = true;
		},
        confirmEditUserRole(selected){
            this.selectedUserId['edit'] = selected.userId;
            this.dialog['edit'] = true;
        }
    },
}
</script>
<style lang="scss">

</style>