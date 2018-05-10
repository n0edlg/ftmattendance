import { Group } from '../../data-classes/group';
import { Component } from '@angular/core';
import { ModalController, ActionSheetController, NavController, AlertController, NavParams } from 'ionic-angular';
import { DataService } from '../../services/data.service';
import { Person } from '../../data-classes/person';
import { MemberListPage } from '../member-list-page/member-list';
import { Category } from '../../data-classes/category';

@Component({
  selector: 'group-list-page',
  styleUrls: ['/group-list-page/group-list.scss'],
  templateUrl: 'group-list.html'
})
export class GroupListPage {

  public category: Category;
  public groups: Group[] = [];    

  constructor(public navCtrl: NavController, private navParams: NavParams, private dataService: DataService, 
    public actionSheetCtrl: ActionSheetController, public alertCtrl: AlertController,
    public modalCtrl: ModalController) {

      this.category = navParams.get('category');
      this.groups.splice(0);
      this.category.groups.forEach(group_id => {
        this.groups.push(this.dataService.GetGroupById(group_id));
      });
      //this.groups = this.dataService.GroupList;
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad: ", this.dataService.GroupList);
    //this.groups = this.dataService.GroupList; 
  }

  public group_clickHandler(group: Group): void {
    console.log("group_clickHandler: ", group);
    this.navCtrl.push(MemberListPage, { group: group });
  }

  public addGroup_clickHandler() {
    let actionSheet = this.actionSheetCtrl.create({
      title: "Add Group",
      buttons: [
          {
            text: 'Add Existing Group',
            handler: () => {                
                this.showAddExistingGroupAlert();
            }
          },
          {
            text: 'Add New Group',
            handler: () => {                
                this.showAddNewGroupAlert();
            }
          },
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
                console.log('Cancel clicked');        
            }
          }
      ]
      });
      actionSheet.present();
  }

  public showAddExistingGroupAlert() {
    let groups: Group[] = this.dataService.GroupList;

    let alert = this.alertCtrl.create();
    alert.setTitle('Select Groups');

    groups.forEach(group => {
        alert.addInput({
            type: 'checkbox',
            label: group.name,
            value: group.id
        });
    });        

    alert.addButton({
    text: 'Cancel',
    handler: () => {            

    }
    });
    alert.addButton({
    text: 'OK',
    handler: data => {
        //this.dataService.AddSongToPlaylist(selectedPlaylist, song);            
        console.log("asdasfasfasfas : ", data);
        this.category.groups = this.category.groups.concat(data);
        this.dataService.UpdateCategory(this.category);

        this.groups.splice(0);
        this.category.groups.forEach(group_id => {
          this.groups.push(this.dataService.GetGroupById(group_id));
        });
    }
    });
    alert.present();
  }

  public showAddNewGroupAlert() {
    let group: Group = new Group();
    
    let prompt = this.alertCtrl.create({
      title: 'Add Group',
      //message: "Enter a name for your playlist:",
      inputs: [
          {
            name: 'name',
            placeholder: 'Name'
          },
          {
            name: 'organization',
            placeholder: 'Organization'
          }
      ],
      buttons: [
          {
            text: 'Cancel',
            handler: data => {
                console.log('Cancel clicked');
            }
          },
          {
            text: 'Add',
            handler: data => {
                console.log('Add clicked', data);
                group.name = data.name;
                group.organization = data.organization;
                this.dataService.AddGroup(group).subscribe((data: Group) => {
                  console.log("AddAttendance: ", data);
                  this.category.groups.push(data.id);
                  this.dataService.UpdateCategory(this.category);

                  this.groups.splice(0);
                  this.category.groups.forEach(group_id => {
                    this.groups.push(this.dataService.GetGroupById(group_id));
                  });
                });
            }
          }
      ]
    });
    prompt.present();
  }
}
