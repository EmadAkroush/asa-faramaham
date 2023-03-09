<template>
    <div class="grid p-fluid animate__animated animate__fadeIn">
		<div class="col-12 md:col-12">
            <Toast position="top-right"/>
            <div class="card card-w-title">
                <Toolbar class="mb-4">
					<template v-slot:start>
                        <h5 class="mb-0">مدیریت کاربران</h5>
					</template>
					<template v-slot:end>
                        <Button label="جدید" icon="pi pi-plus" class="p-button-success mr-2" @click="newUserDialog = true" />
					</template>
				</Toolbar>
                <!-- Table Section Begin -->
                <DataTable v-if="!!users.length" ref="dt" @page="changePaging($event)" :value="users" dataKey="id" :paginator="true" :rows="pageSize" class="mt-5 shadow-5 animate__animated animate__fadeIn" 
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink  RowsPerPageDropdown" responsiveLayout="scroll">
					<Column field="title" header="نام کاربری" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">نام</span>
							{{slotProps.data.userName}}
						</template>
					</Column>
					<Column field="title" header="نام" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">نام</span>
							{{!!slotProps.data.firstName?slotProps.data.firstName:'---'}}
						</template>
					</Column>
					<Column field="title" header="نام خانوادگی" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">نام خانوادگی</span>
							{{!!slotProps.data.lastName?slotProps.data.lastName:'---'}}
						</template>
					</Column>
					<Column header="شماره همراه" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">شماره همراه</span>
							{{slotProps.data.mobile}}
						</template>
					</Column>
					<Column header="کد ملی" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">کد ملی</span>
							{{!!slotProps.data.natioalCode?slotProps.data.natioalCode:'---'}}
						</template>
					</Column>
					<Column header="شهر" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">شهر</span>
							<span v-if="!slotProps.data.city" class="text-red-500">ثبت نشده</span>
                            <span v-else>{{slotProps.data.city.title}}</span>
						</template>
					</Column>
					<Column header="استان" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">استان</span>
							<span v-if="!slotProps.data.state" class="text-red-500">ثبت نشده</span>
                            <span v-else>{{slotProps.data.state.title}}</span>
						</template>
					</Column>
					<Column header="وضعیت" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">وضعیت</span>
                            <Button :icon="`pi pi-${slotProps.data.isActive?'check':'times'}`" v-tooltip.top="'تغییر وضعیت'" :class="`p-button-rounded p-button-${slotProps.data.isActive?'success':'danger'} mt-2`" @click="changeActiveStatus(slotProps.data)" />
                            <!-- <Tag :severity="slotProps.data.isActive?'success':'danger'" :icon="`pi pi-${slotProps.data.isActive?'check':'times'}`" class="p-3">
                                {{slotProps.data.isActive?'فعال':'غیر فعال'}}
                            </Tag> -->
                        </template>
					</Column>
                    <Column header="عملیات" headerStyle="min-width:10rem;">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" v-tooltip.top="'ویرایش'" class="p-button-rounded p-button-secondary ml-2" @click="editFeature(slotProps.data)" />
							<Button icon="pi pi-trash" v-tooltip.top="'حذف'" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteUser(slotProps.data)" />
						</template>
					</Column>
				</DataTable>
                <div v-else class="w-full text-center my-3">
                    <InlineMessage>موردی وجود ندارد</InlineMessage>
                </div>
                <!-- Table Section End -->
                <!-- Edit Dialog Section Begin -->
                <Dialog v-model:visible="editUserDialog" :style="{width: '450px'}" header="ویرایش" :modal="true" class="p-fluid">
                    <div class="field my-2">
                        <label for="catTitle">نام کاربری:</label>
                        <InputText id="catTitle" type="text" v-model="selected.userName"/>
                    </div>
                    <div class="field my-2">
                        <label for="catTitle">نام:</label>
                        <InputText id="catTitle" type="text" v-model="selected.firstName"/>
                    </div>
                    <div class="field my-2">
                        <label for="catTitle">نام خانوادگی:</label>
                        <InputText id="catTitle" type="text" v-model="selected.lastName"/>
                    </div>
                    <div class="field my-2">
                        <label for="numberDefaultValue">شماره همراه:</label>
                        <InputText id="numberDefaultValue" type="text" v-model="selected.mobile" />
                    </div>
                    <div class="field my-2">
                        <label for="naationalCodeId">کد ملی:</label>
                        <InputText id="naationalCodeId" type="text" v-model="selected.natioalCode" />
                    </div>
                    <div class="field my-2">
                        <label for="rolesId">استان:</label>
                        <Dropdown v-model="selected.stateId" :options="states" optionLabel="title" optionValue="id"/>
                    </div>
                    <div v-if="!!selected.stateId" class="field my-2">
                        <label for="rolesId">شهر:</label>
                        <Dropdown v-model="selected.cityId" :options="getCities(selected.stateId)" optionLabel="title" optionValue="id"/>
                    </div>
                    <div class="field my-2">
                        <label for="naationalCodeId">نقش های کاربر:</label>
                        <MultiSelect v-model="selected.roleIds" :options="roles" optionLabel="name" optionValue="id"/>
                    </div>
                    <!-- <div class="field my-2">
                        <label for="naationalCodeId">وضعیت:</label>
                        <ToggleButton onLabel="فعال" offLabel="غیرفعال" iconPos="right" onIcon="pi pi-check" offIcon="pi pi-times" v-model="selected.isActive"/>
                    </div> -->
					<template #footer>
						<Button label="لغو" icon="pi pi-times" class="p-button-text" @click="editUserDialog = false"/>
						<Button label="ویرایش" icon="pi pi-check" class="p-button-text" @click="updateInfo" />
					</template>
				</Dialog>
                <!-- Edit Dialog Section Ended -->
                <!-- Create Dialog Section Begin -->
                <Dialog v-model:visible="newUserDialog" :style="{width: '600px'}" header="ایجاد کاربر" :modal="true" class="p-fluid">
                    <div class="field my-2">
                        <label for="catTitle">نام:</label>
                        <InputText id="catTitle" type="text" v-model="newUser.firstName"/>
                    </div>
                    <div class="field my-2">
                        <label for="catTitle">نام خانوادگی:</label>
                        <InputText id="catTitle" type="text" v-model="newUser.lastName"/>
                    </div>
                    <div class="field my-2">
                        <label for="nationalCodeId">کد ملی:</label>
                        <InputText type="text" id="nationalCodeId" v-model="newUser.natioalCode" />
                    </div>
                    <div class="field my-2">
                        <label for="numberDefaultValue">شماره همراه:</label>
                        <InputText type="text" id="numberDefaultValue" v-model="newUser.mobile" />
                    </div>
                    <div class="field my-2">
                        <label for="rolesId">نقش های کاربر:</label>
                        <MultiSelect id="rolesId" v-model="newUser.roleIds" :options="roles" optionLabel="name" optionValue="id"/>
                    </div>
                    <div class="field my-2">
                        <label for="rolesId">استان:</label>
                        <Dropdown v-model="newUser.stateId" :options="states" optionLabel="title" optionValue="id"/>
                    </div>
                    <div v-if="!!newUser.stateId" class="field my-2">
                        <label for="rolesId">شهر:</label>
                        <Dropdown v-model="newUser.cityId" :options="getCities(newUser.stateId)" optionLabel="title" optionValue="id"/>
                    </div>
                    <div class="field my-2">
                        <label for="naationalCodeId">وضعیت:</label>
                        <ToggleButton onLabel="فعال" offLabel="غیرفعال" iconPos="right" onIcon="pi pi-check" offIcon="pi pi-times" v-model="newUser.isActive"/>
                    </div>
                    <template #footer>
                        <Button label="لغو" icon="pi pi-times" class="p-button-text" @click="newUserDialog = false" />
                        <Button type="submit" class="p-button-text" label="ایجاد" icon="pi pi-check" @click="createUser" :loading="loading[create]" />
                    </template>
                </Dialog>
                <!-- Create Dialog Section Ended -->
                <!-- Delete Dialog Section Begin -->
                <Dialog v-model:visible="deleteUserDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="flex flex-column align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle" style="font-size: 4rem" />
						<span v-if="selected" class="mt-3">آیا مطمئن هستید؟</span>
					</div>
					<template #footer >
                        <div class="text-center">
                            <Button label="خیر" icon="pi pi-times" class="p-button-text" @click="deleteUserDialog = false"/>
                            <Button label="بلی" icon="pi pi-check" class="p-button-text" @click="removeUser" />
                        </div>
					</template>
				</Dialog>
                <!-- Delete Dialog Section Ended -->
            </div>
        </div>
    </div>
