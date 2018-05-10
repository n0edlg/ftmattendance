import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { ChartsModule } from 'ng2-charts';
import { MdlModule } from '@angular-mdl/core';
import { NgCalendarModule  } from 'ionic2-calendar';
import { EmailComposer } from '@ionic-native/email-composer';
import { File } from '@ionic-native/file';
import { SocialSharing } from '@ionic-native/social-sharing';
import { DatePicker } from '@ionic-native/date-picker';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home-page/home';
import { DataService } from '../services/data.service';
import { SearchPage } from '../pages/search-page/search';
import { LocalStorageManagerService } from '../services/local-storage-manager.service';
import { CloudStorageManagerService } from '../services/cloud-storage-manager.service';
import { GroupListPage } from '../pages/group-list-page/group-list';
import { MemberListPage } from '../pages/member-list-page/member-list';
import { AttendancePage } from '../pages/attendance-page/attendance';
import { MemberInfoPage } from '../pages/member-info-page/member-info';
import { GroupInfoPopoverPage } from '../pages/group-info-popover-page/group-info-popover-page';
import { CategoryListPage } from '../pages/category-list-page/category-list';
import { SummaryCalendar } from '../components/summary-calendar-component/summary-calendar';


export const firebaseConfig = {
  apiKey: "AIzaSyARi4dywsftf5h6ij-oGvcQY8TS7NrlB1A",
  authDomain: "ftmattendance.firebaseapp.com",
  databaseURL: "https://ftmattendance.firebaseio.com",
  projectId: "ftmattendance",
  storageBucket: "ftmattendance.appspot.com",
  messagingSenderId: "663729745002"
};


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SearchPage,
    CategoryListPage,
    GroupListPage,
    MemberListPage,
    AttendancePage,
    MemberInfoPage,
    GroupInfoPopoverPage,
    SummaryCalendar
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MdlModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    ChartsModule,
    NgCalendarModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SearchPage,
    CategoryListPage,
    GroupListPage,
    MemberListPage,
    AttendancePage,
    MemberInfoPage,
    GroupInfoPopoverPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataService,
    LocalStorageManagerService,
    CloudStorageManagerService,
    EmailComposer,
    File,
    SocialSharing,
    DatePicker
  ]
})
export class AppModule {}
