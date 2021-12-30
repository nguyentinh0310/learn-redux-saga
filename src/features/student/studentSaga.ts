import { ListParams, ListResponse } from 'models';
import { PayloadAction } from '@reduxjs/toolkit';
import { studentActions } from './studentSlice';
import { takeLatest, put, call, debounce } from '@redux-saga/core/effects';
import { Student } from 'models';
import { studentApi } from 'api/studentApi';

function* fetchStudentList(action: PayloadAction<ListParams>) {
  try {
    const response: ListResponse<Student> = yield call(studentApi.getAll, action.payload);
    yield put(studentActions.fetchStudentListSuccess(response));
  } catch (error) {
    console.log('Failed to fetch student list', error);
    yield put(studentActions.fetchStudentListFail());
  }
}

function* handleSearchDebounce(action: PayloadAction<ListParams>) {
  console.log("saga debounce",action.payload)
  yield put(studentActions.setFilter(action.payload));
}

export default function* studentSaga() {
  yield takeLatest(studentActions.fetchStudentList, fetchStudentList);

  yield debounce(500, studentActions.setFilterWithDebounce.type, handleSearchDebounce);
}
