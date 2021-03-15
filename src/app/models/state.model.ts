import { ProductModel, UserModel } from "./app.model";

export interface AppStateModel {
    user:UserModel;
    isLogged:boolean;
    products:ProductModel;
    title:"Etix v.3";
    currentDate: Date;
    
}