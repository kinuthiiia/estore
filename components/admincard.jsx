import {
  Accordion,
  Avatar,
  Badge,
  Button,
  HoverCard,
  Kbd,
  Popover,
  Space,
  Text,
} from "@mantine/core";
import moment from "moment";
import { useState } from "react";

export default function AdminCard({ admin }) {
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <div>
      <Accordion.Item value={(admin?.id).toString()}>
        <Accordion.Control>
          <div className="flex space-x-5">
            <Avatar color="brown" radius="xl" size={52}>
              {admin.name
                .split(" ")
                .map((el) => new String(el).charAt(0).toUpperCase())}
            </Avatar>
            <div className="space-y-2">
              <Text lineClamp={1} className="text-[#2c2c2c] font-medium">
                {admin?.name}
              </Text>
              <Badge color="dark" uppercase radius={null}>
                {admin?.levelClearance}
              </Badge>
            </div>
          </div>
        </Accordion.Control>
        <Accordion.Panel>
          <div className="space-y-4">
            <p className="font-medium">
              Email : <span className="font-light">{admin?.email}</span>
            </p>
            <p className="font-medium">
              Phone number :{" "}
              <span className="font-light text-[0.8rem]">
                {admin?.phoneNumber ? (
                  admin?.phoneNumber
                ) : (
                  <Badge color="yellow" uppercase>
                    Missing
                  </Badge>
                )}
              </span>
            </p>
            <p className="font-medium">
              Added :{" "}
              <span className="font-light text-[0.8rem]">
                {moment(new Date(Number(admin?.createdAt))).format(
                  "Do MMM, YY , hh:mm a"
                )}
              </span>
            </p>

            <p className="font-medium">
              Products added: <span className="font-light mt-2 mb-8">4</span>
            </p>
            <p className="font-medium">
              Orders dispatched :{" "}
              <span className="font-light mt-2 mb-8">4</span>
            </p>

            <Space h={20} />
            <div className="w-full flex space-x-12 justify-around">
              <Button fullWidth uppercase fw="lighter" color="dark">
                Edit
              </Button>
              <Popover
                width={200}
                position="right-end"
                withArrow
                shadow="md"
                opened={popoverOpen}
                onChange={setPopoverOpen}
              >
                <Popover.Target>
                  <Button
                    onClick={() => setPopoverOpen((o) => !o)}
                    fullWidth
                    variant="outline"
                    uppercase
                    fw="lighter"
                    color="dark"
                  >
                    Delete
                  </Button>
                </Popover.Target>
                <Popover.Dropdown>
                  <Text size="sm">
                    Are you sure you want to remove this admin?
                  </Text>
                  <div className="flex mt-3 justify-between space-x-8">
                    <Button fullWidth uppercase fw="lighter" color="dark">
                      Yes
                    </Button>
                    <Button
                      fullWidth
                      uppercase
                      fw="lighter"
                      onClick={() => setPopoverOpen(false)}
                      color="dark"
                      variant="outline"
                    >
                      No
                    </Button>
                  </div>
                </Popover.Dropdown>
              </Popover>
            </div>
          </div>
        </Accordion.Panel>
      </Accordion.Item>
    </div>
  );
}
