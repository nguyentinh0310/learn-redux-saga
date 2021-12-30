import React from 'react';
import { Route, Switch, Redirect } from 'react-router';
import './App.css';
import { NotFound, PrivateRoute } from './components/Common';
import { AdminLayout } from './components/Layout';
import { LoginPage } from './features/auth/page/LoginPage';

function App() {
  return (
    <div className="App">
      <Switch>
        <Redirect from="/" to="/admin" exact />
        <Route path="/login">
          <LoginPage />
        </Route>
        <PrivateRoute path="/admin">
          <AdminLayout />
        </PrivateRoute>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
