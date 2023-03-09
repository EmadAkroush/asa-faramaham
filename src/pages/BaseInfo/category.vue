<template>
    <div class="grid p-fluid animate__animated animate__fadeIn">
		<div class="col-12 md:col-12">
			<div class="card card-w-title">
                <Toolbar class="mb-4">
					<template v-slot:start>
                        <h5 class="mb-0">دسته بندی</h5>
					</template>
					<template v-slot:end>
                        <Button label="جدید" icon="pi pi-plus" class="p-button-success mr-2" @click="newCategoryDialog = true" />
					</template>
				</Toolbar>
                <!-- Table Section Begin -->
                <DataTable v-if="!!categories.length" ref="dt" @page="changePaging($event)" :value="categories" dataKey="id" :paginator="true" :rows="pageSize" class="shadow-5 mt-5" 
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
							<img :src="'http://77.238.108.125/' + slotProps.data.picture" width="25" />
						</template>
					</Column>
					<Column field="description" header="توضیحات"  headerStyle="width:14%; min-width:8rem;">
						<template #body="slotProps">
							<span class="p-column-title">توضیحات</span>
							{{slotProps.data.description}}
						</template>
					</Column>
                    <Column header="عملیات" headerStyle="min-width:10rem;">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" v-tooltip.top="'ویرایش'" class="p-button-rounded p-button-success ml-2" @click="editProduct(slotProps.data)" />
							<Button icon="pi pi-trash" v-tooltip.top="'حذف'" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteProduct(slotProps.data)" />
                            <Button @click="changeActiveStatus(slotProps.data)" type="button" :icon="`pi pi-${slotProps.data.isActive?'check':'times'}`" v-tooltip.top="'وضعیت'" :class="`p-button-rounded p-button-${slotProps.data.isActive?'success':'danger'} mr-2`" ></Button>
						</template>
					</Column>
				</DataTable>
                <div v-else class="w-full text-center my-3">
                    <InlineMessage>موردی وجود ندارد</InlineMessage>
                </div>
                <!-- Table Section End -->
                <!-- Edit Dialog Section Begin -->
                <Dialog v-model:visible="categoryDialog" :style="{width: '450px'}" header="ویرایش" :modal="true" class="p-fluid">
                    <div v-if="product.picture">
                        <img :src="'http://77.238.108.125/' + product.picture" width="50" class="mt-0 mx-auto mb-5 block shadow-2" />
                        <div class="text-center">
                            <Button icon="pi pi-times" class="p-button-rounded p-button-danger p-button-text mb-2" @click="product.picture = null" />
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
						<InputText id="name" v-model.trim="product.title" required="true" autofocus :class="{'p-invalid': submitted && !product.title}" />
						<!-- <small class="p-invalid" v-if="submitted && !product.title">Name is required.</small> -->
					</div>
					<div class="field">
						<label for="description">توضیحات</label>
						<Textarea id="description" v-model="product.description" required="true" rows="3" cols="20" />
					</div>
					<template #footer>
						<Button label="لغو" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="ویرایش" icon="pi pi-check" class="p-button-text" @click="updateCategory" />
					</template>
				</Dialog>
                <!-- Edit Dialog Section Ended -->
                <!-- Delete Dialog Section Begin -->
                <Dialog v-model:visible="deleteCategoryDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="flex flex-column align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle" style="font-size: 4rem" />
						<span v-if="product" class="mt-3">آیا مطمئن هستید؟</span>
					</div>
					<template #footer >
                        <div class="text-center">
                            <Button label="خیر" icon="pi pi-times" class="p-button-text" @click="deleteCategoryDialog = false"/>
                            <Button label="بلی" icon="pi pi-check" class="p-button-text" @click="removeCategory" />
                        </div>
					</template>
				</Dialog>
                <!-- Delete Dialog Section Ended -->
                <Dialog v-model:visible="newCategoryDialog" :style="{width: '600px'}" header="ایجاد دسته بندی" :modal="true" class="p-fluid">
                   <div class="field">
                        <span >
                            <label for="catTitle">عنوان:</label>
                            <InputText id="catTitle" type="text" v-model="category.title"/>
                        </span>
                   </div>
                   <div class="field">
                        <span>
                              <label for="catDescription">توضیحات:</label>
                              <Textarea v-model="category.description" id="catDescription" :autoResize="true" rows="5" cols="30" />
                        </span>
                   </div>
                   <div class="formgrid grid col-12">
                        <div class="field col-12 md:col-6">
                            <label for="fileUploaderId" class="file-uploader bg-primary w-full justify-content-center">
                                <i class="pi pi-fw pi-upload ml-2" />
                                <span>آپلود فایل</span>
                            </label>
                            <input id="fileUploaderId" @change="onUpload($event , 'add')" accept="image/png, image/jpeg" type="file" hidden >
                        </div>
                        <div v-if="picture != null" class="field col-12 md:col-6">
                            <Button :label="picture.name" icon="pi pi-times" class="p-button-outlined"  @click="picture = null" />
                        </div>
                    <!-- <input id="uploaderId" ref="feature_uploader_ref" @change="onUpload($event , 'add')" type="file" style="display:none;" multiple>
                        <Button @click="$refs.feature_uploader_ref.click()" class="justify-content-center" for="uploaderId">
                            <span>آپلود فایل</span>
                        </Button> -->
                   </div>
                    <template #footer>
                        <Button label="لغو" icon="pi pi-times" class="p-button-text" @click="newCategoryDialog = false" />
                        <Button type="submit" class="p-button-text" label="ایجاد" icon="pi pi-check" @click="createCategory" :loading="loading[create]" />
                    </template>
                </Dialog>
			</div>
		</div>
	</div>
