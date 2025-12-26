import { Injectable } from '@angular/core';
import { RemoteConfig, fetchAndActivate, getBoolean, getValue } from '@angular/fire/remote-config';
import { BehaviorSubject } from 'rxjs';
import { FeatureFlags } from '../application/feature-flags';

@Injectable({ providedIn: 'root' })
export class FirebaseRemoteConfigFlags implements FeatureFlags {
  private enableCategoriesSubject = new BehaviorSubject<boolean>(true);
  private enableDeleteSubject = new BehaviorSubject<boolean>(true);
  private enableCompleteSubject = new BehaviorSubject<boolean>(true);

  enableCategories$ = this.enableCategoriesSubject.asObservable();
  enableDelete$ = this.enableDeleteSubject.asObservable();
  enableComplete$ = this.enableCompleteSubject.asObservable();

  constructor(private rc: RemoteConfig) {

    this.rc.defaultConfig = {
      ff_enable_categories: true,
      ff_enable_delete: true,
      ff_enable_complete: true,
    } as any;

    this.rc.settings = {
      minimumFetchIntervalMillis: 60_000, 
      fetchTimeoutMillis: 10_000,
    };

    this.refresh();
  }

  async refresh() {
    try {
      await fetchAndActivate(this.rc);

      this.enableCategoriesSubject.next(this.getFlag('ff_enable_categories'));
      this.enableDeleteSubject.next(this.getFlag('ff_enable_delete'));
      this.enableCompleteSubject.next(this.getFlag('ff_enable_complete'));
    } catch (error) {
      console.warn('Error al obtener Remote Config, usando valores por defecto:', error);
    }
  }

  private getFlag(key: string): boolean {

    const v = getValue(this.rc, key);
    return v.asBoolean();
  }
}
