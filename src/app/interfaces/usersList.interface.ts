export interface UserInterface {
    id : number;
    username : string;
    firstName : string | null;
    lastName : string | null;
    city : string | null;
    stack : string[] | null;
    subscriptionAmount : number | null;
    description : string | null;
    avatarUrl : string | null;
}
