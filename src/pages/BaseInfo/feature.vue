<template>
    <div class="grid p-fluid animate__animated animate__fadeIn">
		<div class="col-12 md:col-12">
            <Toast position="top-right"/>
			<div class="card card-w-title">
                <Toolbar class="mb-4">
					<template v-slot:start>
                        <h5 class="mb-0">امکانات</h5>
					</template>
					<template v-slot:end>
                        <Button label="جدید" icon="pi pi-plus" class="p-button-success mr-2" @click="newFeatureDialog = true" />
					</template>
				</Toolbar>
                <!-- Table Section Begin -->
                <DataTable v-if="!!features.length" ref="dt" @page="changePaging($event)" :value="features" dataKey="id" :paginator="true" :rows="pageSize" class="mt-5 shadow-5 animate__animated animate__fadeIn" 
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink  RowsPerPageDropdown" responsiveLayout="scroll">
					<Column field="title" header="عنوان" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">عنوان</span>
							{{slotProps.data.title}}
						</template>
					</Column>
					<Column header="تصویر" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">تصویر</span>
							<img v-lazy :src="'http://77.238.108.125/' + slotProps.data.icon" width="40" />
						</template>
					</Column>
					<Column field="title" header="استفاده همگانی" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">استفاده همگانی</span>
							{{slotProps.data.isCommon?'بلی':'خیر'}}
						</template>
					</Column>
                    <Column header="وضعیت" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">وضعیت</span>
                            <Button :icon="`pi pi-${slotProps.data.isActive?'check':'times'}`" loadingIcon="pi pi-spinner pi-spin" :disabled="loading['active']" :loading="loading['active']" v-tooltip.top="'تغییر وضعیت'" :class="`p-button-rounded p-button-${slotProps.data.isActive?'success':'danger'} mt-2`" @click="changeActiveStatus(slotProps.data)" />
                        </template>
					</Column>
                    <Column header="عملیات" headerStyle="min-width:10rem;">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" v-tooltip.top="'ویرایش'" class="p-button-rounded p-button-secondary ml-2" @click="editFeature(slotProps.data)" />
							<Button icon="pi pi-trash" v-tooltip.top="'حذف'" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteFeature(slotProps.data)" />
						</template>
					</Column>
				</DataTable>
                <div v-else class="w-full text-center my-3">
                    <InlineMessage>موردی وجود ندارد</InlineMessage>
                </div>
                <!-- Table Section End -->
                <!-- Edit Dialog Section Begin -->
                <Dialog v-model:visible="featureDialog" :style="{width: '600px'}" header="ویرایش" :modal="true" class="p-fluid">
                    <div v-if="selected.icon" class="overflow-hidden">
                        <img :src="'http://77.238.108.125/' + selected.icon" width="150" class="mt-0 mx-auto mb-5 block shadow-2" />
                        <div class="text-center">
                            <Button icon="pi pi-times" class="p-button-rounded p-button-danger p-button-text mb-2" @click="selected.icon = null" />
                        </div>
                    </div>
                    <div v-else>
                        <label for="pictureUploaderId" class="file-uploader bg-primary w-full justify-content-center">
                            <i class="pi pi-fw pi-upload ml-2" />
                            <span>آپلود فایل</span>
                        </label>
                        <input id="pictureUploaderId" @change="onUpload($event , 'edit')" type="file" hidden >
                        <Button v-if="editPicture != null" :label="editPicture.name" icon="pi pi-times" class="p-button-outlined mt-3"  @click="editPicture = null" />
                    </div>
					<div class="field">
						<label for="name">عنوان</label>
						<InputText id="name" v-model.trim="selected.title" required="true" autofocus :class="{'p-invalid': submitted && !selected.title}" />
						<!-- <small class="p-invalid" v-if="submitted && !selected.title">Name is required.</small> -->
					</div>
                    <div class="field" :class="{'border-1 p-2 border-round-md border-dashed border-500': selected.featureValueType !== ''}">
                        <div class="my-2" >
                            <label for="catTitle">نوع ویژگی:</label>
                            <Dropdown v-model="selected.featureValueType" :options="featureValueTypes" optionLabel="value" optionValue="id"/>
                        </div>
                        <div v-if="selected.featureValueType !== ''" class="field my-3" >
                            <h6>مقدار اولیه:</h6>
                            <div v-if="selected.featureValueType === 0" class="field-checkbox mb-0">
                                <Checkbox v-model="checkedSelectedDefaultValueType" :binary="true" />
                                <label for="checkOption1" class="mr-2">{{selected.defaultValue}}</label>
                            </div>
                            <InputText v-else-if="selected.featureValueType === 1" type="text" v-model="textSelectedDefaultValueType" />
                            <InputNumber v-else id="numberDefaultValue" v-model="numberSelectedDefaultValueType" :useGrouping="false" />
                        </div>
                    </div>
                    <div v-if="!selected.isCommon" class="field my-2">
                        <label for="catTitle">انتخاب دسته بندی:</label>
                        <MultiSelect v-model="selected.categoriesIds" :options="categories" optionLabel="title" optionValue="id" :selectionLimit="categories.length-1"/>
                    </div>
                    <div class="field my-2">
                        <label for="catTitle">نوع:</label>
                        <MultiSelect v-model="selected.forTypes" :options="featureType" optionLabel="title" optionValue="id"/>
                    </div>
                    <div class="field my-2">
                        <label for="catTitle">انتخاب مجموعه ویژگی:</label>
                        <Dropdown v-model="selected.featureCollectionId" :options="collections" optionLabel="title" optionValue="id"/>
                    </div>
                     <div class="field-checkbox mb-0">
                            <Checkbox v-model="selected.isCommon" :binary="true" />
                            <label for="checkOption1" class="mr-2">این ویژگی به طور پیش فرض برای همه استفاده شود؟</label>
                        </div>
					<template #footer>
						<Button label="لغو" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="ویرایش" icon="pi pi-check" class="p-button-text" @click="updateFeature" />
					</template>
				</Dialog>
                <!-- Edit Dialog Section Ended -->
                <!-- Delete Dialog Section Begin -->
                <Dialog v-model:visible="deleteFeatureDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="flex flex-column align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle" style="font-size: 4rem" />
						<span v-if="selected" class="mt-3">آیا مطمئن هستید؟</span>
					</div>
					<template #footer >
                        <div class="text-center">
                            <Button label="خیر" icon="pi pi-times" class="p-button-text" @click="deleteFeatureDialog = false"/>
                            <Button label="بلی" icon="pi pi-check" class="p-button-text" @click="removeFeature" />
                        </div>
					</template>
				</Dialog>
                <!-- Delete Dialog Section Ended -->
                <Dialog v-model:visible="newFeatureDialog" :style="{width: '600px'}" header="ایجاد ویژگی" :modal="true" class="p-fluid">
                    <form class="p-fluid">
                        <div class="field my-2">
                            <label for="catTitle">عنوان:</label>
                            <InputText id="catTitle" type="text" v-model="feature.title"/>
                        </div>
                        <div class="field" :class="{'border-1 p-2 border-round-md border-dashed border-500': feature.featureValueType !== ''}">
                            <div class="my-2" >
                                <label for="catTitle">نوع ویژگی:</label>
                                <Dropdown v-model="feature.featureValueType" :options="featureValueTypes" optionLabel="value" optionValue="id"/>
                            </div>
                            <div v-if="feature.featureValueType !== ''" class="field my-3" >
                                <h6>مقدار اولیه:</h6>
                                <div v-if="feature.featureValueType === 0" class="field-checkbox mb-0">
                                    <Checkbox v-model="checkedDefaultValueType" :binary="true" />
                                    <label for="checkOption1" class="mr-2">{{checkedDefaultValueType}}</label>
                                </div>
                                <InputText v-else-if="feature.featureValueType === 1" type="text" v-model="textDefaultValueType" />
                                <InputNumber v-else id="numberDefaultValue" v-model="numberDefaultValueType" :useGrouping="false"/>
                            </div>
                        </div>
                        <div class="field my-2">
                            <label for="catTitle">نوع:</label>
                            <MultiSelect v-model="feature.forTypes" :options="featureType" optionLabel="title" optionValue="id"/>
                        </div>
                        <div v-if="!feature.isCommon" class="field my-2">
                            <label for="catTitle">انتخاب دسته بندی:</label>
                            <MultiSelect v-model="feature.categoriesIds" :options="categories" optionLabel="title" optionValue="id" :selectionLimit="categories.length-1"/>
                        </div>
                        <div class="field my-2">
                            <label for="catTitle">انتخاب مجموعه ویژگی:</label>
                            <Dropdown v-model="feature.featureCollectionId" :options="collections" optionLabel="title" optionValue="id"/>
                        </div>
                        <div class="formgrid grid col-12">
                            <div class="field col-12 md:col-6">
                                <!-- url="./upload.php" -->
                                    <!-- <label for="fileUploaderId" class="file-uploader bg-primary w-full flex justify-content-center">
                                        <i class="pi pi-fw pi-upload ml-2" />
                                    </label>
                                    <input id="fileUploaderId" @change="onUpload($event , 'add')" type="file" hidden > -->
                                    <input id="uploaderId" ref="feature_uploader_ref" @change="onUpload($event , 'add')" type="file" style="display:none;" multiple>
                                    <Button @click="$refs.feature_uploader_ref.click()" class="justify-content-center" for="uploaderId">
                                        <span>آپلود فایل</span>
                                    </Button>
                            </div>
                            <div v-if="picture != null" class="field col-12 md:col-6">
                                <Button :label="picture.name" icon="pi pi-times" class="p-button-outlined"  @click="picture = null" />
                            </div>
                        </div>
                        <div class="field-checkbox mb-0">
                            <Checkbox v-model="feature.isCommon" :binary="true" />
                            <!-- <Checkbox id="checkOption1" binary="true" v-model="feature.isCommon"/> -->
                            <label for="checkOption1" class="mr-2">این ویژگی به طور پیش فرض برای همه استفاده شود؟</label>
                        </div>
                    </form>
                    <template #footer>
                        <Button label="لغو" icon="pi pi-times" class="p-button-text" @click="newFeatureDialog = false" />
                        <Button type="submit" class="p-button-text" label="ایجاد" icon="pi pi-check" @click="createFeature" :loading="loading[create]" />
                    </template>
				</Dialog>
			</div>
		</div>
	</div>
