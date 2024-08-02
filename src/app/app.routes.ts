import { Routes } from '@angular/router';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';

export const routes: Routes = [
    {
        path: '',
        component: UserDashboardComponent
    },
    {
        path: 'users',
        children: [
            {
                path: ':id',
                component: UserDetailsComponent
            }
        ]
    }
];
