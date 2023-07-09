import {
  Button,
  Card,
  Divider,
  Drawer,
  Group,
  Indicator,
  NavLink,
  Radio,
  Space,
  Stack,
  Text,
  Timeline,
  Transition,
  UnstyledButton,
} from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconLogout,
  IconUser,
} from "@tabler/icons";
import { Turn as Hamburger } from "hamburger-react";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import CartItem from "./cartitem";

import { Userdatacontext } from "../context/userdata";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import Address from "./address";

export default function Logoheader() {
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const { data } = useContext(Userdatacontext);
  const [selectedAddress, setSelectedAddress] = useState(
    () => data?.addresses.filter((address) => address?.default == true)[0]?.id
  );
  const [selectedPayment, setSelectedPayment] = useState("pay-now");
  const [loading, setLoading] = useState(false);

  const getPrice = () => {
    let sum = 0;
    data?.cart.forEach((order) => {
      sum =
        sum +
        order?.product.variants.filter(
          (variant) => variant?.label == order?.variant
        )[0].price *
          order?.quantity;
    });

    return sum;
  };

  const getEstimatedFees = () => {
    // an api call that looks at the number of products to be delivered , cost of products , distance to determine the delivery fees
    return 150;
  };

  const makePayment = new Promise(function (resolve, reject) {
    setTimeout(() => {
      resolve({
        code: "XYZ",
        timestamp: Date.now(),
        amount: getPrice() + getEstimatedFees(),
        name: "Stephen Kinuthia",
      });
    }, 5000);
  });

  const handlePlaceOrder = () => {
    setLoading(true);

    if (selectedPayment == "pay-now") {
      makePayment.then(({ code, timestamp, amount, name }) => {
        let _items = [];

        data?.cart.forEach((cartItem) => {
          let entry = {
            product: cartItem.product.id,
            salePrice: cartItem.product.variants.filter(
              (variant) => variant?.label == cartItem?.variant
            )[0].price,
            quantity: cartItem.quantity,
          };
          _items.push(entry);
        });

        let _payment = {
          code,
          timestamp: timestamp.toString(),
          name,
          amount,
        };

        let _deliveryLocation = {
          lat: data?.addresses.filter(
            (_address) => _address.id == selectedAddress
          )[0].lat,
          lng: data?.addresses.filter(
            (_address) => _address.id == selectedAddress
          )[0].lng,
        };

        let order = {
          items: JSON.stringify(_items),
          customer: data?.id,
          payment: JSON.stringify(_payment),
          _deliveryLocation: JSON.stringify(_deliveryLocation),
        };

        console.log(order);
        setLoading(false);
        // _createOrder(order).then(() => {

        // })
      });
    }

    return;
  };

  return (
    <div>
      <div className="flex w-full p-4 justify-between">
        <div>logo</div>
        <div className="space-x-3 flex">
          <div
            className="mt-3 cursor-pointer"
            onClick={() => setCartOpen(true)}
          >
            <Indicator
              color="#A18A68"
              inline
              label={data?.cart?.length || 0}
              size={16}
            >
              <svg
                width="24"
                height="24"
                xmlns="http://www.w3.org/2000/svg"
                fillRule="evenodd"
                clipRule="evenodd"
              >
                <path d="M13.5 21c-.276 0-.5-.224-.5-.5s.224-.5.5-.5.5.224.5.5-.224.5-.5.5m0-2c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5 1.5-.672 1.5-1.5-.672-1.5-1.5-1.5m-6 2c-.276 0-.5-.224-.5-.5s.224-.5.5-.5.5.224.5.5-.224.5-.5.5m0-2c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5 1.5-.672 1.5-1.5-.672-1.5-1.5-1.5m16.5-16h-2.964l-3.642 15h-13.321l-4.073-13.003h19.522l.728-2.997h3.75v1zm-22.581 2.997l3.393 11.003h11.794l2.674-11.003h-17.861z" />
              </svg>
            </Indicator>
          </div>
          <UnstyledButton onClick={() => setMenuOpen((menuOpen) => !menuOpen)}>
            <Hamburger
              onClick={() => setMenuOpen(true)}
              size={24}
              className="inline"
            />
          </UnstyledButton>
        </div>
      </div>
      <Transition
        mounted={true}
        transition="pop"
        duration={400}
        timingFunction="ease"
      >
        {() => (
          <div
            className={
              menuOpen
                ? "h-[80vh] w-full shadow-md space-y-2 p-6"
                : "h-[80vh] w-full shadow-md hidden"
            }
          >
            <NavLink
              label={
                <a href="/" className="font-medium text-[1.5rem] block">
                  Home
                </a>
              }
              childrenOffset={28}
            />
            <NavLink
              label={
                <a href="#" className="font-medium text-[1.5rem] block">
                  Categories
                </a>
              }
              childrenOffset={28}
            >
              <NavLink label="First child link" />
              <NavLink label="Second child link" />
              <NavLink label="Third child link" />
            </NavLink>
            <NavLink
              label={
                <a href="/saved" className="font-medium text-[1.5rem] block">
                  Saved products
                </a>
              }
              childrenOffset={28}
            />
            <NavLink
              label={
                <a href="/orders" className="font-medium text-[1.5rem] block">
                  Orders
                </a>
              }
              childrenOffset={28}
            />
            <NavLink
              label={
                <a href="/about" className="font-medium text-[1.5rem] block">
                  About
                </a>
              }
              childrenOffset={28}
            />
            <NavLink
              label={
                <a href="/help" className="font-medium text-[1.5rem] block">
                  Help
                </a>
              }
              childrenOffset={28}
            />
            <NavLink
              label={
                <a href="/contact" className="font-medium text-[1.5rem] block">
                  Contacts
                </a>
              }
              childrenOffset={28}
            />
            <Divider />
            <NavLink
              label={
                <a
                  href="/account"
                  className="font-medium text-[1.5rem] flex space-x-2"
                >
                  <IconUser className="mt-2" />
                  <span>My account</span>
                </a>
              }
              childrenOffset={28}
            />

            <NavLink
              label={
                <a className="font-medium text-[1.5rem] flex space-x-2">
                  <IconLogout className="mt-2" />
                  <span
                    className="hover:cursor-pointer"
                    onClick={data && signOut}
                  >
                    Log out
                  </span>
                </a>
              }
              childrenOffset={28}
            />
          </div>
        )}
      </Transition>
      <Drawer
        position="right"
        opened={cartOpen}
        title={null}
        withCloseButton={false}
      >
        <div className="h-[96vh]">
          <div className="sticky top-0 bg-white z-40">
            <div className="p-3 relative">
              <IconChevronLeft
                onClick={() => setCartOpen(false)}
                className="absolute mt-[6px]"
              />
              <h2 className="w-full text-center text-[1.2rem] font-medium">
                Shopping cart
              </h2>
            </div>
          </div>

          {data?.cart?.length > 0 ? (
            <>
              <div className="p-2 pt-6">
                <span className="block text-[#909090] mb-3">
                  {data?.cart?.length} items
                </span>
                <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {data?.cart.map((cartItem, i) => (
                    <CartItem key={i} order={cartItem} />
                  ))}
                </div>
              </div>
              <div className="fixed w-[93%] bottom-0 bg-white z-40 p-4 border-t-[1px] border-gray-400 space-y-5">
                <div className="flex justify-between">
                  <p className="font-medium">
                    Subtotal ({data?.cart?.length} items)
                  </p>
                  <p className="text-[#A18A68]">Ksh. {getPrice()}</p>
                </div>
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">Shipping</p>
                    <span className="text-[0.8rem] text-[#909090] font-light">
                      Based on your default address
                    </span>
                  </div>
                  <p className="text-[#A18A68]">Ksh. {getEstimatedFees()}</p>
                </div>
                <Divider />
                <div className="flex justify-between">
                  <p className="font-medium">Total</p>
                  <p className="text-[#A18A68]">
                    ≈ Ksh. {getPrice() + getEstimatedFees()}
                  </p>
                </div>
                <Button
                  color="dark"
                  size="sm"
                  uppercase
                  fullWidth
                  onClick={() => setCheckoutOpen(true)}
                  rightIcon={<IconChevronRight size={16} />}
                >
                  checkout
                </Button>
              </div>
            </>
          ) : (
            <div className="mt-[20%] relative  w-full">
              <img
                src={`/empty-cart.jpg`}
                className="h-[250px] mb-6 absolute left-[50%] translate-x-[-50%]"
              />
              <div className="absolute top-[270px] w-[90%] left-[50%] translate-x-[-50%]">
                <h1 className="w-full text-center text-[1.3rem] font-semibold mb-6">
                  Your cart is empty
                </h1>
                <Text className="w-full text-center">
                  Looks like you haven&apos;t added anything to your cart yet.
                </Text>
                <Button
                  color="dark"
                  size="sm"
                  fw="lighter"
                  radius={null}
                  uppercase
                  fullWidth
                  onClick={() => router.push("/")}
                  mt={32}
                >
                  start shopping
                </Button>
              </div>
            </div>
          )}
        </div>
      </Drawer>
      <Drawer
        position="right"
        opened={checkoutOpen}
        title={null}
        withCloseButton={false}
      >
        <div className="h-[96vh]">
          <div className="sticky top-0 bg-white z-40">
            <div className="p-3 relative">
              <IconChevronLeft
                onClick={() => setCheckoutOpen(false)}
                className="absolute mt-[6px]"
              />
              <h2 className="w-full text-center text-[1.2rem] font-medium">
                Checkout
              </h2>
            </div>
          </div>
          <div className="p-2 pt-6">
            <Timeline color="dark" active={1} bulletSize={24} lineWidth={2}>
              <Timeline.Item title="Order summary">
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <div className="space-y-2 p-2">
                    <div className="flex justify-between">
                      <p className="font-medium">
                        Subtotal ({data?.cart?.length} items)
                      </p>
                      <p className="text-[#A18A68]">Ksh. {getPrice()}</p>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">Shipping</p>
                      </div>
                      <p className="text-[#A18A68]">
                        Ksh. {getEstimatedFees()}
                      </p>
                    </div>
                    <Divider />
                    <div className="flex justify-between">
                      <p className="font-medium">Total</p>
                      <p className="text-[#A18A68]">
                        ≈ Ksh. {getPrice() + getEstimatedFees()}
                      </p>
                    </div>
                  </div>
                </Card>
              </Timeline.Item>

              <Timeline.Item title="Delivery location">
                <div className="py-4">
                  <Radio.Group
                    value={selectedAddress}
                    onChange={setSelectedAddress}
                    name="delivery address"
                    description="Select an address to be used for shipping"
                    withAsterisk
                  >
                    <Stack spacing="xs" mt={24}>
                      {data?.addresses.map((address, i) => (
                        <Radio
                          key={i}
                          value={address?.id}
                          label={<Address address={address} noActions />}
                        />
                      ))}
                    </Stack>
                  </Radio.Group>
                </div>
              </Timeline.Item>

              <Timeline.Item title="Payment">
                <Radio.Group
                  value={selectedPayment}
                  onChange={setSelectedPayment}
                  name="payment option"
                  description="Choose a payment option"
                  withAsterisk
                >
                  <Stack spacing="xs" mt={24}>
                    <Radio value={"pay-now"} label="Pay now via M-PESA" />
                    <Radio value={"pay-later"} label="Pay on delivery" />
                  </Stack>
                </Radio.Group>
              </Timeline.Item>
            </Timeline>
            <Space h={36} />
            <div className="fixed w-[90%] bottom-0 bg-white z-40 p-4 space-y-5">
              <Button
                color="dark"
                size="sm"
                uppercase
                fullWidth
                onClick={handlePlaceOrder}
                loading={loading}
              >
                complete order
              </Button>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
