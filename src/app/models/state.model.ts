import { ProducerModel, ProductModel, UserModel } from "./app.model";

export interface AppStateModel {
    user?:UserModel;
    isLogged?:boolean;
    products?:ProductModel[];
    producers?: ProducerModel[];
    title?:"Etix v.3";
    currentDate?: Date;
    action?:string;
    
}