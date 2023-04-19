import "./themes/theme.scss";
import "primereact/resources/primereact.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

import { ThemeSwitcher, ThemeProvider } from "./components/ThemeSwitcher";
import { ReactComponent as Logo } from "./logo.svg";
import RootStoreProvider from "./stores/RootStore";
import MainView from "./views/MainView";

function App() {
  return (
    <ThemeProvider>
      <nav className="w-full flex flex-row justify-content-between surface-ground p-3">
        <Logo className="h-3rem w-auto" id="logo" />
        <ThemeSwitcher />
      </nav>
      <div className="mt-4 flex-auto h-full">
        <RootStoreProvider>
          <MainView />
        </RootStoreProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;
