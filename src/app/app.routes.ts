import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { UserComponent } from './pages/user/user.component';
import { ClientOrderComponent } from './pages/client-order/client-order.component';
import { JobWorkerTransactionComponent } from './pages/job-worker-transaction/job-worker-transaction.component';
import { JobWorkerComponent } from './pages/job-worker/job-worker.component';
import { SizeComponent } from './pages/size/size.component';
import { ColorComponent } from './pages/color/color.component';
import { ListClientComponent } from './client/list-client/list-client.component';
import { CreateClientComponent } from './client/create-client/create-client.component';
import { ConfirmationBoxComponent } from './util/confirmation-box/confirmation-box.component';
import { ListContractorComponent } from './contractor/list-contractor/list-contractor.component';
import { CreateContractorComponent } from './contractor/create-contractor/create-contractor.component';
import { ListDesignComponent } from './design/list-design/list-design.component';
import { CreateDesignComponent } from './design/create-design/create-design.component';
import { ListColorComponent } from './color/list-color/list-color.component';
import { CreateColorComponent } from './color/create-color/create-color.component';
import { CreateContractorChallanComponent } from './contractor-challan/create-contractor-challan/create-contractor-challan.component';
import { ListContractorChallanComponent } from './contractor-challan/list-contractor-challan/list-contractor-challan.component';
import { CreateClientChallanComponent } from './client-challan/create-client-challan/create-client-challan.component';
import { ListClientChallanComponent } from './client-challan/list-client-challan/list-client-challan.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }, {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'color',
                component: ColorComponent

            },
            {
                path: 'size',
                component: SizeComponent

            },
            {
                path: 'list-design',
                component: ListDesignComponent

            },
             {
                path: 'create-design',
                component: CreateDesignComponent

            },
            {
                path: 'list-color',
                component: ListColorComponent

            },
             {
                path: 'create-contractor-challan',
                component: CreateContractorChallanComponent

            },
            {
                path: 'list-contractor-challan',
                component: ListContractorChallanComponent

            },
             {
                path: 'create-client-challan',
                component: CreateClientChallanComponent

            },
            {
                path: 'lsit-client-challan',
                component: ListClientChallanComponent

            },
             {
                path: 'create-color',
                component: CreateColorComponent

            },
            {
                path: 'job-woker',
                component: JobWorkerComponent

            },
            {
                path: 'job-worker-transaction',
                component: JobWorkerTransactionComponent

            },
            {
                path: 'list-client',
                component: ListClientComponent

            },
            {
                path: 'list-contractor',
                component: ListContractorComponent

            },
            {
                path: 'create-contractor',
                component: CreateContractorComponent

            },
            {
                path: 'create-client',
                component: CreateClientComponent

            },
            {
                path: 'client-order',
                component: ClientOrderComponent

            },
            {
                path: 'user',
                component: UserComponent

            },            
            {
                path: 'dashboard',
                component: DashboardComponent

            },
            {
                path: 'customer',
                component: CustomerComponent
            },
            {
                path: 'confirm',
                component: ConfirmationBoxComponent
            }
        ]
    }
];
