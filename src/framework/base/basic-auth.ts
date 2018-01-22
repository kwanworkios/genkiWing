export class BasicAuth {

    username: string;
    password: string;

    public constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }

    getAuth(): string {
        return btoa(this.username + ":" + this.password);
    }
}