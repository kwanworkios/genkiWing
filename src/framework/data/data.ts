import { Image } from './image';
export class Data {

    images: { string: Image };

    constructor() {

    }

    public static toData<T extends Data>(cls: { new (): T }, json): T {

        var result = new cls();

       
        for (var propName in json) {
            var value = json[propName];
       
            if (value != null) {
                result[propName] = result.toProperty(propName, value);
            }
        }

        return result;
    }

    protected toProperty(name: string, value) {

        if (value == null) return value;

        return value;
    }


    public static toDataArray<T extends Data>(cls: { new (): T }, jarray): T[] {

        var result = [];

        for (let jo of jarray) {
            var data = Data.toData(cls, jo);
            if (data) {
                result.push(data);
            }
        }

        return result;
    }

   
    public getImage(name: string, width: number, crop: boolean): string {
        
        if (!this.images) return null;
        var im = this.images[name] as Image;
        if (!im) return null;

        var url = im.url;

        if (!url) return null;

        if (url.indexOf("googleuser") > 0 && width) {
            var suffix = "=s" + width;
            if (crop) {
                suffix += "-c";
            }
            url += suffix;
        }


        if(url.indexOf("http://") == 0 && url.indexOf("localhost") == 0){
            url = url.replace("http:", "https:");
        }

        return url;

    }

    public clone<T>(type: { new(): T ;} ): T {
        var obj2:any=Object.assign(new type(),this);
        return obj2;
    }

    public static cloneArray<T>(type: { new(): T ;}, array){

        var result = [];

        for(let data of array){
            result.push(data.clone(type));
        }

        return result;

    }

    public static remove(array: any[], obj: any) {
        var index = array.indexOf(obj, 0);
        if (index > -1) {
            array.splice(index, 1);
        }
    }

    public static replace(array: any[], obj: any){
        for(var i = 0; i < array.length; i++){
            var id = obj.id;
            if(id && id == array[i].id){
                array[i] = obj;
                return;
            }
        }
    }

}