import {
  Accordion,
  Button,
  Checkbox,
  Divider,
  HoverCard,
  Input,
  Modal,
  MultiSelect,
  Notification,
  NumberInput,
  Popover,
  Radio,
  Select,
  Space,
  Tabs,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import {
  IconCheck,
  IconExclamationMark,
  IconLock,
  IconMail,
  IconPlus,
  IconSearch,
  IconX,
} from "@tabler/icons";
import { useRef, useState } from "react";
import {
  Additional,
  AdminCard,
  BarChart,
  ProductCard,
  ProductCardAdmin,
  Variant,
} from "../components";
import dynamic from "next/dynamic";
import { useMutation, useQuery } from "urql";
import { notifications } from "@mantine/notifications";
import { Hits } from "react-instantsearch-hooks-web";

const DynamicBar = dynamic(() => import("../components/barchart"), {
  loading: () => <p>Loading...</p>,
});

export default function Admin() {
  return (
    <div className="space-y-8">
      <AdminHeader />
      <div className="px-6">
        <Page />
      </div>
    </div>
  );
}

const AdminHeader = () => {
  return <div className="w-full flex p-4 justify-between">hey</div>;
};

const Page = () => {
  return (
    <Tabs color="dark" defaultValue="dashboard">
      <Tabs.List>
        <Tabs.Tab value="dashboard">Dashboard</Tabs.Tab>
        <Tabs.Tab value="products">Products</Tabs.Tab>
        <Tabs.Tab value="orders">Orders</Tabs.Tab>
        <Tabs.Tab value="admins">Admins</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="dashboard" pl="xs">
        <Dashboard />
      </Tabs.Panel>

      <Tabs.Panel value="products" pl="xs">
        <Products />
      </Tabs.Panel>

      <Tabs.Panel value="orders" pl="xs">
        Orders
      </Tabs.Panel>

      <Tabs.Panel value="admins" pl="xs">
        <Admins />
      </Tabs.Panel>
    </Tabs>
  );
};

const Products = () => {
  const ADD_PRODUCT = `
    mutation ADD_PRODUCT(
        $name: String
        $description: String
        $category: String,
        $variants: String
        $additionalInformation: String  
        $images: [String] 
    ){
      addProduct(
        name: $name
        description: $description
        category: $category
        variants: $variants
        additionalInformation: $additionalInformation
        images: $images
      ){
        id
      }
    }
  `;
  const [_, _addProduct] = useMutation(ADD_PRODUCT);

  const variantThumbnail = useRef();
  const imagePicker = useRef();

  const [addModal, setAddModal] = useState(false);
  const [variantModal, setVariantModal] = useState(false);
  const [additonalModal, setAdditionalModal] = useState(false);

  const [variants, setVariants] = useState([]);
  const [additionals, setAdditionals] = useState([]);

  const [variant, setVariant] = useState({
    label: "",
    thumbnail: null,
    price: 0,
  });

  const [additional, setAdditional] = useState({
    label: "",
    value: null,
  });

  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "",
  });
  const [images, setImages] = useState([]);

  const [categories, setCategories] = useState(["vest", "shirts"]);
  const [loading, setLoading] = useState(false);
  const [loadingVariant, setLoadingVariant] = useState(false);
  const [loadingAdditional, setLoadingAdditional] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      let base64;
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        base64 = reader.result;
        resolve(base64);
      };
      reader.onerror = () => {
        reject(null);
      };
    });
  };

  const handleCloseModal = () => {
    setProduct({
      name: "",
      description: "",
      category: "",
    });
    setImages([]);
    setAdditional({
      label: "",
      value: null,
    });
    setVariant({
      label: "",
      thumbnail: null,
      price: 0,
    });
    setVariants([]);
    setAdditionals([]);
    setAddModal(false);
    setPopoverOpen(false);
  };

  const saveProduct = async () => {
    setLoading(true);
    let _imgs = [];

    let _variants = [];

    for (let _i of images) {
      let i_b64 = await getBase64(_i);
      _imgs.push(i_b64);
    }

    for (let _variant of variants) {
      if (_variant?.thumbnail) {
        let i_b64 = await getBase64(_variant?.thumbnail);
        let _v = {
          thumbnail: i_b64,
          label: _variant?.label,
          price: _variant?.price,
        };
        _variants.push(_v);
      } else {
        let _v = {
          thumbnail: null,
          label: _variant?.label,
          price: _variant?.price,
        };
        _variants.push(_v);
      }
    }

    let _product = {
      name: product?.name,
      description: product?.description,
      category: product?.category,
      variants: JSON.stringify(_variants),
      additionalInformation: JSON.stringify(additionals),
      images: _imgs,
    };

    _addProduct({
      ..._product,
    })
      .then((data, error) => {
        if (data?.data?.addProduct && !error) {
          notifications.show({
            title: "Product uploaded successfully",
            icon: <IconCheck />,
            color: "green",
            message: "Your customers can now shop this product",
          });
          handleCloseModal();
        } else {
          notifications.show({
            title: "Error",
            icon: <IconExclamationMark />,
            color: "red",
            message: "Something occured. We couldn't upload your product",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const saveVariant = () => {
    setLoadingVariant(true);
    let isValid = (variant?.label || variant?.thumbnail) && variant?.price;

    if (isValid) {
      setVariants((variants) => {
        if (variants.some((e) => e.label === variant?.label)) {
          alert("Variant alredy exists");
          return;
        }
        return [...variants, variant];
      });
      setLoadingVariant(false);
    }

    if (!isValid) {
      alert("Missing variant label or price ");
      setLoadingVariant(false);
      return;
    }
    setVariantModal(false);
    setVariant(() => {
      return {
        label: "",
        thumbnail: null,
        price: 0,
      };
    });
  };

  const saveAdditional = () => {
    setLoadingAdditional(true);
    let isValid = additional?.label && additional?.value;

    if (isValid) {
      setAdditionals((additionals) => {
        if (additionals.some((e) => e.label === additional?.label)) {
          alert("Label already exists");
          return;
        }
        return [...additionals, additional];
      });
      setLoadingAdditional(false);
    }

    if (!isValid) {
      alert("Missing label or value ");
      setLoadingAdditional(false);
      return;
    }
    setAdditionalModal(false);
    setAdditional(() => {
      return {
        label: "",
        value: null,
      };
    });
  };

  const handleRemove = (index) => {
    setVariants((variants) => {
      let filter = variants.filter((_, i) => i !== index);
      return [...filter];
    });
  };

  const handleRemoveAdditional = (index) => {
    setAdditionals((additional) => {
      let filter = additional.filter((_, i) => i !== index);
      return [...filter];
    });
  };

  return (
    <div className="space-y-8 py-6 relative max-h-[calc(100vh-96px)] h-[calc(100vh-96px)] overflow-y-auto">
      <Input
        icon={<IconSearch size={16} />}
        variant="filled"
        placeholder="Search"
      />

      <Accordion>
        <Hits hitComponent={ProductCardAdmin} />
      </Accordion>

      <Button
        h={56}
        w={56}
        p={0}
        color="dark"
        onClick={() => setAddModal(true)}
        style={{ position: "fixed", bottom: 24, right: 24 }}
      >
        <IconPlus />
      </Button>

      <Modal
        opened={addModal}
        onClose={handleCloseModal}
        withCloseButton={false}
        fullScreen
        transitionProps={{ transition: "fade", duration: 200 }}
      >
        <div className="flex justify-between">
          <h1 className="py-6 px-3 font-bold text-[1.5rem]">Add product</h1>
          <Popover
            width={280}
            shadow="md"
            opened={popoverOpen}
            onChange={setPopoverOpen}
          >
            <Popover.Target>
              <Button
                onClick={() => setPopoverOpen((o) => !o)}
                color="gray"
                variant="subtle"
                mt={24}
              >
                <IconX />
              </Button>
            </Popover.Target>
            <Popover.Dropdown>
              <Text size="sm" fw="bold">
                Discard inputs?{" "}
              </Text>
              <div className="flex justify-between mt-8 space-x-12">
                <Button
                  onClick={handleCloseModal}
                  color="dark"
                  fw="lighter"
                  uppercase
                  fullWidth
                >
                  Yes
                </Button>
                <Button
                  onClick={() => {
                    setAddModal(false);
                    setPopoverOpen(false);
                  }}
                  color="dark"
                  fw="lighter"
                  variant="outline"
                  uppercase
                  fullWidth
                >
                  No
                </Button>
              </div>
            </Popover.Dropdown>
          </Popover>
        </div>
        <div className="space-y-6 ">
          <div className="gap-4 grid-cols-2">
            {images && images?.length > 0 && (
              <div>
                {Array.from(images).map((image, i) => (
                  <img
                    key={i}
                    src={URL.createObjectURL(image)}
                    className="col-span-1"
                  />
                ))}
              </div>
            )}
          </div>
          <input
            multiple
            onChange={(e) => {
              setImages(e.target.files);
            }}
            type="file"
            ref={imagePicker}
            className="hidden"
          />
          <div className="w-full py-12 justify-center align-middle items-center relative">
            <p className="w-full text-center mb-2">Upload images</p>
            <Button
              p={0}
              w={56}
              h={56}
              onClick={() => imagePicker.current.click()}
              color="dark"
              className="translate-x-[-50%] left-[50%] absolute"
            >
              <IconPlus />
            </Button>
          </div>
          <TextInput
            placeholder="Product name"
            label="Product name"
            withAsterisk
            value={product?.name}
            onChange={(e) => {
              setProduct((product) => {
                return {
                  ...product,
                  name: e.target.value,
                };
              });
            }}
          />
          <Textarea
            placeholder="Product description"
            label="Product description"
            value={product?.description}
            minRows={6}
            onChange={(e) => {
              setProduct((product) => {
                return {
                  ...product,
                  description: e.target.value,
                };
              });
            }}
          />
          <Select
            label="Category"
            data={categories}
            placeholder="Select category"
            searchable
            creatable
            getCreateLabel={(query) => `+ Create '${query}'`}
            onChange={(val) => {
              setProduct((product) => {
                return {
                  ...product,
                  category: val,
                };
              });
            }}
            onCreate={(query) => {
              setCategories((current) => [...current, query]);
              setProduct((product) => {
                return {
                  ...product,
                  category: query,
                };
              });
              return query;
            }}
          />
          <Space h={20} />
          <Divider size={10} label="Variants & Price" labelPosition="center" />
          <Space h={10} />
          <div>
            {variants?.length > 0 ? (
              <div className="space-y-4">
                {variants?.map((variant, i) => (
                  <Variant
                    key={i}
                    variant={variant}
                    onRemove={() => handleRemove(i)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-100 p-4 border-t-2 border-[#A18A68]">
                <Text>No variant added yet.</Text>
              </div>
            )}

            <Button
              onClick={() => setVariantModal(true)}
              mt={24}
              fullWidth
              size="xs"
              color="dark"
              variant="outline"
            >
              <IconPlus size={12} style={{ marginRight: 12 }} /> Add variant
            </Button>
          </div>

          <Modal
            opened={variantModal}
            onClose={() => {
              setVariantModal(false);
              setVariant(() => {
                return {
                  label: "",
                  thumbnail: null,
                  price: 0,
                };
              });
            }}
            title={
              <h1 className="py-6 px-3 font-bold text-[1.5rem]">Add variant</h1>
            }
            centered
            transitionProps={{ transition: "fade", duration: 200 }}
          >
            <div className="p-8 space-y-8">
              <img src="/variant.png" className="mx-auto" />
              <input
                type="file"
                ref={variantThumbnail}
                className="hidden"
                onChange={(e) => {
                  setVariant((variant) => {
                    return {
                      ...variant,
                      thumbnail: e.target.files[0],
                    };
                  });
                }}
              />
              {variant?.thumbnail && (
                <div className="p-8 relative w-[90%]">
                  <img
                    src={URL.createObjectURL(variant?.thumbnail)}
                    alt="product"
                    className="aspect-auto"
                  />
                  <button
                    onClick={() =>
                      setVariant((variant) => {
                        return {
                          ...variant,
                          thumbnail: null,
                        };
                      })
                    }
                    className="absolute top-0 right-0 h-[40px] w-[40px] bg-red-800 rounded-full text-white m-0 p-0"
                  >
                    <IconX className="mx-auto" />
                  </button>
                </div>
              )}
              <Button
                fw="lighter"
                uppercase
                color="dark"
                variant="outline"
                fullWidth
                size="xs"
                onClick={() => variantThumbnail.current.click()}
              >
                <IconPlus size={12} style={{ marginRight: 12 }} /> Upload
                thumbnail
              </Button>
              <TextInput
                placeholder="ex. L ,S"
                label="Variant label"
                value={variant?.label}
                onChange={(e) => {
                  setVariant((variant) => {
                    return {
                      ...variant,
                      label: e.target.value,
                    };
                  });
                }}
              />
              <NumberInput
                label="Variant price"
                defaultValue={0}
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                value={variant?.price}
                onChange={(val) => {
                  setVariant((variant) => {
                    return {
                      ...variant,
                      price: val,
                    };
                  });
                }}
              />
              <Button
                fw="lighter"
                uppercase
                color="dark"
                fullWidth
                onClick={saveVariant}
                loading={loadingVariant}
              >
                save variant
              </Button>
            </div>
          </Modal>

          <Space h={20} />
          <Divider
            size={10}
            label="Additional Information"
            labelPosition="center"
          />
          <Space h={10} />
          <div>
            {additionals?.length > 0 ? (
              <div className="space-y-4">
                {additionals?.map((additional, i) => (
                  <Additional
                    key={i}
                    additional={additional}
                    onRemove={() => handleRemoveAdditional(i)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-100 p-4 border-t-2 border-[#A18A68]">
                <Text>No additional information added yet.</Text>
              </div>
            )}

            <Button
              onClick={() => setAdditionalModal(true)}
              mt={24}
              fullWidth
              size="xs"
              color="dark"
              variant="outline"
            >
              <IconPlus size={12} style={{ marginRight: 12 }} /> Add more info
            </Button>
          </div>

          <Modal
            opened={additonalModal}
            onClose={() => {
              setAdditionalModal(false);
              setAdditional(() => {
                return {
                  label: "",
                  value: null,
                };
              });
            }}
            title={
              <h1 className="py-6 px-3 font-bold text-[1.5rem]">
                Add more information
              </h1>
            }
            centered
            transitionProps={{ transition: "fade", duration: 200 }}
          >
            <div className="p-8 space-y-8">
              <TextInput
                placeholder="ex. Weight , warranty"
                label="Label"
                value={additional?.label}
                onChange={(e) => {
                  setAdditional((additional) => {
                    return {
                      ...additional,
                      label: e.target.value,
                    };
                  });
                }}
              />
              <TextInput
                placeholder="ex. 0.3kg , 2 years"
                label="Value"
                value={additional?.value}
                onChange={(e) => {
                  setAdditional((additional) => {
                    return {
                      ...additional,
                      value: e.target.value,
                    };
                  });
                }}
              />

              <Button
                fw="lighter"
                uppercase
                color="dark"
                fullWidth
                onClick={saveAdditional}
                loading={loadingAdditional}
              >
                save additional information
              </Button>
            </div>
          </Modal>

          <Space h={20} />
          <Button
            fw="lighter"
            uppercase
            color="dark"
            fullWidth
            onClick={saveProduct}
            loading={loading}
          >
            save product
          </Button>
        </div>
      </Modal>
    </div>
  );
};

const Admins = () => {
  const GET_ADMINS = `
      query GET_ADMINS{
        getAdmins{
          id
          name
          email
          levelClearance
          phoneNumber
          createdAt
        }
      }
  `;
  const CREATE_ADMIN = `
    mutation CREATE_ADMIN(
      $name: String
      $email: String
      $levelClearance : String
    ){
      createAdmin(
        name: $name
        email: $email
        levelClearance : $levelClearance
      ){
        id
        name
      }
    }
  `;

  const [{ data, fetching, error }, reexecuteQuery] = useQuery({
    query: GET_ADMINS,
  });
  const [_, _createAdmin] = useMutation(CREATE_ADMIN);

  const [addModal, setAddModal] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [admin, setAdmin] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);

  const handleCloseModal = () => {
    setAdmin({
      name: "",
      email: "",
      role: "",
    });
    setPopoverOpen(false);
    setLoading(false);
    setAddModal(false);
  };

  const saveAdmin = () => {
    let { name, email, role } = admin;

    if (!name || !email || !role) {
      notifications.show({
        color: "orange",
        title: "Field required",
        message: "You must fill all the fields to create a new admin",
      });
      return;
    }

    setLoading(true);

    _createAdmin({
      name,
      email,
      levelClearance: role,
    })
      .then((data, error) => {
        if (data?.data?.createAdmin && !error) {
          notifications.show({
            title: "Admin created successfully",
            icon: <IconCheck />,
            color: "green",
            message:
              "New admin can now login with email and the default password for new admins",
          });
          handleCloseModal();
        } else {
          notifications.show({
            title: "Error",
            icon: <IconExclamationMark />,
            color: "red",
            message: "Something occured. We couldn't create new admin",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
        reexecuteQuery();
      });
  };

  return (
    <div className="space-y-8 py-6 relative max-h-[calc(100vh-96px)] h-[calc(100vh-96px)] overflow-y-auto">
      <Input
        icon={<IconSearch size={16} />}
        variant="filled"
        placeholder="Search"
      />

      <Accordion>
        {fetching && <p>Loading...</p>}
        {error && <p>Error...</p>}
        {data?.getAdmins.map((admin, i) => (
          <AdminCard key={i} admin={admin} />
        ))}
      </Accordion>

      <Button
        h={56}
        w={56}
        p={0}
        color="dark"
        onClick={() => setAddModal(true)}
        style={{ position: "fixed", bottom: 24, right: 24 }}
      >
        <IconPlus />
      </Button>

      <Modal
        opened={addModal}
        onClose={handleCloseModal}
        withCloseButton={false}
        fullScreen
        transitionProps={{ transition: "fade", duration: 200 }}
      >
        <div className="flex justify-between">
          <h1 className="py-6 px-3 font-bold text-[1.5rem]">Add admin</h1>
          <Popover
            width={280}
            shadow="md"
            opened={popoverOpen}
            onChange={setPopoverOpen}
          >
            <Popover.Target>
              <Button
                onClick={() => setPopoverOpen((o) => !o)}
                color="gray"
                variant="subtle"
                mt={24}
              >
                <IconX />
              </Button>
            </Popover.Target>
            <Popover.Dropdown>
              <Text size="sm" fw="bold">
                Discard inputs?{" "}
              </Text>
              <div className="flex justify-between mt-8 space-x-12">
                <Button
                  onClick={handleCloseModal}
                  color="dark"
                  fw="lighter"
                  uppercase
                  fullWidth
                >
                  Yes
                </Button>
                <Button
                  onClick={() => {
                    setAddModal(false);
                    setPopoverOpen(false);
                  }}
                  color="dark"
                  fw="lighter"
                  variant="outline"
                  uppercase
                  fullWidth
                >
                  No
                </Button>
              </div>
            </Popover.Dropdown>
          </Popover>
        </div>
        <div className="space-y-6 px-2 mt-6">
          <TextInput
            placeholder="Admin name"
            label="Admin name"
            withAsterisk
            value={admin?.name}
            onChange={(e) => {
              setAdmin((admin) => {
                return {
                  ...admin,
                  name: e.target.value,
                };
              });
            }}
          />
          <TextInput
            placeholder="Admin email"
            label="Admin email"
            withAsterisk
            rightSection={<IconMail color="gray" size={16} />}
            value={admin?.email}
            onChange={(e) => {
              setAdmin((admin) => {
                return {
                  ...admin,
                  email: e.target.value,
                };
              });
            }}
          />

          <Space h={10} />
          <Divider size={10} label="Role & Access" labelPosition="center" />
          <Space h={10} />

          <Radio.Group
            onChange={(val) =>
              setAdmin((admin) => {
                return {
                  ...admin,
                  role: val,
                };
              })
            }
          >
            <div className="space-y-6">
              <Radio
                value="super-admin"
                label={
                  <div>
                    <Text fw="bold" mb={12}>
                      Super admin
                    </Text>
                    <div className="block space-y-2">
                      <span className="block">
                        <IconCheck size={16} className="inline" /> Adding ,
                        modifying & deleting products
                      </span>
                      <span className="block">
                        <IconCheck size={16} className="inline" /> Admin
                        addition & deleting
                      </span>
                      <span className="block">
                        <IconCheck size={16} className="inline" /> Order
                        dispatching
                      </span>
                    </div>
                  </div>
                }
              />
              <Radio
                value="order-dispatcher"
                label={
                  <div>
                    <Text fw="bold" mb={12}>
                      Order dispatcher
                    </Text>
                    <div className="block space-y-2">
                      <span className="block">
                        <IconLock size={16} className="inline" /> Adding ,
                        modifying & deleting products
                      </span>
                      <span className="block">
                        <IconLock size={16} className="inline" /> Admin addition
                        & deleting
                      </span>
                      <span className="block">
                        <IconCheck size={16} className="inline" /> Order
                        dispatching
                      </span>
                    </div>
                  </div>
                }
              />
              <Radio
                value="general"
                label={
                  <div>
                    <Text fw="bold" mb={12}>
                      General
                    </Text>
                    <div className="block space-y-2">
                      <span className="block">
                        <IconCheck size={16} className="inline" /> Adding ,
                        modifying & deleting products
                      </span>
                      <span className="block">
                        <IconLock size={16} className="inline" /> Admin addition
                        & deleting
                      </span>
                      <span className="block">
                        <IconCheck size={16} className="inline" /> Order
                        dispatching
                      </span>
                    </div>
                  </div>
                }
              />
            </div>
          </Radio.Group>

          <Button
            fw="lighter"
            uppercase
            color="dark"
            fullWidth
            onClick={saveAdmin}
            loading={loading}
          >
            save admin
          </Button>
        </div>
      </Modal>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="py-6 space-y-8">
      <div className="space-y-4">
        <Notification color="gray" title="Total orders" withCloseButton={false}>
          <div>
            <h1 className="py-3 w-full space-x-12 font-bold text-[1.5rem]">
              12 <span className="font-light text-[1rem]">this week</span>
            </h1>
            <p className="mt-3 inline space-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="green"
                className="inline"
              >
                <path d="M7 24h-6v-6h6v6zm8-9h-6v9h6v-9zm8-4h-6v13h6v-13zm0-11l-6 1.221 1.716 1.708-6.85 6.733-3.001-3.002-7.841 7.797 1.41 1.418 6.427-6.39 2.991 2.993 8.28-8.137 1.667 1.66 1.201-6.001z" />
              </svg>
              <span className="text-green-500 font-medium">
                + 12% from last week
              </span>
            </p>
          </div>
        </Notification>
        <Notification
          color="gray"
          title="Total earnings"
          withCloseButton={false}
        >
          <div>
            <h1 className="py-3 w-full space-x-12 font-bold text-[1.5rem]">
              Ksh. 12,500{" "}
              <span className="font-light text-[1rem]">this week</span>
            </h1>
            <p className="mt-3 inline space-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="green"
                className="inline"
              >
                <path d="M7 24h-6v-6h6v6zm8-9h-6v9h6v-9zm8-4h-6v13h6v-13zm0-11l-6 1.221 1.716 1.708-6.85 6.733-3.001-3.002-7.841 7.797 1.41 1.418 6.427-6.39 2.991 2.993 8.28-8.137 1.667 1.66 1.201-6.001z" />
              </svg>
              <span className="text-green-500 font-medium">
                + 12% from last week
              </span>
            </p>
          </div>
        </Notification>
        <div className="flex space-x-2 w-full justify-between">
          <Notification
            color="gray"
            title="Products"
            withCloseButton={false}
            className="w-full"
          >
            <div>
              <h1 className="py-3 w-full space-x-12 font-bold text-[1.5rem]">
                120
              </h1>
            </div>
          </Notification>

          <Notification
            className="w-full"
            color="gray"
            title="Customers"
            withCloseButton={false}
          >
            <div>
              <h1 className="py-3 w-full space-x-12 font-bold text-[1.5rem]">
                256
              </h1>
            </div>
          </Notification>
        </div>
      </div>
      <div>
        <DynamicBar />
      </div>
    </div>
  );
};
