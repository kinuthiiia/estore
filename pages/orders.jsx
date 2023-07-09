import { Button, Space, Text } from "@mantine/core";
import { Footer, Logoheader, Order } from "../components";
import { useRouter } from "next/router";

export default function Orders() {
  const router = useRouter();
  return (
    <div>
      <Logoheader />
      <div className="p-8 space-y-8">
        <h1 className="font-medium text-[1.5rem]">My orders</h1>

        {[1, 2, 3, 4].map((el, i) => (
          <Order key={i} />
        ))}

        {/* <div className="bg-gray-100 p-4 border-t-2 border-[#A18A68]">
          <Text>No order has been made yet.</Text>
        </div> */}

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

        <Space h={60} />

        <Footer />
      </div>
    </div>
  );
}
