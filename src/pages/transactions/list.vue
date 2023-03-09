<template>
    <div class="grid p-fluid animate__animated animate__fadeIn">
		<div class="col-12">
            <Toast position="top-right"/>
            <div class="card card-w-title">
                <h5 class="mb-0">تراکنش ها</h5>
                <div class="card grid shadow-2 mt-3 p-0">
                    <div class="field col-12 md:col-3">
                        <InputNumber v-model="ReserveId" @keyup.enter="getListTransactions(pageIndex)" dir="rtl" placeholder="شماره رزرو" mode="decimal" :useGrouping="false"/>
                    </div>
                    <div class="field col-12 md:col-3">
                        <InputNumber v-model="UserId" @keyup.enter="getListTransactions(pageIndex)" dir="rtl" placeholder="آی دی کاربر" mode="decimal" :useGrouping="false"/>
                    </div>
                    <!-- <div class="field col-12 md:col-3">
                        <InputNumber v-model="PlaceId" @keyup.enter="getListTransactions(pageIndex)" dir="rtl" placeholder="آی دی مکان" mode="decimal" :useGrouping="false"/>
                    </div> -->
                     <div v-if="!!places.length" class="col-12 md:col-3">
                        <Dropdown 
                        @change="getListTransactions(pageIndex)"
                        v-model="PlaceId" 
                        :options="places" 
                        optionLabel="name"
                        optionValue="id"
                        placeholder="انتخاب اقامتگاه"/>
                    </div>
                    <div class="col-12 md:col-3">
                        <Dropdown 
                        @change="getListTransactions(pageIndex)"
                        v-model="IsSuccess" 
                        :options="transactionStatus" 
                        optionLabel="type"
                        optionValue="value"
                        placeholder="وضعیت"/>
                    </div>
                    <div class="col-12 md:col-3">
                        <Dropdown 
                        @change="getListTransactions(pageIndex)"
                        v-model="Type" 
                        :options="transactionTypes" 
                        optionLabel="type"
                        optionValue="code"
                        placeholder="نوع تراکنش"/>
                    </div>
                    <div class="field col-12 md:col-3">
                        <span class="p-input-icon-left">
                            <i v-if="!FromDate" style="font-size: 1.5rem" class="pi pi-calendar" />
                            <i v-else @click="FromDate = null;getListTransactions(pageIndex)" style="font-size: 1.5rem" class="pi pi-calendar-times cursor-pointer" />
                            <InputText dir="rtl" v-model="FromDateInput" type="text" id="fromCalendarInputId" placeholder="از تاریخ"/>
                        </span>
                        <custom-date-picker 
                        auto-submit
                        v-model="FromDate"
                        :max="currentDate" 
                        format="YYYY-MM-DD" 
                        @change="getListTransactions(pageIndex)" 
                        display-format="jYYYY/jMM/jDD" 
                        custom-input="#fromCalendarInputId" 
                        />
                    </div>
                    <div class="field col-12 md:col-3">
                        <span class="p-input-icon-left">
                            <i v-if="!ToDate" style="font-size: 1.5rem" class="pi pi-calendar" />
                            <i v-else @click="ToDate = null;getListTransactions(pageIndex)" style="font-size: 1.5rem" class="pi pi-calendar-times cursor-pointer" />
                            <InputText dir="rtl" v-model="ToDateInput" type="text" id="toCalendarInputId" placeholder="تا تاریخ"/>
                        </span>
                        <custom-date-picker 
                        auto-submit
                        v-model="ToDate"
                        :max="currentDate" 
                        format="YYYY-MM-DD" 
                        @change="getListTransactions(pageIndex)" 
                        display-format="jYYYY/jMM/jDD" 
                        custom-input="#toCalendarInputId" 
                        />
                    </div>
                </div>
                <!-- Table Section Begin -->
                <DataTable 
                        v-if="!!transactions.length" 
                        ref="dt" 
                        @page="changePaging($event)" 
                        :value="transactions" 
                        dataKey="id" 
                        paginator 
                        :rows="pageSize" 
                        :totalRecords="totalCount"
                        :pageLinkSize="pageCount"
                        class="mt-5 shadow-5 animate__animated animate__fadeIn" 
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink" 
                        responsiveLayout="scroll">
					<Column field="title" header="از" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">از</span>
							{{slotProps.data.type === 5 ?'بانک':slotProps.data.sourceTitle}}
						</template>
					</Column>
					<Column field="title" header="به" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">به</span>
							{{slotProps.data.destinationTitle}}
						</template>
					</Column>
					<Column field="title" header="مقدار تراکنش (تومان)" headerStyle="width:14%; min-width:10rem; font-size: 12px;">
						<template #body="slotProps">
							<span class="p-column-title">مقدار تراکنش</span>
							{{slotProps.data.amount.toLocaleString('fa-IR')}}
						</template>
					</Column>
					<Column header="وضعیت" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">وضعیت</span>
                            <span :class="[slotProps.data.isSucceed? 'text-green-400':'text-red-400']">
							    {{slotProps.data.isSucceed?'موفق':'نا موفق'}}
                            </span>
						</template>
					</Column>
					<Column header="تاریخ تراکنش" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							{{new Date(slotProps.data.createdAt).toLocaleDateString('fa-IR')}}
						</template>
					</Column>
					<Column header="نوع تراکنش" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title"></span>
							{{transactionTypes.find(item => item.code === slotProps.data.type).type}}
						</template>
					</Column>
					<Column header="کد رهگیری" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title"></span>
							{{!slotProps.data.bankTransaction?'ندارد': slotProps.data.bankTransaction.transactionCode?slotProps.data.bankTransaction.transactionCode:'ندارد'}}
						</template>
					</Column>
				</DataTable>
                <div v-else class="w-full text-center my-3">
                    <InlineMessage>موردی وجود ندارد</InlineMessage>
                </div>
                <!-- Table Section End -->
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'transactions',
    data(){
        return {
            pageIndex: 1,
            pageSize:10,
            totalCount: 1,
            pageCount:1,
            transactionStatus: [
                {type: 'همه', value: null},
                {type: 'موفق', value: true},
                {type: 'ناموفق', value: false},
            ],
            transactions:[
                // {
                //   "id": 0,
                //   "reserveId": 0,
                //   "sourceTitle": "string",
                //   "destinationTitle": "string",
                //   "amount": 0,
                //   "isSucceed": true,
                //   "createdAt": "2022-10-28T18:24:19.204Z",
                //   "type": 0, ==> // {
                //     Reserve = 0, ذخیره => source user destination eghamatgah
                //     Commision = 1, کمیسیون => source eghamatgah destination super admin
                //     CancelCommision = 2, کمیسیون لغو => source super admin destination eghamatgah
                //     CancelReserve = 3, لغو رزرو => source eghamatgah destination user
                //     Withdrawal = 4, برداشت از حساب => 
                //     Deposit = 5 واریز => source bank destination user
                //   }
                //   "bankTransaction": {
                //     "gateway": "string",
                //     "authority": "string",
                //     "errorMessage": "string",
                //     "transactionCode": "string"
                //   }
                // }
            ],
            currentDate: `${new Date(Date.now()).getFullYear()}-${new Date(Date.now()).getMonth()+1}-${new Date(Date.now()).getDate()+1}`,
            transactionTypes:[
                {type:'همه', code:null},
                {type:'ذخیره', code:0},
                {type:'کمیسیون', code:1},
                {type:'کمیسیون لغو', code:2},
                {type:'لغو رزرو', code:3},
                {type:'برداشت از حساب', code:4},
                {type:'واریز', code:5},
            ],
            FromDateInput:'',
            ToDateInput:'',
            IsSuccess: null,
            FromDate: '',
            ToDate: '',
            Type: '',
            ReserveId: null,
            UserId: null,
            PlaceId: null,
            places: [],
            totalItemsCount: [],
        }
    },
    methods: {
        //******* Api methods begin *******//
        async getListTransactions(page = 1){
            let params = {
                'IsSuccess':this.IsSuccess,
                'PageIndex':page,
                'PageSize':this.pageSize,
                'Type':this.Type,
                'FromDate':this.FromDate,
                'ToDate':this.ToDate,
                'ReserveId': this.ReserveId,
                'UserId': this.UserId,
                'PlaceId': this.PlaceId,
            }
            const {status , data} = await this.axios.get(`transaction` , {params: params})
            if(status === 200){
                this.pageSize = Number(data.pageSize);
                this.pageIndex = data.pageIndex;
                this.totalCount = Number(data.totalCount);
                this.pageCount = +data.pageCount;
                this.transactions = [...data.data];
            }
        },
        async getListPlaces(page = 1){
            const {status , data} = await this.axios({method:'get',url:`Place/GetAll?TitleQuery=&PageIndex=${page}&PageSize=${this.pageSize}`})
                this.totalItemsCount = data.pageCount;
                this.places.push({id:null , name:'همه'})
                this.places.push.apply(this.places, data.data)
                // this.places = [...data.data];
                setTimeout(()=>{
                    this.loading['getData'] = false;
                },1000)
        },
        //******* Api methods end *******//
        changePaging(e){
            this.getListTransactions(++e.page)
        },
    },
    mounted(){
        this.getListTransactions();
        this.getListPlaces();
    }
}
</script>