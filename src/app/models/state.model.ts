import { ContextModel, ProducerModel, ProductModel, SupplierModel, UserModel } from "./app.model";

export interface AppStateModel {
    user?:UserModel;
    isLogged?:boolean;
    products?:ProductModel[];
    producers?: ProducerModel[];
    context?:ContextModel[];
    supplier?:SupplierModel[];
    title?:"Etix v.3";
    currentDate?: Date;
    before30Date?:Date;
    action?:string;
    
}