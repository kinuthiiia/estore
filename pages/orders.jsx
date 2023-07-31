import { Button, Space, Text } from "@mantine/core";
import { Footer, Logoheader, Order } from "../components";
import { useRouter } from "next/router";
import { useQuery } from "urql";
import { Userdatacontext } from "../context/userdata";
import { useContext } from "react";

export default function Orders() {
  const router = useRouter();
  const { data: userData } = useContext(Userdatacontext);

  const GET_ORDERS = `
      query GET_ORDERS(
        $customer: String
      ){
        getOrders(
          customer: $customer
        ){
          id
          items{
            product{
              id
              images
              variants{
                label
              }
              name
            }
            salePrice
            quantity
            variant
          }
          deliveryLocation{
            lat
            lng
          }
          payment{
            code
            timestamp            
            amount
          }
          deliveryTimestamp
          dispatchTimestamp
          pickUpTimestamp
          createdAt
        }
      }
  `;

  const [{ data, fetching, error }, reexecuteQuery] = useQuery({
    query: GET_ORDERS,
    variables: {
      customer: userData?.id,
    },
  });

  if (fetching) return <p>Fetching...</p>;
  if (error) return <p>Error...</p>;

  return (
    <div>
      <Logoheader />
      <div className="p-8 space-y-6">
        <h1 className="font-medium text-[1.5rem]">My orders</h1>

        {data?.getOrders
          .sort((a, b) => Number(b?.createdAt) - Number(a?.createdAt))
          .map((order, i) => (
            <Order key={i} order={order} />
          ))}

        {data?.getOrders.length == 0 && (
          <>
            <div className="bg-gray-100 p-4 border-t-2 border-[#A18A68]">
              <Text>No order has been made yet.</Text>
            </div>

            <Button
              style={{ color: "#A18A68" }}
              variant="subtle"
              fullWidth
              fw="lighter"
              onClick={() => router.push("/")}
              uppercase
            >
              Browse products
            </Button>
          </>
        )}

        <Footer />
      </div>
    </div>
  );
}
