import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GroupListComponent } from "../../components/group/group-list/group-list.component";

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CommonModule, RouterOutlet, GroupListComponent],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css'
})
export class GroupsComponent {

}
