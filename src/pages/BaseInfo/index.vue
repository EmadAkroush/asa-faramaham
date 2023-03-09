<template>
	<div class="grid p-fluid">
		<div class="col-12 md:col-12">
			<div class="card card-w-title">
				<h5>مشخصات و ویژگی ها</h5>
				<TabMenu :model="nestedRouteItems">
					<template #item="{item}">
						<a :href="item.to">{{item.label}}</a>
					</template>
				</TabMenu>
				<router-view/>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				nestedRouteItems: [
					{
						label: 'دسته بندی ها',
						to: '/features'
					},
					{
						label: 'ویژگی',
						to: `${this.$route.path}/features`
					},
					{
						label: 'مجموعه ویژگی ها',
						to: '/menu/payment'
					},
					{
						label: 'تگ',
						to: '/menu/confirmation'
					}
				],  
			}
		},
		methods: {
			// toggleMenu(event) {
			// 	this.$refs.menu.toggle(event);
			// },
			// onContextRightClick(event) {
			// 	this.$refs.contextMenu.show(event);
			// }
		}
	}
</script>