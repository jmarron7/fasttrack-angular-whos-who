import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { Routes } from "@angular/router";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { SettingComponent } from './setting/setting.component';
import { GameComponent } from './game/game.component';

const routes: Routes = [{ path: "", component: HomeComponent }];

@NgModule({
  declarations: [AppComponent, HomeComponent, SettingComponent, GameComponent],
  imports: [BrowserModule, FormsModule, AppRoutingModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
