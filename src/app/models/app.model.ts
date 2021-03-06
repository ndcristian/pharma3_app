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
    implicit?: boolean;
}

export interface ContextModel {
    id?: number;
    name?: string;
    implicit?: boolean;
    central?: boolean;
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
    implicit?: boolean;
}

export interface NecessaryModel {
    id?: number;
    product?: ProductModel;
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
    modifier_name?:string;
    context?: number;
    context_name?: string;

}

export interface NecessaryExportModel {
    product?: string;
    producer?: string;
    necessary?: number;
    data?: Date;
    context?: string
}

export interface DepositModel {
    id?: number;
    product?: ProductModel;
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
    modifier_name?:string;
    context?: number;

}

export interface HistoryModel {
    id?: number;
    product?: ProductModel;
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
    modifier_name?:string;
}

export interface OfferModel {

    id?: number;
    product?: number;
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
    id?: number;
    username?: string;
    password?: string;
    email?: string;
    role?: RoleModel;
    context?: ContextModel;
}

export interface AuthCredentials {
    token: string;
    identity: UserModel;
}

export interface CookieIdentity {
    token?: string;
    dx?: number;
    dlg?: number;
}

export interface CrudFilter {
    proprety: string;
    value: string;
}


