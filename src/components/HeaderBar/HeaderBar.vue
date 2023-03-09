<template>
    <Toolbar class="mb-4">
        <template v-slot:start>
            <h5 class="mb-0">{{title}}</h5>
        </template>
        <template v-slot:end>
            <Button v-if="createButton" label="جدید" icon="pi pi-plus" class="p-button-success mr-2" @click="newStatus" />
            <Button v-if="removeButton" label="حذف" icon="pi pi-plus" class="p-button-success mr-2" @click="editStatus" />
            <Button v-if="editButton" label="ویرایش" icon="pi pi-plus" class="p-button-success mr-2" @click="removeStatus" />
        </template>
    </Toolbar>
</template>

<script>
export default {
    name: 'headerBar',
    emits:['new-event','edit-event','remove-event'],
    data(){},
    props:{
        title:{
            type:String,
            default: ''
        },
        createButton:{
            type:Boolean,
            default: false
        },
        removeButton:{
            type:Boolean,
            default: false
        },
        editButton:{
            type:Boolean,
            default: false
        },
    },
    methods: {
        newStatus(){
            this.$emit('new-event' , true)
        },
        editStatus(){
            this.$emit('edit-event' , true)
        },
        removeStatus(){
            this.$emit('remove-event' , true)
        },
    },
}
</script>

<style>

</style>