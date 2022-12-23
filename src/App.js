import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import { Route, Router, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import theme from "./theme";
import {ThemeProvider} from "@mui/system";
import Checkout from "./components/Checkout";
import Thanks from "./components/Thanks"

export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
      {/* TODO: CRIO_TASK_MODULE_LOGIN - To add configure routes and their mapping */}
          {/* <Register /> */}
          {/* <Login /> */}
            <Switch>
              <Route exact path={"/"} component={Products} />
              <Route exact path={"/register"} component={Register} />
              <Route exact path={"/login"} component={Login} />
              <Route exact path={"/checkout"} component={Checkout}/>
              <Route exact path={"/thanks"} component={Thanks}/>
            </Switch>
      </div>
    </ThemeProvider>
  );
}

export default App;
