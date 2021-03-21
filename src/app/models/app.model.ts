export interface UserModel {
    id?: number;
    name?: string;
    role?: RoleModel;
    context?: ContextModel;

}

export interface RoleModel {
    id?: number
    name?: string;
    level?: number;
    implicit?:boolean;
}

export interface ContextModel {
    id?: number;
    name?: string;
    implicit?:boolean;
}

export interface ProductModel {
    id?: number;
    name?: string;
    dci?: string;
    producer?: ProducerModel;

}

export interface ProducerModel {
    id?: number;
    name?: string;
}

export interface SupplierModel {
    id?: number;
    name?: string;
}

export interface NecessaryModel {
    id?: number;
    product?: ProducerModel;
    necessary?: number;
    ordered?: number;
    rest?: number;
    active?: boolean;
    newQtyOrdered?: number;
    supplier?: number;
    discount?: number;
    price?: number;
    final_price?: number;
    deposit?: number;
    obs?: string;
    created?: Date;
    modified?: Date;
    creator?: number;
    modifier?: number;

}

export interface DepositModel {
    id?: number;
    product?: ProducerModel;
    necessary?: number;
    ordered?: number;
    rest?: number;
    active?: boolean;
    newQtyOrdered?: number;
    supplier?: SupplierModel;
    discount?: number;
    price?: number;
    final_price?: number;
    deposit?: number;
    obs?: string;
    created?: Date;
    modified?: Date;
    creator?: number;
    modifier?: number;

}

export interface HistoryModel {
    id?: number;
    product?: ProducerModel;
    supplier?: SupplierModel;
    necessary?: number;
    ordered?: number;
    rest?: number;
    discount?: number;
    price?: number;
    final_price?: number;
    deposit?: number;
    obs?: string;
    created?: Date;
    modified?: Date;
    creator?: number;
    modifier?: number;
}

export interface OfferModel {

    id?: number;
    product?: ProducerModel;
    supplier?: SupplierModel;
    discount?: number;
    price?: number;
    final_price?: number;
    deposit?: number;
    offer_details?: string;
    created?: Date;
    modified?: Date;
    creator?: number;
    modifier?: number;

}

export interface CredentialModel {
    id?:number;
    username?:string;
    password?:string;
    email?:string;
    role?:RoleModel;
    context?:ContextModel;
}

export interface AuthCredentials {
    token:string;
    identity:UserModel;
}

export interface CookieIdentity {
    token?:string;
    dx?:number;
    dlg?:number;
}

export interface CrudFilter {
    proprety: string;
    value: string;
  }