</template>

<script>
export default {
    name:'FeaturePage',
    data(){
        return {
            feature:{
                title:'',
                featureCollectionId:'',
                isCommon:false,
                categoriesIds:[],
                defaultValue:0,
                featureValueType:'',
                forTypes:[],
                icon:'',
            },
            featureValueType:{
                'CheckBox': 0,
                'Text': 1,
                'Number': 2
            },
            featureValueTypes: [
                {value: 'چک باکس', id: 0},
                {value: 'متنی', id: 1},
                {value: 'عددی', id:  2},
            ],
            featureType:[
                {title: 'مکان', id: 0},
                {title: 'سرویس', id: 1},
            ],
            categories:[],
            featureValue:'CheckBox',
            checkedDefaultValueType:false,
            numberDefaultValueType:0,
            textDefaultValueType:'',
            checkedSelectedDefaultValueType:false,
            numberSelectedDefaultValueType:0,
            textSelectedDefaultValueType:'',
            picture:null,
            svgUploaded:'',
            loading:{
                'create':false,
                'update':false,
                'remove':false,
                'active':false,
            },
            newFeatureDialog:false,
            features:[],
            collections:[],
            selected:{},
            featureDialog:false,
            deleteFeatureDialog:false,
            submitted:false,
            editPicture:null,
            pageSize:10,
        }
    },
    watch:{
        'feature.categoriesIds'(val){
            val.length === this.categories.length? this.feature.isCommon = true : this.feature.isCommon = false;
        }
    },
    computed:{
        selectedCategoriesStatus(){
            return this.feature.categoriesIds.length === this.categories.length; 
        }
    },
    methods: {
        //******* Api methods begin *******//
        async getListFeature(page = 1){
            const {status , data} = await this.axios({method:'get',url:`Feature/GetAll?TitleQuery=&PageIndex=${page}&PageSize=${this.pageSize}`})
            this.features = [...data.data];
        },
        async getListCategory(page = 1){
            const {status , data} = await this.axios({method:'get',url:`Category/GetAll?Title=&PageIndex=${page}&PageSize=${this.pageSize}`})
            this.categories = [...data.data]
        },
        async getListCollection(page = 1){
            const {status , data} = await this.axios({method:'get',url:`FeatureCollection/GetAll?TitleQuery=&PageIndex=${page}&PageSize=${this.pageSize}`})
            this.collections = [...data.data]
        },
        async createFeature(){
            this.loading['create'] = true;
            const config = {header: {"Content-Type": "multipart/form-data",}};
            let formData = new FormData();
            formData.append('icon', this.picture);
            formData.append('title', this.feature.title);
            formData.append('isCommon', this.feature.isCommon);
            formData.append('categoriesIds', this.feature.isCommon? null: this.feature.categoriesIds);
            formData.append('featureValueType', this.feature.featureValueType);
            formData.append('featureCollectionId', this.feature.featureCollectionId);
            this.feature.forTypes.forEach(function(item){formData.append('ForTypes', item)})
            formData.append('defaultValue', String(this.defaultValueMethod(this.feature.featureValueType ,this.checkedDefaultValueType, this.textDefaultValueType, this.numberDefaultValueType)));
            const {status , data} = await this.axios({method:'post',url:'Feature/Create',data:formData , config});
            this.showToast(status);
            this.newFeatureDialog = false;
            this.loading['create'] = false;
            this.feature.title = "";
            this.picture = null;
            status == 200 || status == 201?this.getListFeature():false;
        },
        async removeFeature(){
            const {status , data} = await this.axios({method:'delete',url:`Feature/Delete/${this.selected.id}`})
            this.selected = {}
            this.showToast(status)
            this.deleteFeatureDialog = false;
            status == 200 || status == 201?this.getListFeature():false;
        },
        async updateFeature(){
            const config = {header: {"Content-Type": "multipart/form-data",}};
            let formData = new FormData();
            formData.append('NewIcon', !!this.editPicture?this.editPicture:null);
            formData.append('title', this.selected.title);
            formData.append('isCommon', this.selected.isCommon);
            formData.append('categoriesIds', this.selected.isCommon? [null]: this.selected.categoriesIds);
            formData.append('featureValueType', this.selected.featureValueType);
            formData.append('featureCollectionId', this.selected.featureCollectionId);
            this.selected.forTypes.forEach(function(item){formData.append('ForTypes', item)})
            formData.append('defaultValue', String(this.defaultValueMethod(this.selected.featureValueType ,this.checkedSelectedDefaultValueType, this.textSelectedDefaultValueType, this.numberSelectedDefaultValueType)));
            const {status , data} = await this.axios({method:'put',url:`Feature/Update/${this.selected.id}`,data:formData,config});
            this.showToast(status)
            if(status == 200){
                this.selected = {}
                this.editPicture = null;
                this.getListFeature()
            }
            this.hideDialog();
        },
        async changeActiveStatus(selected){
            this.loading['active'] = true;
            let activity = {
                isActive: !selected.isActive
            }
            const {status , data} = await this.axios({method:'patch',url:`Feature/ChangeActiveStatus/${selected.id}`, data:activity});
            this.showToast(status)
            status == 200 || status == 201?this.features.map(feature=>{
                feature.id == selected.id?feature.isActive = !selected.isActive:false;
            }):false;
            this.loading['active'] = false;
        },
        //******* Api methods end *******//
        assignUpdateDefaultVAlueType(selected){
            selected.featureValueType == 0?
            this.checkedSelectedDefaultValueType = Boolean(selected.defaultValue):
            selected.featureValueType == 1?
            this.textSelectedDefaultValueType = selected.defaultValue:
            this.numberSelectedDefaultValueType = selected.defaultValue
        },
        defaultValueMethod(type , checked , text , number){
            return type == 0? checked:type == 1?text:number;
        },
        changePaging(e){
            this.getListFeature(++e.page)
        },
        onUpload(event , status) {
            this.editPicture = null;
            status == 'add'? this.picture = event.target.files[0]:this.editPicture = event.target.files[0];
        },
        editFeature(selected) {
            this.assignUpdateDefaultVAlueType(selected)
			this.selected = {...selected};
            this.selected.featureCollectionId = Number(selected.featureCollection?.id);
            this.selected.categoriesIds = this.selected.categories
			this.featureDialog = true;
		},
        confirmDeleteFeature(selected) {
			this.selected = selected;
			this.deleteFeatureDialog = true;
		},
        hideDialog() {
			this.featureDialog = false;
			this.submitted = false;
		},
    },
    mounted() {
        this.getListFeature()
        this.getListCollection()
        this.getListCategory()
    },
}
</script>

<style lang="scss">
.file-uploader{
        width: auto;
        margin: 0;
        display: inline-flex;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
        align-items: center;
        -align: bottom;
        text-averticallign: center;
        overflow: hidden;
        position: relative;
        background: #4F46E5;
        color: #ffffff;
        border-color: #4F46E5;
        padding: 1rem 1.25rem;
        font-size: 1rem;
        transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
        border-radius: 6px;
        &:focus{
            box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #b1b3f8, 0 1px 2px 0 black;
            outline: 0 none;
            outline-offset: 0;
        }
}
</style>