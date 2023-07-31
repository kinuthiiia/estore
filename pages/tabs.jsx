import React, { useRef } from "react";

import { useWindowScroll } from "@mantine/hooks";
import { Tabs } from "@mantine/core";

export default function HorizontalScrollableTabs() {
  return (
    <Tabs
      color="dark"
      unstyled
      styles={(theme) => ({
        tabsList: {
          display: "flex",
          maxWidth: "100%",
          overflowX: "auto",
          scrollbarWidth: "none",
        },
        tabPanel: {
          background: "yellow",
        },
        tab: {
          ...theme.fn.focusStyles(),
          padding: `${theme.spacing.xs} ${theme.spacing.md}`,
          cursor: "pointer",
          fontSize: theme.fontSizes.sm,
          display: "flex",
          alignItems: "center",
          fontFamily: "Satoshi",
          borderBottomColor: "light-gray",
          borderBottomWidth: 0.5,
          "&[data-active]": {
            borderBottomColor: "black",
            borderBottomWidth: 2,
          },
        },
      })}
      defaultValue="dashboard"
    >
      <Tabs.List>
        <Tabs.Tab value="dashboard">Dashboard</Tabs.Tab>
        <Tabs.Tab value="products">Products</Tabs.Tab>
        <Tabs.Tab value="orders">Orders</Tabs.Tab>
        <Tabs.Tab value="admins">Admins</Tabs.Tab>
        <Tabs.Tab value="dashboar2">Dashboard</Tabs.Tab>
        <Tabs.Tab value="product3">Products</Tabs.Tab>
        <Tabs.Tab value="order">Orders</Tabs.Tab>
        <Tabs.Tab value="admin">Admins</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="dashboard" pl="xs">
        <div className="max-w-[100vw]">1</div>
      </Tabs.Panel>
      <Tabs.Panel value="products" pl="xs">
        2
      </Tabs.Panel>
      <Tabs.Panel value="orders" pl="xs">
        3
      </Tabs.Panel>
      <Tabs.Panel value="admins" pl="xs">
        4
      </Tabs.Panel>

      <Tabs.Panel value="dashboar2" pl="xs">
        5
      </Tabs.Panel>
      <Tabs.Panel value="product3" pl="xs">
        6
      </Tabs.Panel>
      <Tabs.Panel value="order" pl="xs">
        7
      </Tabs.Panel>
      <Tabs.Panel value="admin" pl="xs">
        8
      </Tabs.Panel>
    </Tabs>
  );
}
