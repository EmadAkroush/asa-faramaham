<template>
    <div class="grid p-fluid animate__animated animate__fadeIn">
		<div class="col-12 md:col-12">
			<div class="card card-w-title">
                <Toolbar class="mb-4">
					<template v-slot:start>
                        <h5 class="mb-0">تگ</h5>
					</template>
					<template v-slot:end>
                        <Button label="جدید" icon="pi pi-plus" class="p-button-success mr-2" @click="dialog['create'] = true" />
					</template>
				</Toolbar>
                <!-- Table Section Begin -->
                <DataTable v-if="!!collections.length" ref="dt" :value="collections" dataKey="id" :paginator="true" :rows="10" class="mt-5 animate__animated animate__fadeIn" 
                     paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink  RowsPerPageDropdown" responsiveLayout="scroll">
					<Column field="title" header="عنوان" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">عنوان</span>
							{{slotProps.data.title}}
						</template>
					</Column>
					<Column header="آیکون" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">تصویر</span>
							<img :src="'http://77.238.108.125/' + slotProps.data.icon" width="30" />
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
                <Dialog v-model:visible="dialog['edit']" :style="{width: '450px'}" header="ویرایش" :modal="true" class="p-fluid">
                    <!-- Picture edit section begin -->
                    <div v-if="selected.picture">
                        <img :src="'http://77.238.108.125/' + selected.picture" width="150" class="mt-0 mx-auto mb-5 block" />
                        <div class="text-center">
                            <Button icon="pi pi-times" class="p-button-rounded p-button-danger p-button-text mb-2" @click="selected.picture = null" />
                        </div>
                    </div>
                    <div v-else class="formgrid grid col-12">
                        <div class="field col-12 md:col-6">
                            <input id="uploaderEditTagId" ref="editTag_picture_uploader" @change="onUpload($event , 'edit' , 'picture')" type="file" style="display:none;" multiple>
                            <Button @click="$refs.editTag_picture_uploader.click()" class="justify-content-center" for="uploaderEditTagId">
                                <span>آپلود تصویر</span>
                            </Button>
                        </div>
                        <div v-if="editPicture != null" class="field col-12 md:col-6">
                            <Button :label="editPicture.name" icon="pi pi-times" class="p-button-outlined"  @click="editPicture = null" /> 
                        </div>
                    </div>
                    <!-- Picture edit section end -->
                    <!-- Icon edit section begin -->
                    <div v-if="selected.icon">
                        <div class="grid p-fluid">
                            <div class="col-6 flex align-items-center justify-content-end">
                                <span>آیکون:</span>
                            </div>
                            <div class="col-6">
                                <div class="flex flex-row justify-content-start text-center align-items-center">
                                    <Button icon="pi pi-times" class="p-button-rounded p-button-danger p-button-text" @click="selected.icon = null"/>
                                    <img :src="'http://77.238.108.125/' + selected.icon" :alt="selected.icon" width="30" class="mt-0 " />
                                </div>  
                            </div>
                        </div>
                    </div>
                    <div v-else class="formgrid grid col-12">
                        <div class="field col-12 md:col-6">
                            <input id="uploaderEditIconId" ref="editTag_icon_uploader" @change="onUpload($event , 'edit' , 'icon')" type="file" style="display:none;" multiple>
                            <Button @click="$refs.editTag_icon_uploader.click()" class="justify-content-center" for="uploaderEditIconId">
                                <span>آپلود آیکون</span>
                            </Button>
                        </div>
                        <div v-if="editIcon != null" class="field col-12 md:col-6">
                            <Button :label="editIcon.name" icon="pi pi-times" class="p-button-outlined"  @click="editIcon = null" /> 
                        </div>
                    </div>
                    <!-- Icon edit section end -->
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
                <!-- Create Dialog Section Begin -->
                <Dialog v-model:visible="dialog['create']" :style="{width: '600px'}" header="ایجاد تگ" :modal="true" class="p-fluid">
                   <div class="field mt-4">
                        <span class="p-float-label">
                            <InputText id="catTitle" type="text" v-model="collection.title"/>
                            <label for="catTitle">عنوان</label>
                        </span>
                   </div>
                   <div class="formgrid grid col-12">
                        <div class="field col-12 md:col-6">
                            <input id="uploaderId" ref="tag_picture_uploader" @change="onUpload($event , 'add' , 'picture')" type="file" style="display:none;" multiple>
                            <Button @click="$refs.tag_picture_uploader.click()" class="justify-content-center" for="uploaderId">
                                <span>آپلود تصویر</span>
                            </Button>
                        </div>
                        <div v-if="picture != null" class="field col-12 md:col-6">
                            <Button :label="picture.name" icon="pi pi-times" class="p-button-outlined"  @click="picture = null" /> 
                        </div>
                   </div>
                   <div class="formgrid grid col-12">
                        <div class="field col-12 md:col-6">
                            <input id="uploaderId" ref="tag_icon_uploader" @change="onUpload($event , 'add' , 'icon')" type="file" style="display:none;" multiple>
                            <Button @click="$refs.tag_icon_uploader.click()" class="justify-content-center" for="uploaderId">
                                <span>آپلود آیکون</span>
                            </Button>
                        </div>
                        <div v-if="icon != null" class="field col-12 md:col-6">
                            <Button :label="icon.name" icon="pi pi-times" class="p-button-outlined"  @click="icon = null" /> 
                        </div>
                   </div>
                    <template #footer>
                        <Button label="لغو" icon="pi pi-times" class="p-button-text" @click="dialog['create'] = false" />
                        <Button type="submit" class="p-button-text" label="ایجاد" icon="pi pi-check" @click="createTag" :loading="loading[create]" />
                    </template>
                </Dialog>
                <!-- Create Dialog Section Ended -->
                <!-- Delete Dialog Section Begin -->
                <Dialog v-model:visible="dialog['delete']" :style="{width: '450px'}" header="تایید" :modal="true">
					<div class="flex flex-column align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle" style="font-size: 4rem" />
						<span v-if="selected" class="mt-3">آیا مطمئن هستید؟</span>
					</div>
					<template #footer >
                        <div class="text-center">
                            <Button label="خیر" icon="pi pi-times" class="p-button-text" @click="dialog['delete'] = false"/>
                            <Button label="بلی" icon="pi pi-check" class="p-button-text" @click="removeCollection" />
                        </div>
					</template>
				</Dialog>
                <!-- Delete Dialog Section Ended -->
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
            svgUploaded:'',
            loading:{
                create:false,
                update:false,
                remove:false,
            },
            collections:[],
            selected:{},
            dialog:{
                edit:false,
                delete:false,
                create:false,
            },
            submitted:false,
            pageSize:10,
            picture:null,
            editPicture:null,
            icon:null,
            editIcon:null,
        }
    },
    methods: {
        //******* Api methods begin *******//
        async getTagsList(page = 1){
            const {status , data} = await this.axios({method:'get',url:`Tag/GetAll?TitleQuery=&PageIndex=${page}&PageSize=${this.pageSize}`})
            this.pageSize = data.pageSize;
            this.collections = [...data.data];
        },
        async createTag(){
            const config = {header: {"Content-Type": "multipart/form-data"}};
            let formData = new FormData();
            formData.append('picture', this.picture);
            formData.append('icon', this.icon);
            formData.append('title', this.collection.title);
            const {status , data} = await this.axios({method:'post',url:'Tag/Create',data:formData , config})
            status == 200 || status == 201?(this.getTagsList()):false
            this.showToast(status);
            this.dialog['create'] = false;
            this.collection.title = "";
            this.picture = this.icon = null;
        },
        async removeCollection(){
            const {status , data} = await this.axios({method:'delete',url:`Tag/Delete/${this.selected.id}`})
            status === 200? this.selected = {}: '';
            this.showToast(status);
            this.getTagsList();
            this.dialog['delete'] = false;
        },
        async updateCollection(){
            const config = {header: {"Content-Type": "multipart/form-data",}};
            let formData = new FormData();
            formData.append('NewPicture', this.editPicture !== null?this.editPicture:null);
            formData.append('NewIcon', this.editIcon !== null?this.editIcon:null);
            formData.append('title', this.selected.title);
            const {status , data} = await this.axios({method:'put',url:`Tag/Update/${this.selected.id}`,data:formData,config})
            if(status == 200){
                this.selected={};
                this.editPicture=null;
                this.editIcon=null;
                this.hideDialog()
            }
            this.getTagsList()
            this.showToast(status);
        },
        changePaging(e){
            this.getTagsList(++e.page)
        },
        //******* Api methods end *******//
        onUpload(event , status , type) {
            let target = event.target;
            this.editPicture=null;
            this.editIcon=null;
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                target.files[0]['binary'] = reader.result;
            });
            reader.readAsBinaryString(target.files[0]);
            status=='add' && type=='picture'? this.picture = target.files[0]:status=='edit' && type=='picture'?this.editPicture = target.files[0]:false;
            status=='add' && type=='icon'? this.icon = target.files[0]:status=='edit' && type=='icon'?this.editIcon = target.files[0]:false;
        },
        editCollection(selected) {
			this.selected = {...selected};
			this.dialog['edit'] = true;
		},
        confirmDeleteCollection(selected) {
			this.selected = selected;
			this.dialog['delete'] = true;
		},
        hideDialog() {
			this.dialog['edit'] = false;
			this.submitted = false;
		},
    },
    mounted() {
        this.getTagsList()
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