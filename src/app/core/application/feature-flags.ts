import { Observable } from 'rxjs';

export interface FeatureFlags {
  enableCategories$: Observable<boolean>;
  enableDelete$: Observable<boolean>;
  enableComplete$: Observable<boolean>;
}