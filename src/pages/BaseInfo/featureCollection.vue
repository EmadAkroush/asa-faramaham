<template>
    <div class="grid p-fluid animate__animated animate__fadeIn">
		<div class="col-12 md:col-12">
			<div class="card card-w-title">
                <Toolbar class="mb-4">
					<template v-slot:start>
                        <h5 class="mb-0">مجموعه ویژگی</h5>
					</template>
					<template v-slot:end>
                        <Button label="جدید" icon="pi pi-plus" class="p-button-success mr-2" @click="newProductDialog = true" />
					</template>
				</Toolbar>
                <!-- Table Section Begin -->
                <DataTable v-if="!!collections.length" ref="dt" @page="changePaging($event)" :value="collections" dataKey="id" :paginator="true" :rows="pageSize" class="mt-5 shadow-5 animate__animated animate__fadeIn" 
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
							<img :src="'http://77.238.108.125/' + slotProps.data.icon" class="shadow-2" width="50" />
						</template>
					</Column>
                    <Column header="عملیات" headerStyle="min-width:10rem;">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" v-tooltip.top="'ویرایش'" class="p-button-rounded p-button-success ml-2" @click="editCollection(slotProps.data)" />
							<Button icon="pi pi-trash" v-tooltip.top="'حذف'" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteCollection(slotProps.data)" />
						</template>
					</Column>
				</DataTable>
                <div v-else class="w-full text-center my-3">
                    <InlineMessage>موردی وجود ندارد</InlineMessage>
                </div>
                <!-- Table Section End -->
                <!-- Edit Dialog Section Begin -->
                <Dialog v-model:visible="featureDialog" :style="{width: '450px'}" header="ویرایش" :modal="true" class="p-fluid">
                    <div v-if="selected.icon">
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
					<template #footer>
						<Button label="لغو" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="ویرایش" icon="pi pi-check" class="p-button-text" @click="updateCollection" />
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
                            <Button label="بلی" icon="pi pi-check" class="p-button-text" @click="removeCollection" />
                        </div>
					</template>
				</Dialog>
                <!-- Delete Dialog Section Ended -->
                <Dialog v-model:visible="newProductDialog" :style="{width: '600px'}" header="ایجاد مجموعه ویژگی" :modal="true" class="p-fluid">
                   <div class="field">
                        <span>
                              <label for="catTitle">عنوان:</label>
                              <InputText id="catTitle" type="text" v-model="collection.title"/>
                        </span>
                   </div>
                   <div class="formgrid grid col-12">
                    <div class="formgrid grid col-12">
                            <div class="field col-12 md:col-6">
                        <input id="uploaderId" ref="feature_collection_uploader" @change="onUpload($event , 'add')" type="file" style="display:none;" multiple>
                        <Button @click="$refs.feature_collection_uploader.click()" class="justify-content-center" for="uploaderId">
                            <span>آپلود فایل</span>
                        </Button>
                    </div>
                        <div v-if="picture != null" class="field col-12 md:col-6">
                            <Button :label="picture.name" icon="pi pi-times" class="p-button-outlined"  @click="picture = null" />
                        </div>
                    </div>
                   </div>
                    <template #footer>
                        <Button label="لغو" icon="pi pi-times" class="p-button-text" @click="newProductDialog = false" />
                        <Button type="submit" class="p-button-text" label="ایجاد" icon="pi pi-check" @click="createFeatureCollection" :loading="loading[create]" />
                    </template>
                </Dialog>
			</div>
		</div>
	</div>
</template>

<script>
export default {
    name:'featureCollectionPage',
    data(){
        return {
            collection:{
                title:'',
            },
            picture:null,
            svgUploaded:'',
            loading:{
                create:false,
                update:false,
                remove:false,
            },
            collections:[],
            selected:{},
            featureDialog:false,
            deleteFeatureDialog:false,
            submitted:false,
            editPicture:null,
            pageSize:10,
            newProductDialog:false,
        }
    },
    methods: {
        //******* Api methods begin *******//
        async getListCollection(page = 1){
            const {status , data} = await this.axios({method:'get',url:`FeatureCollection/GetAll?TitleQuery=&PageIndex=${page}&PageSize=${this.pageSize}`})
            this.pageSize = data.pageSize;
            this.collections = [...data.data];
        },
        async createFeatureCollection(){
            const config = {header: {"Content-Type": "multipart/form-data",}};
            let formData = new FormData();
            formData.append('icon', this.picture);
            formData.append('title', this.collection.title);
            const {status , data} = await this.axios({method:'post',url:'FeatureCollection/Create',data:formData , config})
            status == 200 || status == 201?this.getListCollection():false;
            this.showToast(status);
            this.newProductDialog = false;
            this.collection.title = "";
            this.picture = null;
        },
        async removeCollection(){
            const {status , data} = await this.axios({method:'delete',url:`FeatureCollection/Delete/${this.selected.id}`})
            status === 200? this.selected = {}: '';
            this.getListCollection()
            this.deleteFeatureDialog = false;
        },
        async updateCollection(){
            const config = {header: {"Content-Type": "multipart/form-data",}};
            let formData = new FormData();
            formData.append('NewIcon', !!this.editPicture?this.editPicture:null);
            formData.append('title', this.selected.title);
            const {status , data} = await this.axios({method:'put',url:`FeatureCollection/Update/${this.selected.id}`,data:formData,config});
            this.showToast(status);
            if(status == 200){
                this.getListCollection()
                this.selected = {}
                this.editPicture = null;
            }
            this.hideDialog();
        },
        changePaging(e){
            this.getListCollection(++e.page)
        },
        //******* Api methods end *******//
        onUpload(event , status) {
            this.editPicture = null;
            this.picture = null;
            status == 'add'? this.picture = event.target.files[0]:this.editPicture = event.target.files[0];
            // const file = new FormData();
            // this.$toast.add({severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000});
        },
        editCollection(selected) {
			this.selected = {...selected};
			this.featureDialog = true;
		},
        confirmDeleteCollection(selected) {
			this.selected = selected;
			this.deleteFeatureDialog = true;
		},
        hideDialog() {
			this.featureDialog = false;
			this.submitted = false;
		},
    },
    mounted() {
        this.getListCollection()
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