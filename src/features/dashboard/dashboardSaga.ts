import { all, call, put, takeLatest } from '@redux-saga/core/effects';
import { cityApi } from 'api/cityApi';
import { studentApi } from 'api/studentApi';
import { City, ListResponse, Student } from 'models';
import { dashboardActions, RankingByCity } from './dashboardSlice';

function* fetchStatistic() {
  const responseList: Array<ListResponse<Student>> = yield all([
    call(studentApi.getAll, { _page: 1, _limit: 1, gender: 'male' }),
    call(studentApi.getAll, { _page: 1, _limit: 1, gender: 'female' }),
    call(studentApi.getAll, { _page: 1, _limit: 1, mark_gte: 8 }),
    call(studentApi.getAll, { _page: 1, _limit: 1, mark_lte: 5 }),
  ]);

  const statisticList = responseList.map((x) => x.pagination._totalRows);
  const [maleCount, femaleCount, highMarkCount, lowMarkCount] = statisticList;
  yield put(
    dashboardActions.setStatistics({ maleCount, femaleCount, highMarkCount, lowMarkCount })
  );
}

function* fetchHighestStudentList() {
  const { data }: ListResponse<Student> = yield call(studentApi.getAll, {
    _page: 1,
    _limit: 5,
    _sort: 'mark',
    _order: 'desc',
  });

  yield put(dashboardActions.setHighestSudentList(data));
}

function* fetchLowestStudentList() {
  const { data }: ListResponse<Student> = yield call(studentApi.getAll, {
    _page: 1,
    _limit: 5,
    _sort: 'mark',
    _order: 'asc',
  });

  yield put(dashboardActions.setLowestStudentList(data));
}

function* fetchRankByCityList() {
  // fetch city List
  const { data: cityList }: ListResponse<City> = yield call(cityApi.getAll);
  // Fetch ranking per city
  // mảng city ko biết bảo nhiêu api -> tạo gọi api qua .map()
  // mỗi city là 1 cái city ,
  const callList = cityList.map((x) =>
    call(studentApi.getAll, {
      _page: 1,
      _limit: 5,
      _sort: 'mark',
      _order: 'desc',
      city: x.code,
    })
  );
  const responseList: Array<ListResponse<Student>> = yield all(callList);
  const rankingByCityList: Array<RankingByCity> = responseList.map((x, idx) => ({
    cityId: cityList[idx].code,
    cityName: cityList[idx].name,
    rankingList: x.data,
  }));

  // update state
  yield put(dashboardActions.setRankingByCityList(rankingByCityList));
}

function* fetchDashboardData() {
  // chạy song song cùng 1 lúc
  try {
    yield all([
      call(fetchStatistic),
      call(fetchHighestStudentList),
      call(fetchLowestStudentList),
      call(fetchRankByCityList),
    ]);
    yield put(dashboardActions.fetchDataSuccess())
  } catch (error) {
    console.log(error);
    yield put(dashboardActions.fetchDataFailed())
  }
}

export default function* dashboardSaga() {
  yield takeLatest(dashboardActions.fetchData.type, fetchDashboardData);
}
