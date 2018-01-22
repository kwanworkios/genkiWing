export class VersionChecker {
    
        private version: string;
        private major: number;
        private minor: number;
        private revision: number;
    
        private _latestVersion: string = "";
        private _updateAvailable: boolean = false;
        private _requiredUpdate: boolean = false;
        private _updateLink: string = null;
    
        private _updateMessage: string = undefined;
    
        get latestVersion(): string {
            return this._latestVersion;
        }
    
        get updateAvailable(): boolean {
            return this._updateAvailable;
        }
    
        get requiredUpdate(): boolean {
            return this._requiredUpdate;
        }
    
        get updateLink(): string {
            return this._updateLink;
        }
    
    
        get updateMessage(): string {
            return this._updateMessage;
        }
    
        /**
         * Create a new version checker instance to do version checking
         *
         * version is the app version got from the app config.xml; 
         * json can be the standard startup object including 'data' with 'android' or 'ios', 
         * or an object with 'major', 'minor', 'revision' and 'link';
         * platform is 'android' or 'ios' and its default value is null;
         */
        constructor(version: string, json: any, platform: string = null) {
            this.version = version;
    
            this.init(version);
            this.doCheck(json, platform);
        }
    
        private init(version: string) {
            if (version == null) {
                return;
            }
    
            let parts: string[] = version.split(".");
            if (parts.length == 3) {
                this.major = parseInt(parts[0]);
                this.minor = parseInt(parts[1]);
                this.revision = parseInt(parts[2]);
            }
        }
    
        private doCheck(json, platform: string) {
            if (json) {
                let data: any = json["data"];
                if (data) {
                    this.doCheck(data[platform], platform);
                } else if (json[platform]) {
                    this.doCheck(json[platform], platform);
                } else {
                    this._latestVersion = json["version"];
                    let major: number = json["major"];
                    let minor: number = json["minor"];
                    let revision: number = json["revision"];
    
                    this.checkVersion(major, minor, revision);
                    if (this.updateAvailable || this.requiredUpdate) {
                        this._updateLink = json["link"];
                    }
    
                    this._updateMessage = json["updateMessage"];
                    // console.log("tetetete", this._updateMessage);
                }
            }
        }
    
        private validNumber(num: number): boolean {
            return num != null && !isNaN(num);
        }
    
        private checkVersion(major: number, minor: number, revision: number) {
            if (this.validNumber(major) && this.validNumber(minor) && this.validNumber(revision)) {
                this._requiredUpdate = (major > this.major || (major == this.major && minor > this.minor));
                this._updateAvailable = (this._requiredUpdate || (major == this.major && minor == this.minor && revision > this.revision));
            }
        }
    
    }