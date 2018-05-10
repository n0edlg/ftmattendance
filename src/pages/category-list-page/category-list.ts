import {GroupListPage} from '../group-list-page/group-list';
import { Group } from '../../data-classes/group';
import { Component } from '@angular/core';
import {ModalController, ActionSheetController,  NavController,  AlertController} from 'ionic-angular';
import { DataService } from '../../services/data.service';
import { Person } from '../../data-classes/person';
import { MemberListPage } from '../member-list-page/member-list';
import { Category } from '../../data-classes/category';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

@Component({
  selector: 'category-list-page',
  styleUrls: ['/category-list-page/category-list.scss'],
  templateUrl: 'category-list.html'
})
export class CategoryListPage {

  //public categories: Category[] = [];
  public grid: Array<Array<Category>> = [];

  constructor(public navCtrl: NavController, private dataService: DataService, 
    public actionSheetCtrl: ActionSheetController, public alertCtrl: AlertController,
    public modalCtrl: ModalController) {

      //this.categories = this.dataService.Categories;

      this.dataService.categoriesSubject.subscribe(data => {
        let rowNum = 0;
        for (let i = 0; i < this.dataService.Categories.length; i+=2) {  
          this.grid[rowNum] = [];  
          this.grid[rowNum].push(this.dataService.Categories[i]);
          //if (this.dataService.Categories[i+1] != null) {
            this.grid[rowNum].push(this.dataService.Categories[i+1]);
          //}
          rowNum++;
        }
      });      
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad: ", this.dataService.Categories);
    //this.groups = this.dataService.GroupList;     
    console.log("sfkjasklfjasklfasfa: ", new Date('12/01/2017').getDay());
  }

  public category_clickHandler(category: Category): void {
    console.log("category_clickHandler: ", category);
    this.navCtrl.push(GroupListPage, { category: category });
  }

  public addCategory_clickHandler() {
    let category: Category = new Category();
    
    let prompt = this.alertCtrl.create({
      title: 'Add Category',
      //message: "Enter a name for your playlist:",
      inputs: [
          {
            name: 'name',
            placeholder: 'Name'
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
                category.name = data.name;
                this.dataService.AddCategory(category).subscribe((data: Category) => {

                });
            }
          }
      ]
    });
    prompt.present();
  }
}
