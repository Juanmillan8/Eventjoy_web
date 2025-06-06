import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Group, Visibility } from '../../../models/group.model';
import { AuthService } from '../../../services/auth.service';
import { GroupService } from '../../../services/group.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserGroup } from '../../../models/usergroup.model';
import { Member } from '../../../models/member.model';
import { UserGroupService } from '../../../services/usergroup.service';

@Component({
  selector: 'app-group-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './group-form.component.html',
  styleUrl: './group-form.component.css'
})
export class GroupFormComponent implements OnInit {
  group: Group | null = null;
  groupForm: FormGroup;
  groupId: string | null = null;
  errores: string | null = null;
  mensajes: string | null = null;
  existGroup: boolean = true;
  memberAuth: Member | null = null;

  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService, private userGroupService: UserGroupService, private groupService: GroupService, private formBuilder: FormBuilder) {

    this.groupForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      visibility: ['', [Validators.required]],
      icon: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.authService.getUserDataAuth().subscribe(({ user, member }) => {
        if (user && member) {
          this.memberAuth = member;
          this.groupId = params.get('id'); // o el nombre que uses en la ruta
          if (this.groupId && this.groupId != "-1") {
            this.groupService.getGroupsByAdminStatus(member.userAccountId).subscribe(({ adminGroups, memberGroups }) => {
              this.group = adminGroups.find((g: Group) => g.id === this.groupId) || null;
              this.group ? this.existGroup = true : this.existGroup = false;

              if (this.group != undefined && this.group) {
                this.groupForm.setValue({
                  'title': this.group.title,
                  'description': this.group.description,
                  'visibility': this.group.visibility,
                  'icon': this.group.icon,
                });
              }
            });
          }
        }
      });
    })
  }

  cancelarEdicion() {
    this.router.navigate(["/groups"]);
  }
  borrar() {
    this.errores = null;
    this.mensajes = null;
    if (this.group) {
      this.groupService.deleteGroup(this.group).then(() => {
        this.errores = null;
        this.mensajes = null;
        this.existGroup = true;
        this.router.navigate(["/groups"]);
      }).catch(error => {
        console.log(error)
        this.errores = "Error al borrar el grupo."
      });

    }
  }
  guardar() {


    this.errores = null;
    this.mensajes = null;

    let title = this.groupForm.get("title")?.value;
    let description = this.groupForm.get("description")?.value;
    let visibility = this.groupForm.get("visibility")?.value;
    let icon = this.groupForm.get("icon")?.value;



    let isValidForm = this.groupForm.valid;

    //Edición de un grupo existente
    if (isValidForm && this.group) {
      this.group.title = title;
      this.group.description = description;
      this.group.visibility = visibility;
      this.group.icon = icon;
      this.groupService.editGroup(this.group).then(() => {
      this.mensajes = "Información del grupo actualizada correctamente."
      this.router.navigate(["/groups"]);

      }).catch(() => {
        this.errores = "Error al actualizar la información del grupo"
      });
    } else if (this.groupId == "-1" && this.memberAuth) {
      let visibilidad:Visibility = visibility == "PUBLIC" ?Visibility.PUBLIC:Visibility.PRIVATE;

      let newGroup = new Group("-1", title, description, visibilidad, icon);
      let newUserGroup = new UserGroup("-1", this.memberAuth.userAccountId, "-1", true, new Date().toLocaleDateString(), false);

      this.groupService.createGroup(newGroup).then((group) => {
        newUserGroup.groupId = group.id;

        this.userGroupService.saveUserGroup(newUserGroup).then(() => {
          this.mensajes = "Grupo creado correctamente"
          this.router.navigate(["/groups"]);
        }).catch(error => {
          this.errores = "Error al asignar el grupo al usuario autenticado."
        });
      }).catch(error => {
        this.errores = "Error al crear el grupo."
      });

    }
  }
}