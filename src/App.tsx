import ninjaOneLogo from "/NinjaOneLogo.svg";
import "./App.css";
import {
  QueryClient,
  QueryClientProvider,
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
} from "react-aria-components";

const BASE_SERVICES_URI = import.meta.env.VITE_BASE_SERVICES_URI;

type Device = {
  id: string;
  system_name: string;
  hdd_capacity: string;
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

function DeviceList() {
  const { isPending, error, data } = useQuery({
    queryKey: ["servicesData"],
    queryFn: getAllDevices,
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  if (data)
    return (
      <div>
        <div>
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

        <GridList aria-label="Devices List" selectionMode="single">
          {data.map((device: Device) => (
            <GridListItem key={device.id}>
              Name: {device.system_name} Capacity: {device.hdd_capacity}{" "}
              <Button>...</Button>
            </GridListItem>
          ))}
        </GridList>
      </div>
    );
}

export default App;
