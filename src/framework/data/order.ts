import { Address } from './address';
import { Member } from './member';
import { Data } from './data';
import { OrderItem } from './order-item';
export class Order extends Data {
    id: string;
    grandTotal: number = 0;
    status: string;
    orderitems: OrderItem[] = [];
    storeId: number;
    orderNo: string;
    member: Member;
    create: number;
    type: string;
    address: Address;
    pickup: number;
    phone: string;
    session: string;
    spot: string;
    takeout: boolean;

    calculate() {
        var grandTotal = 0;

        for (let oi of this.orderitems) {

            var oiTotal = 0;

            for (let group of oi.groups) {

                var items = group.selected;

                oiTotal += items[0].price;

            }

            oi.total = oiTotal;
            grandTotal += oiTotal;
        }

        this.grandTotal = grandTotal;
    }

}