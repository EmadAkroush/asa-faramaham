<template>
  <div>
    <h5 class="my-3">حداقل 5 عکس از هتل آپلود کنید:</h5>
    <p class="my-5">این عکس ها باید واقعی و با کیفیت خوبی باشند. میتوانید به عنوان مثال از نمای بیرونی، چشم انداز، لابی و... برای این عکس ها استفاده کنید.</p>
    <h5 v-if="!!createdPictures.length">عکس های افزوده شده:</h5>
    <div v-if="!!createdPictures.length" class="grid p-fluid gap-3 mb-3">
        <div v-for="(pic , index) in createdPictures" :key="index" class="col-12 md:col-2">
            <div class="card show-image h-full p-2">
                <Image v-lazy :src="'http://77.238.108.125/' + pic.picturePath" alt="Image" class="h-full prev-image" preview />
                <Button v-if="createdPictures.length > 5" icon="pi pi-trash" @click="showDeleteDialog(pic)" class="p-button-rounded p-button-danger trash-image-button" />
            </div>
        </div>
    </div>
    <h5 class="mb-4">افزودن عکس:</h5>
    <div class="grid p-fluid gap-3">
        <div v-for="(file , index) in files" :key="index" class="col-12 md:col-2 ">
            <div class="card show-image h-full p-2">
                <Image v-lazy :src="!!file.src?file.src:file.picturePath" alt="Image" class="h-full prev-image" preview />
                <Button icon="pi pi-trash" @click="removeNewPicture(file)" class="p-button-rounded p-button-danger trash-image-button" />
            </div>
        </div>
        <!-- With button click event can refer to input element   -->
        <div class="col-12 md:col-2 card">
            <input id="uploaderId" ref="uploader_ref" @change="getFiles($event)" type="file" style="display:none;" multiple>
            <button @click="$refs.uploader_ref.click()" class="flex flex-column image-uploader justify-content-center align-items-center py-4" for="uploaderId">
                <svg width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M29 48.3334V29.0001M29 29.0001V9.66675M29 29.0001H48.3334M29 29.0001H9.66669" stroke="#111111" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <h5>افزودن عکس</h5>
            </button>
        </div>
            <div class="field col-12 flex flex-row justify-content-end mt-3">
        <span class="p-float-label w-1">
            <Button type="button" class="mr-2 mb-2" label="ایجاد" icon="pi pi-check" :loading="loading['create']" @click="createImages(placeId)"/>
        </span>
    </div>
    </div>
        <!-- Delete Dialog Section Begin -->
    <Dialog v-model:visible="dialog['delete']" :style="{width: '450px'}" header="تایید" :modal="true">
        <div class="flex flex-column align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle" style="font-size: 4rem" />
            <span v-if="selected" class="mt-3">آیا مطمئن هستید؟</span>
        </div>
        <template #footer >
            <div class="text-center">
                <Button label="خیر" icon="pi pi-times" class="p-button-text" @click="dialog['delete'] = false"/>
                <Button label="بلی" icon="pi pi-check" class="p-button-text" @click="removeImage" />
            </div>
        </template>
    </Dialog>
    <!-- Delete Dialog Section Ended -->
  </div>
</template>

<script>
export default {
    name: "placeImages",
    props:{
        placeId:{
            type: String,
            default: null,
        },
        pictures:{
            type: Array,
            default: () => ([])
        },
    },
    data(){
        return{
            files:[],
            place_id:null,
            loading:{
                create:false
            },
            dialog:{
                delete:false
            },
            createdPictures:[],
            selected:null,
        }
    },
    watch:{
        '$props.placeId': {
            handler: function(val){
                this.place_id = val
                // this.getPictures(newVal)
            },
            immediate: true,
            deep: true,
        },
        '$props.pictures': {
            handler: function(val){
                this.createdPictures = [...val];
            },
            immediate: true,
            deep: true,
        }
    },
    methods:{
        //******* Api methods end *******//
        async createImages(id){
            const config = {header: {"Content-Type": "multipart/form-data",}};
            this.loading['create'] = true;
            const formData = new FormData();
            this.files.forEach(function(item){
                typeof item == 'object' ? formData.append('Pictures' , item) :false;
            });
            const {status , data} = await this.axios.post(`Place/${id}/pictures`, formData,config)
            status == 200 && (this.files = [])
            this.$emit('create-images',status)
            this.loading['create'] = false;
        },
        async removeImage(){
            const {status , data} = await this.axios.delete(`Place/${this.place_id}/pictures/${this.selected.id}`)
            status == 200 && (this.$emit('remove-image',status,this.place_id))
            this.showToast(status)
            this.dialog['delete'] = false;
        },
        //******* Api methods end *******//
        getFiles(event){
            // const objectURL = URL.createObjectURL(blob);
            let target = event.target
            let lastIndex = target.files.length - 1 
            target.files[lastIndex]['src'] = URL.createObjectURL(target.files[lastIndex])
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                target.files[lastIndex].binary = reader.result
            });
            reader.readAsBinaryString(target.files[lastIndex]);
            this.files.push(target.files[lastIndex])
        },
        showDeleteDialog(pic){
            this.dialog['delete'] = true;
            this.selected = {...pic}
        },
        removeNewPicture(item){
            this.files = [...this.files.filter(p=> p.name != item.name)]
        }
    }
}
</script>

<style lang="scss">
.image-uploader{
    width: 100%;
    height: 100%;
    cursor: pointer;
    border: none;
    background: transparent;
}
.prev-image{
    img{
        width: 100%;
        height: 100%;
        max-height: 14rem;
        min-width: -webkit-fill-available;
        object-fit: cover;
        border-radius: 12px;
    }
}
.show-image{
    position: relative;
    .trash-image-button{
        position: absolute;
        top: 0;
        left: 0;
        z-index: 5;
        opacity: 0;
        transition: opacity .25s ease-in-out;
    }
    &:hover{
        .trash-image-button{
            opacity: 1 !important;
        }
    }
}
</style>