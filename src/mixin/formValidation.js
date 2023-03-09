// import errorhandler from './../services/error-handler'
export default {
    data() {
        return {
            errorsArray: [],
            singleError: '',
            errors: {
                notNull: 'این فیلد نباید خالی باشد',
                invalidFormat: 'فرمت وارد شده صحیح نمی باشد',
                overflowLength: 'تعداد کاراکتر وارد شده بیش از حد مجاز است',
                min8Char: 'رمز عبور شما باید حداقل دارای 8 کاراکتر باشد',
                sepcialChar: 'رمز عبور شما باید حداقل یک کاراکتر ویژه داشته باشد',
                minOneDigit: 'رمز عبور شما باید حداقل یک رقم داشته باشد',
                minOne_capitalAlphabet: 'رمز عبور شما باید حداقل دارای یک حرف بزرگ انگلیسی باشد',
                incompatibility: 'رمز عبور مطابقت ندارد',
                convertYour_keyboard: 'کیبورد خود را فارسی کنید',
                unknown_nationalCode: 'کدملی صحیح نمی باشد',
                mustBe_digit: 'مقدار وارد شده باید فقط عدد باشد',
                copiedMsg: 'متن موردنظر کپی شد',
                setPermission: 'حداقل یک دسترسی را باید انتخاب کنید',
                percentBase: 'مقدار وارد شده باید برحسب درصد باشد(بین 0 تا 100)',
                mustBe_id: 'کد معرف با 6 رقم خاتمه مییابد',
                insert_english_num: 'اعداد را باید انگلیسی وارد کنید',
                notChar: 'این فیلد نباید شامل کاراکترهای ویژه باشد',
                truePointNum: "به جای / از . استفاده کنید",
                notFloat: "مجاز به وارد کردن اعداد اعشاری نمی باشید",
                notZero: "مقدار بیشتر از صفر باید وارد کنید"
            },
            phone_exp: new RegExp(/^(\+98|0098|98|0)?9\d{9}$/g),
            email_exp: new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
            digit_exp: new RegExp(/[0-9]/),
            float_exp: new RegExp(/^[+-]?\d+(\.\d+)?$/),
            persian_digit_exp: new RegExp(/[۰-۹]/),
            uppercase_exp: new RegExp(/[A-Z]/),
            char_exp: new RegExp(/\W|_/g),
            persianName_exp: new RegExp(/^[ آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیئ\s]+$/),
            englishName_exp: new RegExp(/^[ a-zA-Z]+$/),
            alias_exp: new RegExp(/[a-zA-Z0-9آ-ی]/),
            number_exp: new RegExp(/^\d+$/),
            id_exp: new RegExp(/^[a-zA-Z]{3}[0-9]{6}$/),
            username_exp: new RegExp(/^([a-zA-Z0-9]|[-._](?![-._])){4,20}$/),
            campaginName_exp: new RegExp(/^([a-zA-Z0-9آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیئ]|[-._](?![-._])){4,20}$/),
            links_exp: new RegExp(/(https?:\/\/[^ ]*)/),
            shaba_exp: new RegExp(/^(?=.{24}$)[0-9]*$/)
        }
    },
    methods: {
        //================  HANDLE FALSE RESPONSE BEGIN ================//
        // handlefalseRes(error) {
        //     const self = this;
        //     if (error.response && error.response.data) {
        //         let errors = error.response.data;
        //         if (errors.message) {
        //             self.singleError = errors.message;
        //         }
        //         if (errors.errors) {
        //             self.errorsArray = errorhandler.handleErrors(errors.errors);
        //         }
        //         self.showError = true;
        //     }
        // },
        //================  HANDLE FALSE RESPONSE END ================//
        //================ FOCUSED INPUTS BEGIN ================//
        focusedInput(inputsArr) {
            inputsArr.forEach(function(item) {
                item.focus();
            });
        },
        //================ FOCUSED INPUTS END ================//
        //================ BORDER COLOR CONTROLL BEGIN ================//
        switch_border(inputEl, colorFlag) {
            if (colorFlag) {
                inputEl.parentElement.style.setProperty("border", "1px solid #8D939A", "important");
            } else {
                inputEl.parentElement.style.setProperty("border", "1px solid #dc3545", "important");
            }
        },
        //================ BORDER COLOR CONTROLL END ================//
        //================ USERNAME FIELD BEGIN ================//
        campaginName_validation(inputVal, errorMsg) {
            if (inputVal == "") {
                errorMsg.innerText = this.errors.notNull;
            } else if (this.campaginName_exp.test(inputVal)) {
                errorMsg.innerText = "";
            } else {
                errorMsg.innerText = this.errors.invalidFormat;

            }
        },
        //================ USERNAME FIELD END ================//
        //================ EMAIL FIELD BEGIN ================//
        email_validate(inputVal, errorMsg, optional, lang) {
            if (inputVal == "") {
                if (optional) {
                    errorMsg.innerText = "";
                } else {
                    errorMsg.innerText = this.errors[lang].notNull;
                }
            } else if (this.email_exp.test(String(inputVal).toLowerCase())) {
                errorMsg.innerText = "";
            } else {
                errorMsg.innerText = this.errors[lang].invalidFormat;
            }
        },
        //================ EMAIL FIELD END ================//

        //================ PASSWORD FIELD BEGIN ================//
        password_validate(inputVal, errorMsg) {
            if (inputVal == "") {
                errorMsg.innerText = this.errors.notNull;
            } else if (this.persian_digit_exp.test(inputVal)) {
                errorMsg.innerText = this.errors.insert_english_num;
            } else if (inputVal.length < 8) {
                errorMsg.innerText = this.errors.min8Char;
            } else if (inputVal.search(this.digit_exp) < 0) {
                errorMsg.innerText = this.errors.minOneDigit;
            } else {
                errorMsg.innerText = "";
            }
        },
        //================ PASSWORD FIELD END ================//
        //================ CURRENT PASSWORD FIELD BEGIN ================//
        currentPassword_validate(inputVal, errorMsg, lang) {
            if (inputVal.value == "") {
                errorMsg.innerText = this.errors[lang].notNull;
            } else {
                errorMsg.innerText = "";
                this.switch_border(inputVal, true);
            }
        },
        //================ CURRENT PASSWORD FIELD END ================//
        //================ CONFIRM PASSWORD FIELD BEGIN ================//
        confPassword_validate(confPass, pass, errorMsg, lang) {
            //if (confPass && confPass.value && pass && pass.value) {
            if (confPass == "") {
                errorMsg.innerText = this.errors[lang].notNull;
            } else if (confPass != pass) {
                errorMsg.innerText = this.errors[lang].incompatibility;
            } else {
                errorMsg.innerText = "";
            }
            //}
        },
        //================ CONFIRM PASSWORD FIELD END ================//
        //================ USERNAME FIELD BEGIN ================//
        username_validation(inputVal, errorMsg, lang) {
            //if (inputVal && inputVal.value) {
            if (inputVal == "") {
                errorMsg.innerText = this.errors[lang].notNull;
                // 
            } else if (this.username_exp.test(inputVal) || this.phone_exp.test(inputVal) || this.email_exp.test(String(inputVal).toLowerCase())) {
                errorMsg.innerText = "";
                // this.switch_border(inputVal, true);
            } else {
                errorMsg.innerText = this.errors[lang].invalidFormat;
                // 
            }
            //}
        },
        //================ USERNAME FIELD END ================//
        //================ LINKS FIELD BEGIN ================//
        links_validation(inputVal, errorMsg) {
            if (inputVal.value == "") {
                errorMsg.innerText = this.errors['fa'].notNull;
            } else if (!this.links_exp.test(inputVal.value)) {
                errorMsg.innerText = this.errors['fa'].invalidFormat;
            } else {
                errorMsg.innerText = "";
                this.switch_border(inputVal, true);
            }
        },
        //================ LINKS FIELD END ================//
        //================ NAME FIELD BEGIN ================//
        name_validate(inputVal, errorMsg, lang) {
            if (inputVal == "") {
                errorMsg.innerText = this.errors[lang].notNull;
            } else if (this.persianName_exp.test(inputVal) || this.englishName_exp.test(inputVal)) {
                errorMsg.innerText = "";
            } else {
                errorMsg.innerText = this.errors[lang].invalidFormat;
            }
        },
        //================ NAME FIELD END ================//
        //================ SHABA NUMBER FIELD BEGIN ================//
        ibankNumber_validate(inputVal, errorMsg, lang) {
            if (inputVal.value == "") {
                errorMsg.innerText = this.errors[lang].notNull;
                // 
            } else if (this.shaba_exp.test(inputVal.value)) {
                errorMsg.innerText = "";
                // this.switch_border(inputVal, true);
            } else {
                errorMsg.innerText = this.errors[lang].invalidFormat;
                // 
            }
        },
        //================ SHABA NUMBER FIELD END ================//
        //================ NUMBER FIELD BEGIN ================//
        number_validate(inputVal, errorMsg, lang) {
            if (inputVal.value == "") {
                errorMsg.innerText = this.errors[lang].notNull;

            } else if (this.number_exp.test(inputVal.value)) {
                errorMsg.innerText = "";
                this.switch_border(inputVal, true);
            } else {
                errorMsg.innerText = this.errors[lang].invalidFormat;

            }
        },
        //================ NUMBER FIELD END ================//
        //================ PHONE NUMBER FIELD BEGIN ================//
        phoneNumber_validation(inputVal, errorMsg) {
            if (inputVal != "" && this.phone_exp.test(inputVal) && inputVal.length <= 11) {
                errorMsg.innerText = "";
            } else if (inputVal == "") {
                errorMsg.innerText = this.errors.notNull;

            } else if (inputVal.length > 11) {
                errorMsg.innerText = this.errors.overflowLength;

            } else if (this.persian_digit_exp.test(inputVal)) {
                errorMsg.innerText = this.errors.insert_english_num;

            } else if (!this.phone_exp.test(inputVal)) {
                errorMsg.innerText = this.errors.invalidFormat;

            }
        },
        //================ PHONE NUMBER FIELD END ================//
    }
}