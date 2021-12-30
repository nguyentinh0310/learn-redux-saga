react-router-dom @types/react-router-dom

/login: /admin: layout

/admin/* feature: /admin/dashboard feature: /admin/students

auth / authentication

login
sign up / register
forget password
CLICK LOGIN

Call API to login
Success --> redirect ADMIN
FAILED --> show ERROR
LOGIN LOGOUT

authSaga

LOOP

if logged in, watch LOGOUT
else watch LOGIN
LOGIN

call login API to get token + user info
set token to local storage
redirect to admin page
LOGOUT

clear token from local storage
redirect to login page
authSlice authSaga

### Students
ROUTINGS

/admin/students: listing
/admin/students/add: add new student
/admin/students/:studentId: update a student
LISTING

Search by name
Filter by city
Sort by name, mark
Pagination
student slice state:

loading
list
pagination
filter { page: 1, limit: 10, ... }
ADD/EDIT

React Hook Form v7
Yup
ROUTINGS

/admin/students/add: add new student
/admin/students/:studentId: update a student
Student Form

Mode: Add/Edit
Initial values
Values
name: Text Input
age: Number Input
gender: Radio options
city: Select
mark: Number Input
Validations: all required
name: at least two words
age: >= 18
gender: male / female
city: required
mark: 0 -> 10
Submission: redirect to student list page after submitting successfully