</template>

<script>
export default {
    name:'categoryPage',
    data(){
        return {
            category:{
                title:'',
                description:'',
            },
            picture:null,
            svgUploaded:'',
            loading:{
                create:false,
                update:false,
                remove:false,
            },
            categories:[],
            product:{},
            categoryDialog:false,
            deleteCategoryDialog:false,
            submitted:false,
            editPicture:null,
            pageSize:10,
            newCategoryDialog:false,
        }
    },
    methods: {
        //******* Api methods begin *******//
        async getListCategory(page = 1){
            const {status , data} = await this.axios({method:'get',url:`Category/GetAll?Title=&PageIndex=${page}&PageSize=${this.pageSize}`})
            this.pageSize = data.pageSize;
            this.categories = [...data.data];
        },
        async createCategory(){
            const config = {header: {"Content-Type": "multipart/form-data",}};
            let formData = new FormData();
            formData.append('picture', this.picture);
            formData.append('title', this.category.title);
            formData.append('description', this.category.description);
            const {status , data} = await this.axios({method:'post',url:'Category/Create',data:formData , config})
            status == 200 && this.getListCategory()
            this.category.title , this.category.description = "";
            this.showToast(status)
            this.newCategoryDialog= false
            this.picture = null;
        },
        async removeCategory(){
            const {status , data} = await this.axios({method:'delete',url:`Category/Delete/${this.product.id}`})
            (status === 200) && (this.product = {});
            this.getListCategory()
            this.deleteCategoryDialog = false;
            this.showToast(status)
        },
        async updateCategory(){
            const config = {header: {"Content-Type": "multipart/form-data",}};
            let formData = new FormData();
            console.log(!!this.editPicture , this.editPicture);
            debugger
            formData.append('picture', !!this.editPicture?this.editPicture:null);
            formData.append('title', this.product.title);
            formData.append('description', this.product.description);
            const {status , data} = await this.axios({method:'put',url:`Category/Update/${this.product.id}`,data:formData,config});
            if(status == 200){
                this.product={};
                this.editPicture = null;
                this.getListCategory()
            }
            this.hideDialog()
            this.showToast(status)
        },
        //TODO: Add api and complete this section
        async changeActiveStatus(selected){
            const {status , data} = await this.axios({method:'patch',url:`Category/ChangeActiveStatus/${selected.id}`});
            this.showToast(status);
            (status == 200 || status == 201) && this.categories.map(_category=>{
                _category.id == selected.id?_category.isActive = !selected.isActive:false;
            });
        },
        //******* Api methods end *******//
        changePaging(e){
            this.getListCategory(++e.page)
        },
        onUpload(event , status) {
            this.editPicture = null;
            status == 'add'? this.picture = event.target.files[0]:this.editPicture = event.target.files[0];
            // const file = new FormData();
            // this.$toast.add({severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000});
        },
        editProduct(product) {
			this.product = {...product};
			this.categoryDialog = true;
		},
        confirmDeleteProduct(product) {
			this.product = product;
			this.deleteCategoryDialog = true;
		},
        hideDialog() {
			this.categoryDialog = false;
			this.submitted = false;
		},
    },
    created() {
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