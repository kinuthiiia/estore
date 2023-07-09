import { Accordion, Badge, Text } from "@mantine/core";
import moment from "moment";
import CartItem from "./cartitem";

export default function Order() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between w-full">
        <Text className="uppercase font-medium">Order number</Text>
        <Text fw="lighter">987654321</Text>
      </div>
      <div className="flex justify-between w-full">
        <Text className="uppercase font-medium">Date</Text>
        <Text fw="lighter">{moment(new Date()).format("Do MMMM, YYYY")}</Text>
      </div>
      <div className="flex justify-between w-full">
        <Text className="uppercase font-medium">Status</Text>
        <Badge className="uppercase">delivered</Badge>
      </div>
      <div className="flex justify-between w-full">
        <Text className="uppercase font-medium">Total</Text>
        <Text fw="lighter">KSH. 4500</Text>
      </div>
      <div>
        <Accordion defaultValue="customization">
          <Accordion.Item value="customization">
            <Accordion.Control>
              <Text className="uppercase font-medium">Products</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="space-y-2">
                {[
                  {
                    id: 1,
                    name: "Lira Earrings",
                    price: 2000,
                  },
                  {
                    id: 2,
                    name: "Ollie Earrings",
                    price: 2000,
                  },
                  {
                    id: 3,
                    name: "Hal Earrings",
                    price: 2000,
                  },
                  {
                    id: 4,
                    name: "Kaede Earrings",
                    price: 2000,
                    was: 2500,
                  },
                ].map((order, i) => (
                  <CartItem key={i} order={order} noControls />
                ))}
              </div>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  );
}
