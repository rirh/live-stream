import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'

import { HOME_URL, Home } from 'src/pages/Home/Home'

const AllRoute = () => <BrowserRouter>
    <Switch>
        <Route path={HOME_URL} component={Home} ></Route>
        <Redirect to={HOME_URL}></Redirect>
    </Switch>
</BrowserRouter>;

export default AllRoute;