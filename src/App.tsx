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
} from "react-aria-components";

const BASE_SERVICES_URI = import.meta.env.VITE_BASE_SERVICES_URI;

type Device = {
  id: string;
  system_name: string;
  hdd_capacity: string;
  type: string;
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

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  if (data)
    return (
      <div className="main">
        <div className="heading">
          <h1>Devices</h1>
          <DialogTrigger>
            <Button>Add Device</Button>
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
        </div>

        <div>
          {" "}
          <h3>Devices</h3>
          <GridList aria-label="Devices List" selectionMode="single">
            {data.map((device: Device) => (
              <GridListItem key={device.id}>
                <div className="device-item-label">
                  <span className="device-item-system-name">
                    {device.system_name}
                  </span>
                  <span className="device-item-specifics">
                    {device.type} workstation - {device.hdd_capacity} GB
                  </span>
                </div>
                <DialogTrigger>
                  <Button>...</Button>
                  <Popover>
                    <DialogTrigger>
                      <Button>EDIT</Button>
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
                    <button
                      onClick={() => {
                        deleteMutation.mutate(device.id);
                      }}
                    >
                      DELETE
                    </button>
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
