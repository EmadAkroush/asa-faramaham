import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';

import createEditPlace from './pages/place/create.vue'

const routes = [{
        path: '/',
        name: 'app',
        component: App,
        children: [{
                path: '',
                name: 'dashboard',
                component: () =>
                    import ('./components/Dashboard.vue')
            },
            // ************* Basic Info routes Begin ************ //
            {
                path: '/category',
                name: 'category',
                component: () =>
                    import ('./pages/BaseInfo/category.vue')
            },
            {
                path: '/feature',
                name: 'feature',
                component: () =>
                    import ('./pages/BaseInfo/feature.vue')
            },
            {
                path: '/feature-collection',
                name: 'featureCollection',
                component: () =>
                    import ('./pages/BaseInfo/featureCollection.vue')
            },
            {
                path: '/tag',
                name: 'tag',
                component: () =>
                    import ('./pages/BaseInfo/tag.vue')
            },
            // ************* Basic Info routes End ************ //
            {
                path: '/user/manage',
                name: 'userManagement',
                component: () =>
                    import ('./pages/user/management.vue')
            },
            // ************ Place Routes Begin  ******************* //
            {
                path: '/place/list',
                name: 'placeList',
                component: () =>
                    import ('./pages/place/list.vue')
            },
            {
                path: '/place/create',
                name: 'placeCreate',
                component: createEditPlace,
            },
            {
                path: 'place/edit/:place_id?',
                name: 'placeEdit',
                component: createEditPlace,
            },
            {
                path: '/place/users/:place_id',
                name: 'placeManageUsers',
                component: () =>
                    import ('./pages/place/users/index.vue')
            },
            // ************ Place Routes End ******************* //
            // ************ Service Routes End ******************* //
            {
                path: 'place/:place_id/services/',
                name: 'serviceList',
                component: () =>
                    import ('./pages/service/list.vue')
            },
            {
                path: 'place/:place_id/:type/service/',
                name: 'createService',
                component: () =>
                    import ('./pages/service/index.vue'),
                    children: [
                    {
                        path: ':service_id?/details',
                        name:'serviceDetails',
                        component: () =>
                            import ('./pages/service/sections/details.vue')
                    },
                    {
                        path: ':service_id?/features',
                        component: () =>
                            import ('./pages/service/sections/features.vue')
                    },
                    {
                        path: ':service_id?/exceptions',
                        component: () =>
                            import ('./pages/service/sections/exceptions.vue')
                    },
                ],
            },
            {
                path: '/transactions',
                name: 'transactions',
                component: () =>
                    import ('./pages/transactions/list.vue')
            },
            // {
            //     path: 'place/:place_id/service/edit/:service_id',
            //     name: 'serviceEdit',
            //     component: () =>
            //         import ('./pages/service/index.vue'),
            // },
            // {
            //     path: '/service/create',
            //     name: 'serviceCreate',
            //     component: () =>
            //         import ('./pages/service/index.vue')
            // },

            // ************ Service Routes End ******************* //
            {
                path: '/formlayout',
                name: 'formlayout',
                component: () =>
                    import ('./components/FormLayoutDemo.vue')
            },
            {
                path: '/input',
                name: 'input',
                component: () =>
                    import ('./components/InputDemo.vue')
            },
            {
                path: '/floatlabel',
                name: 'floatlabel',
                component: () =>
                    import ('./components/FloatLabelDemo.vue')
            },
            {
                path: '/invalidstate',
                name: 'invalidstate',
                component: () =>
                    import ('./components/InvalidStateDemo.vue')
            },
            {
                path: '/button',
                name: 'button',
                component: () =>
                    import ('./components/ButtonDemo.vue')
            },
            {
                path: '/table',
                name: 'table',
                component: () =>
                    import ('./components/TableDemo.vue')
            },
            {
                path: '/list',
                name: 'list',
                component: () =>
                    import ('./components/ListDemo.vue')
            },
            {
                path: '/tree',
                name: 'tree',
                component: () =>
                    import ('./components/TreeDemo.vue')
            },
            {
                path: '/panel',
                name: 'panel',
                component: () =>
                    import ('./components/PanelsDemo.vue')
            },
            {
                path: '/overlay',
                name: 'overlay',
                component: () =>
                    import ('./components/OverlayDemo.vue')
            },
            {
                path: '/media',
                name: 'media',
                component: () =>
                    import ('./components/MediaDemo.vue')
            },
            {
                path: '/menu',
                component: () =>
                    import ('./pages/BaseInfo/index.vue'),
                children: [{
                        path: '',
                        component: () =>
                            import ('./pages/BaseInfo/category.vue')
                    },
                    {
                        path: '/menu/seat',
                        component: () =>
                            import ('./components/menu/SeatDemo.vue')
                    },
                    {
                        path: '/menu/payment',
                        component: () =>
                            import ('./components/menu/PaymentDemo.vue')
                    },
                    {
                        path: '/menu/confirmation',
                        component: () =>
                            import ('./components/menu/ConfirmationDemo.vue')
                    },
                ],
            },
            {
                path: '/messages',
                name: 'messages',
                component: () =>
                    import ('./components/MessagesDemo.vue')
            },
            {
                path: '/file',
                name: 'file',
                component: () =>
                    import ('./components/FileDemo.vue')
            },
            {
                path: '/chart',
                name: 'chart',
                component: () =>
                    import ('./components/ChartDemo.vue')
            },
            {
                path: '/misc',
                name: 'misc',
                component: () =>
                    import ('./components/MiscDemo.vue')
            },
            {
                path: '/crud',
                name: 'crud',
                component: () =>
                    import ('./pages/CrudDemo.vue')
            },
            {
                path: '/timeline',
                name: 'timeline',
                component: () =>
                    import ('./pages/TimelineDemo.vue')
            },
            {
                path: '/empty',
                name: 'empty',
                component: () =>
                    import ('./components/EmptyPage.vue')
            },
            {
                path: '/documentation',
                name: 'documentation',
                component: () =>
                    import ('./components/Documentation.vue')
            },
            {
                path: '/blocks',
                name: 'blocks',
                component: () =>
                    import ('./components/BlocksDemo.vue')
            },
            {
                path: '/icons',
                name: 'icons',
                component: () =>
                    import ('./components/IconsDemo.vue')
            }
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () =>
            import ('./pages/Authentication/login/index.vue')
    },
    {
        path: '/forget-password',
        name: 'forget-password',
        component: () =>
            import ('./pages/Authentication/forget-password/index.vue')
    },
    {
        path: '/landing',
        name: 'landing',
        component: () =>
            import ('./pages/LandingDemo.vue')
    },
    {
        path: '/error',
        name: 'error',
        component: () =>
            import ('./pages/Error.vue')
    },
    {
        path: '/notfound',
        name: 'notfound',
        component: () =>
            import ('./pages/NotFound.vue')
    },
    {
        path: '/access',
        name: 'access',
        component: () =>
            import ('./pages/Access.vue')
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
