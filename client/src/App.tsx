import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { Context } from './index';
import LoginForm from './componennts/LoginForm';
import { observer } from 'mobx-react-lite';
import UserService from './services/UserService';
import { IUser } from './models/IUser';

function App() {
  const {store} = useContext(Context);
  const [users, setUsers] = useState<IUser[]>([])

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth()
    }
  }, [])

  async function getUsers() {
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data);
    } catch (e) {
      console.log(e)
    }
  }

  if (store.isLoading) {
    return <div>Загрузка...</div>
  }

  if (!store.isAuth) {
    return (
      <div>
        <LoginForm />
        <button onClick={getUsers}>Получить пользователей</button>
      </div>
    )
  }

  return (
    <div>
      <h1>{store.isAuth ? `Пользователь авторизован ${store.user.email}` : 'АВТОРИЗУЙТЕСЬ'}</h1>
      <h1>{store.user.isActivated ? 'Аккаунт подтверждён по почте' : 'Подтвердите аккаунт!'}</h1>
      <button onClick={() => store.logout()}>Выйти</button>
      <div>
        <button onClick={getUsers}>Получить пользователей</button>
        {users.map(user =>
            <div key={user.email}>{user.email}</div>
        )}
      </div>
    </div>
  );
}

export default observer(App);
