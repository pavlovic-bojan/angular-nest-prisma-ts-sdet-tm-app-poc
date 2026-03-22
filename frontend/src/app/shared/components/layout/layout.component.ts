import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutService } from '../../../core/services/layout.service';
import { UserFormComponent } from '../../../features/users/user-form/user-form.component';
import { DrawerComponent } from '../drawer/drawer.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent, DrawerComponent, UserFormComponent],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  readonly layout = inject(LayoutService);
}
