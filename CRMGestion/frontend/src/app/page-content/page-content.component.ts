import { Component, OnInit } from '@angular/core';
import { User } from '../models/index';
import { UserService } from '../services/index';

@Component({
    moduleId: module.id,
    selector: 'page-content',
    templateUrl: './page-content.html',
    providers: [PageContentComponent]
})

export class PageContentComponent implements OnInit{

	currentUser: User;
    users: User[] = [];

    constructor(private userService: UserService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loadAllUsers();
    }

    deleteUser(id: number) {
        this.userService.delete(id).subscribe(() => { this.loadAllUsers() });
    }

    loadAllUsers() {
        this.userService.getAll().subscribe(users => { this.users = users; });
    }

}
