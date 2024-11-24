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
import { FormEvent, useState } from "react";
import useFilterAndSort from "./useFilterAndSort";

const BASE_SERVICES_URI = import.meta.env.VITE_BASE_SERVICES_URI;

type DeviceType = "WINDOWS" | "MAC" | "LINUX";

export type Device = {
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

// API queries
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

async function getAllDevices(): Promise<Device[]> {
  const response = await fetch(`http://${BASE_SERVICES_URI}/devices`);
  return await response.json();
}

async function deleteDevice(id: string): Promise<void> {
  await fetch(`http://${BASE_SERVICES_URI}/devices/${id}`, {
    method: "DELETE",
  });
}

export type SortDirection = "name_asc" | "name_desc" | "hdd_asc" | "hdd_desc";
export type FilterType = "ALL" | DeviceType;

function DeviceList() {
  const [filterQuery, setFilterQuery] = useState<string>("");
  const [filterType, setFilterType] = useState<FilterType>("ALL");
  const [sortDirection, setSortDirection] = useState<SortDirection | null>(
    null,
  );

  const { isPending, error, data } = useQuery({
    queryKey: ["servicesData"],
    queryFn: getAllDevices,
  });

  const { filteredData } = useFilterAndSort(
    data,
    filterQuery,
    filterType,
    sortDirection,
  );
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
    addMutation.mutate(formData);
  };

  const editMutation = useMutation({
    mutationFn: (formData) => {
      return fetch(`http://${BASE_SERVICES_URI}/devices/${formData.id}`, {
        method: "PUT",
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

  const editDeviceSubmit = (event: FormEvent) => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(event.currentTarget));
    editMutation.mutate({ ...formData, id: event.currentTarget.id });
  };

  // design lacking
  if (isPending) return "Loading...";

  // design lacking
  if (error) return "An error has occurred: " + error.message;

  if (filteredData)
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

        {/* Sort and Filter controls */}
        <div className="filter-and-sort-container">
          <TextField type="text">
            <Label hidden={true}>Search by name</Label>
            <Input
              value={filterQuery}
              onChange={(event) => setFilterQuery(event.target.value)}
              placeholder="Search by name"
            />
          </TextField>
          <Select
            name="filter-by-type"
            placeholder={`Device Type: ${filterType}`}
            onSelectionChange={(value) => {
              setFilterType(value as DeviceType);
            }}
          >
            <Label hidden={true}>Filter by type</Label>
            <Button>
              <SelectValue />
              <span aria-hidden="true">
                <img src="/select-chevron.svg" alt="select chevron icon" />
              </span>
            </Button>
            <Popover>
              <ListBox>
                <ListBoxItem id="ALL">ALL</ListBoxItem>
                <ListBoxItem id="WINDOWS">WINDOWS</ListBoxItem>
                <ListBoxItem id="MAC">MAC</ListBoxItem>
                <ListBoxItem id="LINUX">LINUX</ListBoxItem>
              </ListBox>
            </Popover>
          </Select>
          <Select
            name="sort-by-name-or-hdd"
            placeholder={`Sort by: Name or Capacity`}
            onSelectionChange={(value) => {
              setSortDirection(value as SortDirection);
            }}
          >
            <Label hidden={true}>Sort by select</Label>
            <Button>
              <SelectValue />
              <span aria-hidden="true">
                <img src="/select-chevron.svg" alt="select chevron icon" />
              </span>
            </Button>
            <Popover>
              <ListBox>
                <ListBoxItem id="name_asc">System Name (Ascending)</ListBoxItem>
                <ListBoxItem id="name_desc">
                  System Name (Desceding)
                </ListBoxItem>
                <ListBoxItem id="hdd_asc">HDD Capacity (Ascending)</ListBoxItem>
                <ListBoxItem id="hdd_desc">
                  HDD Capacity (Descending)
                </ListBoxItem>
              </ListBox>
            </Popover>
          </Select>
          <Button
            name="reset-button"
            onPress={() => {
              setFilterQuery("");
              setSortDirection(null);
              setFilterType("ALL");
            }}
          >
            <img src="./reset.svg" alt="reset button icon" />
          </Button>
        </div>

        {/* DEVICE LIST */}
        <GridList aria-label="Devices List" selectionMode="single">
          <GridListItem
            className="react-aria-GridListItem list-heading"
            isDisabled={true}
            textValue="Device"
          >
            Device
          </GridListItem>
          {filteredData.map((device: Device) => (
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
                  <DialogTrigger>
                    <Button className="react-aria-Button delete-button">
                      Delete
                    </Button>
                    <Modal>
                      <Dialog>
                        {({ close }) => (
                          <div className="delete-device-modal">
                            <div className="modal-heading">
                              <h3>Delete device?</h3>
                              <Button onPress={close}>
                                <img src="/close.svg" alt="close icon" />
                              </Button>
                            </div>
                            <p>
                              You are about to delete the device
                              <span> {device.system_name}</span>. This action
                              cannot be undone.
                            </p>
                            <div className="modal-actions">
                              <Button
                                className="react-aria-Button cancel-button"
                                onPress={close}
                                autoFocus={true}
                              >
                                Cancel
                              </Button>
                              <Button
                                className="react-aria-Button delete-button"
                                onPress={() => {
                                  deleteMutation.mutate(device.id);
                                  close();
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        )}
                      </Dialog>
                    </Modal>
                  </DialogTrigger>
                  <DialogTrigger>
                    <Button>Edit</Button>
                    <Modal>
                      <Dialog>
                        {({ close }) => (
                          <form
                            className="edit-device-form"
                            onSubmit={editDeviceSubmit}
                            id={device.id}
                          >
                            <div className="modal-heading">
                              <h3>Edit device</h3>
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
                              <Input placeholder={device.system_name} />
                            </TextField>
                            <Select
                              name="type"
                              isRequired
                              placeholder={device.type}
                            >
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
                                  <ListBoxItem id="WINDOWS">
                                    WINDOWS
                                  </ListBoxItem>
                                  <ListBoxItem id="MAC">MAC</ListBoxItem>
                                  <ListBoxItem id="LINUX">LINUX</ListBoxItem>
                                </ListBox>
                              </Popover>
                            </Select>
                            <TextField
                              name="hdd_capacity"
                              type="text"
                              isRequired
                            >
                              <Label>HDD Capacity (GB) *</Label>
                              <Input placeholder={device.hdd_capacity} />
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
                </Popover>
              </DialogTrigger>
            </GridListItem>
          ))}
        </GridList>
      </div>
    );
}

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

export default App;
