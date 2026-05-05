const employees = [
  {
    id: 1,
    name: "Aarav Sharma",
    email: "aarav@company.com",
    password: "employee123",
    role: "employee",
    department: "Engineering",
    totalLeaves: 24
  },
  {
    id: 2,
    name: "Meera Iyer",
    email: "meera@company.com",
    password: "employee123",
    role: "employee",
    department: "Design",
    totalLeaves: 24
  },
  {
    id: 3,
    name: "Rohan Gupta",
    email: "rohan@company.com",
    password: "employee123",
    role: "employee",
    department: "Sales",
    totalLeaves: 24
  },
  {
    id: 4,
    name: "Prince Pal",
    email: "prince.pal@company.com",
    password: "prince123",
    role: "employee",
    department: "Engineering",
    totalLeaves: 24
  },
  {
    id: 5,
    name: "Utkarsh Pandey",
    email: "utkarsh.pandey@company.com",
    password: "utkarsh123",
    role: "employee",
    department: "Operations",
    totalLeaves: 24
  },
  {
    id: 6,
    name: "Shailendra Pal",
    email: "shailendra.pal@company.com",
    password: "shailendra123",
    role: "employee",
    department: "Finance",
    totalLeaves: 24
  },
  {
    id: 99,
    name: "Admin User",
    email: "admin@company.com",
    password: "admin123",
    role: "admin",
    department: "People Ops",
    totalLeaves: 0
  }
];

let leaves = [
  {
    id: 101,
    employeeId: 1,
    employeeName: "Aarav Sharma",
    department: "Engineering",
    type: "Sick",
    fromDate: "2026-05-08",
    toDate: "2026-05-09",
    days: 2,
    reason: "Fever and doctor consultation",
    status: "Approved",
    appliedAt: "2026-04-26T10:20:00.000Z"
  },
  {
    id: 102,
    employeeId: 1,
    employeeName: "Aarav Sharma",
    department: "Engineering",
    type: "Casual",
    fromDate: "2026-05-18",
    toDate: "2026-05-18",
    days: 1,
    reason: "Family work",
    status: "Pending",
    appliedAt: "2026-05-02T08:12:00.000Z"
  },
  {
    id: 103,
    employeeId: 2,
    employeeName: "Meera Iyer",
    department: "Design",
    type: "Paid",
    fromDate: "2026-05-20",
    toDate: "2026-05-23",
    days: 4,
    reason: "Planned vacation",
    status: "Pending",
    appliedAt: "2026-05-01T12:30:00.000Z"
  },
  {
    id: 104,
    employeeId: 3,
    employeeName: "Rohan Gupta",
    department: "Sales",
    type: "Casual",
    fromDate: "2026-04-11",
    toDate: "2026-04-12",
    days: 2,
    reason: "Personal commitment",
    status: "Rejected",
    appliedAt: "2026-04-08T09:00:00.000Z"
  }
];

const publicUser = (user) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

const getEmployees = () => employees;
const getPublicEmployees = () => employees.filter((user) => user.role === "employee").map(publicUser);
const getLeaves = () => leaves;
const setLeaves = (nextLeaves) => {
  leaves = nextLeaves;
};

module.exports = {
  getEmployees,
  getPublicEmployees,
  getLeaves,
  setLeaves,
  publicUser
};
