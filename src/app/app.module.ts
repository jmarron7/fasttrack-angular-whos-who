import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { Routes } from "@angular/router";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { SettingComponent } from './components/setting/setting.component';
import { GameComponent } from './game/game.component';
import { OptionCardComponent } from './components/option-card/option-card.component';
import { ResultsCardComponent } from './components/results-card/results-card.component';
import { ResultsComponent } from './results/results.component';

const routes: Routes = [{ path: "", component: HomeComponent }];

@NgModule({
  declarations: [AppComponent, HomeComponent, SettingComponent, OptionCardComponent, GameComponent, ResultsCardComponent, ResultsComponent],
  imports: [BrowserModule, FormsModule, AppRoutingModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