</template>

<script>
import states from '../../../public/data/location.json';
export default {
    name: 'management',
    data(){
        return {
            newUser:{
                userName: '',
                firstName: '',
                lastName: '',
                natioalCode: '',
                cityId: '',
                stateId: '',
                isActive: false,
                mobile: '',
                roles:[],
            },
            newUserDialog:false,
            pageSize:10,
            users:[],
            loading:{
                create:false,
            },
            selected:{},
            editUserDialog:false,
            deleteUserDialog:false,
            roles:[],
            states: states,
        }
    },
    methods: {
        //******* Api methods begin *******//
        async getListUsers(page = 1){
            const {status , data} = await this.axios({method:'get',url:`UserManagment/GetAll?TitleQuery=&PageIndex=${page}&PageSize=${this.pageSize}`})
            this.pageSize = data.pageSize
            this.users = [...data.data];
        },
        async createUser(){
            //TODO: Add create user after api implemented
        },
        async updateInfo(){
            delete this.selected.city;
            delete this.selected.state;
            const {status , data} = await this.axios({method:'put',url:`UserManagment/UpdateInfo/${this.selected.id}`,data:this.selected})
            (status === 200) && this.getListUsers();
            this.showToast(status);
            this.editUserDialog = false;
        },
        async changeActiveStatus(selected){
            let activity = {
                isActive: !selected.isActive
            }
            const {status , data} = await this.axios({method:'put',url:`UserManagment/ChangeStatus/${selected.id}`, data:activity});
            this.showToast(status, data.errors);
            status == 200 || status == 201?this.users.map(user=>{
                user.id == selected.id?user.isActive = !selected.isActive:false;
            }):false;
        },
        async removeUser(){
            //TODO: Add delete user after api implemented
        },
        async getRoles(){
            const {status , data} = await this.axios({method:'get',url:`UserManagment/GetAllRoles`});
            status == 200 ?this.roles = [...data]:false;
        },
        //******* Api methods end *******//
        getCities(id){
            return this.states.filter(state=> state.id === id)[0].cities
        },
        concatName(first , last){
            return first + last
        },
        changePaging(e){
            this.getListUsers(++e.page)
        },
        confirmDeleteUser(selected) {
			this.selected = selected;
			this.deleteUserDialog = true;
		},
        editFeature(selected) {
			this.selected = {...selected};
            this.selected.cityId = (!!this.selected.city && this.selected.city.id) || null
            this.selected.stateId = (!!this.selected.state && this.selected.state.id) || null
			this.editUserDialog = true;
		},
    },
    mounted(){
        this.getRoles()
        this.getListUsers()
    }
}
</script>

<style>

</style>