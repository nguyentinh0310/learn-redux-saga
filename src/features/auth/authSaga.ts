import { PayloadAction } from '@reduxjs/toolkit';
import { LoginPayload, authActions } from './authSlice';
import { call, delay, fork, put, take } from '@redux-saga/core/effects';
import { push } from 'connected-react-router';

function* handleLogin(payload: LoginPayload) {
  try {
    yield delay(1000);
    localStorage.setItem('access_token', 'fake_token');
    yield put(
      authActions.loginSuccess({
        id: 1,
        name: 'TinhNg',
      })
    );
  } catch (error) {
    // yield put(authActions.loginFailed(error.message))
    console.log(error);
  }

  // redirect admin page
  yield put(push('/admin'));
}

function* handleLogOut() {
  // remove access_token
  yield delay(500);
  localStorage.removeItem('access_token');
  // redirect login
  yield put(push('/login'));

}

function* watchLoginFlow() {
  // phải xóa local storage trc khi bắt đầu chu kì mới
  // nêu để chu kì trc khi remove access_token -> hiểu là token cũ vẫn còn -> ko lắng nghe login mà lắng nghe logout
  while (true) {
    // nếu chưa đăng nhập lắng nghe login
    const isLogged = localStorage.getItem('access_token');
    if (!isLogged) {
      const action: PayloadAction<LoginPayload> = yield take(authActions.login.type);
      yield fork(handleLogin, action.payload);
    }

    yield take(authActions.logout.type);
    yield call(handleLogOut); //ko dùng fork
  }
}

export function* authSaga() {
  yield fork(watchLoginFlow);
}
