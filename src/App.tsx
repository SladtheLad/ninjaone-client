import ninjaOneLogo from "/NinjaOneLogo.svg";
import "./App.css";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

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
      <Example />
    </QueryClientProvider>
  );
}

async function getAllDevices(): Promise<Device[]> {
  const response = await fetch(`http://${BASE_SERVICES_URI}/devices`);
  return await response.json();
}

function Example() {
  const { isPending, error, data } = useQuery({
    queryKey: ["servicesData"],
    queryFn: getAllDevices,
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  if (data)
    return (
      <div>
        <h1>Devices</h1>
        <ul>
          {data.map((device: Device) => (
            <li key={device.id}>
              Name: {device.system_name} Capacity: {device.hdd_capacity}{" "}
            </li>
          ))}
        </ul>
      </div>
    );
}

export default App;
