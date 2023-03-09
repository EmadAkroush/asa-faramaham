const handler = {
    data(){
        return {
            errorTranslator:{
                "NoAccess": 'دسترسی ندارید',
                "Error converting value {null} to type 'System.Int64'. Path 'price', line 1, position 92.":'مقدار قیمت وارد شده خالی است',
                "Error converting value {null} to type 'System.Int32'. Path 'quantity', line 1, position 27.":'مقدار ظرفیت خالی است ',
                "Error converting value {null} to type 'System.Int32'. Path 'standardCapacity', line 1, position 79.":'مقدار ظرفیت استاندارد خایل است',
                "Error converting value {null} to type 'System.Byte'. Path 'prepaymentPercentage', line 1, position 55.":'مقدار درصد پیش پرداخت خالی است',
                "service_floor_has_bigger_than_place_floor":'تعداد طبقات نمی تواند از تعداد طبقات مکان بیشتر باشد',
                "pictures_must_be_more_5":'تعداد عکس های وارد شده باید بیشتر از 5 باشد',
                "title_must_unique":'عنوان باید یکتا باشد',
            },
            messages:[]
        }
    },
    methods: {
        showToast(status , errors = []){
            if(status === 200 || status === 201){
                this.$toast.add({severity: 'success', summary: 'تایید' , detail: 'عملیات با موفقیت انجام شد', life: 3000})
            }else{
                this.$toast.add({severity: 'error', summary: 'خطا', detail: !!errors.length?'عملیات با خطا مواجه شد':this.errorHanler(errors), life: 3000})
            }
        },
        errorHanler(errors){
            //TODO: complete error handler message properties
            const errorMessages = []
            for (const property in errors) {
                if(!!errors[property].length){
                    errors[property].forEach((item)=>{
                        this.errorTranslator.hasOwnProperty(item)?errorMessages.push(this.errorTranslator[item]): false;
                    })
                }
            }
            // errorMessages.map(er => {
            //     let message = this.errorTranslator.hasOwnProperty(er) && (er = this.errorTranslator[er])
            //     return er = this.errorTranslator[er]
            // })
            return errorMessages
        }
    },
};

export default handler;