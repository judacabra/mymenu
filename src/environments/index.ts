import * as DEV from './environment.development';
import * as PROD from './environment';

export const environment = DEV.environment.production 
    ? PROD.environment
    : DEV.environment;