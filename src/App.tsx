import ninjaOneLogo from "/NinjaOneLogo.svg";
import "./App.css";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import {
  GridList,
  GridListItem,
  Button,
  Dialog,
  DialogTrigger,
  Modal,
  TextField,
  Input,
  Label,
  Popover,
  Select,
  ListBox,
  SelectValue,
  ListBoxItem,
} from "react-aria-components";
import { FormEvent } from "react";

const BASE_SERVICES_URI = import.meta.env.VITE_BASE_SERVICES_URI;

type DeviceType = "WINDOWS" | "MAC" | "LINUX";

type Device = {
  id: string;
  system_name: string;
  hdd_capacity: string;
  type: DeviceType;
};

const IconMap = {
  WINDOWS: "/Windows.svg",
  MAC: "/Apple.svg",
  LINUX: "/Linux.svg",
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <header>
        <img src={ninjaOneLogo} className="logo" alt="Ninja One Logo" />
      </header>
      <DeviceList />
    </QueryClientProvider>
  );
}

async function getAllDevices(): Promise<Device[]> {
  const response = await fetch(`http://${BASE_SERVICES_URI}/devices`);
  return await response.json();
}

async function deleteDevice(id: string): Promise<void> {
  await fetch(`http://${BASE_SERVICES_URI}/devices/${id}`, {
    method: "DELETE",
  });
}

function DeviceList() {
  const { isPending, error, data } = useQuery({
    queryKey: ["servicesData"],
    queryFn: getAllDevices,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["servicesData"] });
    },
  });

  const addMutation = useMutation({
    mutationFn: (formData) => {
      return fetch(`http://${BASE_SERVICES_URI}/devices`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["servicesData"] });
    },
  });

  const addDeviceSubmit = (event: FormEvent) => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(event.currentTarget));
    console.log(formData);
    addMutation.mutate(formData);
  };

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  if (data)
    return (
      <div className="main">
        <div className="heading">
          <h1>Devices</h1>
          <DialogTrigger>
            <Button className="add-device-button">
              <img src="/plus.svg" alt="plus icon" />
              Add Device
            </Button>
            <Modal>
              <Dialog>
                {({ close }) => (
                  <form className="add-device-form" onSubmit={addDeviceSubmit}>
                    <div className="modal-heading">
                      <h3>Add device</h3>
                      <Button onPress={close}>
                        <img src="/close.svg" alt="close icon" />
                      </Button>
                    </div>
                    <TextField
                      autoFocus
                      name="system_name"
                      type="text"
                      isRequired
                    >
                      <Label>Device Name *</Label>
                      <Input placeholder="MY MAC" />
                    </TextField>
                    <Select name="type" isRequired placeholder="Select type">
                      <Label>Device Type *</Label>
                      <Button>
                        <SelectValue />
                        <span aria-hidden="true">
                          <img
                            src="/select-chevron.svg"
                            alt="select chevron icon"
                          />
                        </span>
                      </Button>
                      <Popover>
                        <ListBox>
                          <ListBoxItem id="WINDOWS">WINDOWS</ListBoxItem>
                          <ListBoxItem id="MAC">MAC</ListBoxItem>
                          <ListBoxItem id="LINUX">LINUX</ListBoxItem>
                        </ListBox>
                      </Popover>
                    </Select>
                    <TextField name="hdd_capacity" type="text" isRequired>
                      <Label>HDD Capacity (GB) *</Label>
                      <Input placeholder="64" />
                    </TextField>
                    <div className="form-actions-container">
                      <Button
                        className="react-aria-Button cancel-button"
                        onPress={close}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="react-aria-Button submit-button"
                        type="submit"
                      >
                        Submit
                      </Button>
                    </div>
                  </form>
                )}
              </Dialog>
            </Modal>
          </DialogTrigger>
        </div>

        <div>
          <GridList aria-label="Devices List" selectionMode="single">
            <GridListItem
              className="react-aria-GridListItem list-heading"
              isDisabled={true}
              textValue="Device"
            >
              Device
            </GridListItem>
            {data.map((device: Device) => (
              <GridListItem key={device.id} textValue={device.system_name}>
                <div className="device-item-label">
                  <div className="device-item-name-container">
                    <img src={IconMap[device.type]} alt="device type icon" />
                    <span className="device-item-system-name">
                      {device.system_name}
                    </span>
                  </div>
                  <span className="device-item-specifics">
                    {device.type} workstation - {device.hdd_capacity} GB
                  </span>
                </div>
                <DialogTrigger>
                  <Button>
                    <img src="/ellipsis.svg" alt="show more ellipsis" />
                  </Button>
                  <Popover
                    className="react-aria-Popover device-options-popover"
                    crossOffset={-63}
                  >
                    <Button
                      className="react-aria-Button delete-button"
                      onPress={() => {
                        deleteMutation.mutate(device.id);
                      }}
                    >
                      Delete
                    </Button>
                    <DialogTrigger>
                      <Button>Edit</Button>
                      <Modal>
                        <Dialog>
                          {({ close }) => (
                            <form>
                              <TextField autoFocus>
                                <Label>Device Name</Label>
                                <Input />
                              </TextField>
                              <TextField>
                                <Label>Device Type</Label>
                                <Input />
                              </TextField>
                              <TextField>
                                <Label>HDD Capacity</Label>
                                <Input />
                              </TextField>
                              <Button onPress={close} style={{ marginTop: 8 }}>
                                Submit
                              </Button>
                            </form>
                          )}
                        </Dialog>
                      </Modal>
                    </DialogTrigger>
                  </Popover>
                </DialogTrigger>
              </GridListItem>
            ))}
          </GridList>
        </div>
      </div>
    );
}

export default App;
