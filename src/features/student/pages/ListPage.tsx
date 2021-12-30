import { Box, Button, LinearProgress, makeStyles, Typography } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { studentApi } from 'api/studentApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { cityActions, selectCityList, selectCityMap } from 'features/city/citySlice';
import { ListParams, Student } from 'models';
import React, { useEffect, useMemo } from 'react';
import { Link, useHistory, useRouteMatch, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import StudentFilters from '../components/StudentFilters';
import StudentTable from '../components/StudentTable';
import queryString from 'query-string';
import {
  selectStudenLoading,
  selectStudentFilter,
  selectStudentList,
  selectStudentPagination,
  studentActions,
} from '../studentSlice';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    paddingTop: theme.spacing(1),
  },

  titleContainer: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',

    marginBottom: theme.spacing(4),
  },

  loading: {
    position: 'absolute',
    top: theme.spacing(-1),
    width: '100%',
  },
}));
export default function ListPage() {
  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const classes = useStyles();

  const loading = useAppSelector(selectStudenLoading);
  const studentList = useAppSelector(selectStudentList);
  const pagination = useAppSelector(selectStudentPagination);
  const filters = useAppSelector(selectStudentFilter);
  const cityMap = useAppSelector(selectCityMap);
  const cityList = useAppSelector(selectCityList);

  const queryParams = useMemo(() => {
    const params: any = queryString.parse(location.search);
    return {
      ...params,
      _page: Number.parseInt(params._page) || 1,
      _limit: Number.parseInt(params._limit) || 15,
    };
  }, [location.search]);

  useEffect(() => {
    dispatch(studentActions.fetchStudentList(queryParams));
  }, [dispatch, queryParams]);

  useEffect(() => {
    dispatch(cityActions.fetchCityList());
  }, [dispatch]);

  // pagination
  const handlePageChange = (e: any, page: number) => {
    // dispatch(
    //   studentActions.setFilter({
    //     ...filters,
    //     _page: page,
    //   })
    // );
    const filters = {
      ...queryParams,
      _page: page,
    };

    history.push({
      pathname: history.location.pathname,
      search: queryString.stringify(filters),
    });
    console.log(page);
  };

  const handleFilterChange = (newFilter: ListParams) => {
    console.log('newFiter', newFilter);
    // dispatch(studentActions.setFilter(newFilter));D
    history.push({
      pathname: history.location.pathname,
      search: queryString.stringify(newFilter),
    });
  };

  // filters search
  const handleSearchChange = (newFilter: ListParams) => {
    dispatch(studentActions.setFilterWithDebounce(newFilter));
    history.push({
      pathname: history.location.pathname,
      search: queryString.stringify(newFilter),
    });
  };

  const handleRemoveStudent = async (student: Student) => {
    try {
      await studentApi.remove(student?.id || '');
      toast.success('Remove student successfully!');

      // Trigger to re-fetch student list with current filters
      const newFilter = { ...queryParams };
      // dispatch(studentActions.setFilter(newFilter));
      dispatch(studentActions.fetchStudentList(queryParams));

      history.push({
        pathname: history.location.pathname,
        search: queryString.stringify(newFilter),
      });
    } catch (error) {
      // Toast error
      console.log('Failed to fetch student', error);
    }
  };

  const handleEditStudent = (student: Student) => {
    history.push(`${match.url}/${student.id}`);
  };

  return (
    <Box className={classes.root}>
      {loading && <LinearProgress className={classes.loading} />}

      <Box className={classes.titleContainer}>
        <Typography variant="h4">Students</Typography>

        <Link to={`${match.url}/add`} style={{ textDecoration: 'none' }}>
          <Button variant="contained" color="primary">
            Add new student
          </Button>
        </Link>
      </Box>

      <Box mb={3}>
        <StudentFilters
          filters={queryParams}
          cityList={cityList}
          onChange={handleFilterChange}
          onSearchChange={handleSearchChange}
        />
      </Box>

      <StudentTable
        studentList={studentList}
        cityMap={cityMap}
        onEdit={handleEditStudent}
        onRemove={handleRemoveStudent}
      />

      <Box my={2} display="flex" justifyContent="center">
        <Pagination
          color="primary"
          count={Math.ceil(pagination._totalRows / pagination._limit)}
          page={pagination?._page}
          onChange={handlePageChange}
        />
      </Box>
    </Box>
  );
}
