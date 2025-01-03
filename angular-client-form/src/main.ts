import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { NgxsModule } from '@ngxs/store';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
