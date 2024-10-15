export const users = [
  {
    _id: "64f8c0c6a1b23e8a1f4d9c31",
    name: "Pradip Mokariya",
    email: "pradip@gmail.com",
    password: "pradip"
  },
  {
    _id: "64f8c0c6a1b23e8a1f4d9c32",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    password: "mysecurepassword"
  },
  {
    _id: "64f8c0c6a1b23e8a1f4d9c33",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    password: "alicepass2024"
  },
  {
    _id: "64f8c0c6a1b23e8a1f4d9c34",
    name: "Bob Brown",
    email: "bob.brown@example.com",
    password: "brownsecure123"
  },
  {
    _id: "64f8c0c6a1b23e8a1f4d9c35",
    name: "Charlie Davis",
    email: "charlie.davis@example.com",
    password: "charliedavis987"
  },
  {
    _id: "64f8c0c6a1b23e8a1f4d9c36",
    name: "Emily White",
    email: "emily.white@example.com",
    password: "emilypassword2024"
  },
  {
    _id: "64f8c0c6a1b23e8a1f4d9c37",
    name: "David Green",
    email: "david.green@example.com",
    password: "dgreen456"
  },
  {
    _id: "64f8c0c6a1b23e8a1f4d9c38",
    name: "Sophia Miller",
    email: "sophia.miller@example.com",
    password: "millerstrong123"
  },
  {
    _id: "64f8c0c6a1b23e8a1f4d9c39",
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    password: "mikepass321"
  },
  {
    _id: "64f8c0c6a1b23e8a1f4d9c40",
    name: "Laura Martinez",
    email: "laura.martinez@example.com",
    password: "laurapass654"
  }
];

export const projects = [
  {
    _id: "64f8c0c6a1b23e8a1f4d9d01",
    name: "Project A",
    description: "Description of Project A",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-06-01"),
    status: "Ongoing",
    created_by: "64f8c0c6a1b23e8a1f4d9c31",
    teamMembers: [
      { user_id: "64f8c0c6a1b23e8a1f4d9c32", role: "Developer" },
      { user_id: "64f8c0c6a1b23e8a1f4d9c33", role: "Tester" }
    ]
  },
  {
    _id: "64f8c0c6a1b23e8a1f4d9d02",
    name: "Project B",
    description: "Description of Project B",
    startDate: new Date("2023-07-15"),
    endDate: new Date("2024-02-15"),
    status: "Completed",
    created_by: "64f8c0c6a1b23e8a1f4d9c34",
    teamMembers: [
      { user_id: "64f8c0c6a1b23e8a1f4d9c35", role: "Project Manager" },
      { user_id: "64f8c0c6a1b23e8a1f4d9c36", role: "Developer" }
    ]
  },
  {
    _id: "64f8c0c6a1b23e8a1f4d9d03",
    name: "Project C",
    description: "New e-commerce platform",
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-12-01"),
    status: "Ongoing",
    created_by: "64f8c0c6a1b23e8a1f4d9c37",
    teamMembers: [
      { user_id: "64f8c0c6a1b23e8a1f4d9c38", role: "UI/UX Designer" },
      { user_id: "64f8c0c6a1b23e8a1f4d9c39", role: "Backend Developer" }
    ]
  },
  {
    _id: "64f8c0c6a1b23e8a1f4d9d04",
    name: "Project D",
    description: "Mobile app for task management",
    startDate: new Date("2023-04-10"),
    endDate: new Date("2023-10-30"),
    status: "Completed",
    created_by: "64f8c0c6a1b23e8a1f4d9c40",
    teamMembers: [
      { user_id: "64f8c0c6a1b23e8a1f4d9c31", role: "Developer" },
      { user_id: "64f8c0c6a1b23e8a1f4d9c32", role: "Product Manager" }
    ]
  },
  {
    _id: "64f8c0c6a1b23e8a1f4d9d05",
    name: "Project E",
    description: "AI-powered chatbot development",
    startDate: new Date("2024-03-01"),
    endDate: new Date("2024-10-01"),
    status: "Ongoing",
    created_by: "64f8c0c6a1b23e8a1f4d9c33",
    teamMembers: [
      { user_id: "64f8c0c6a1b23e8a1f4d9c38", role: "AI Specialist" },
      { user_id: "64f8c0c6a1b23e8a1f4d9c39", role: "Backend Developer" }
    ]
  },
  {
    _id: "64f8c0c6a1b23e8a1f4d9d06",
    name: "Project F",
    description: "Cloud infrastructure setup",
    startDate: new Date("2023-11-01"),
    endDate: new Date("2024-04-01"),
    status: "Ongoing",
    created_by: "64f8c0c6a1b23e8a1f4d9c34",
    teamMembers: [
      { user_id: "64f8c0c6a1b23e8a1f4d9c36", role: "Cloud Engineer" },
      { user_id: "64f8c0c6a1b23e8a1f4d9c40", role: "DevOps Engineer" }
    ]
  },
  {
    _id: "64f8c0c6a1b23e8a1f4d9d07",
    name: "Project G",
    description: "Description for project G",
    startDate: new Date("2024-09-01"),
    endDate: new Date("2024-10-01"),
    status: "Ongoing",
    created_by: "64f8c0c6a1b23e8a1f4d9c34",
    teamMembers: [
      { user_id: "64f8c0c6a1b23e8a1f4d9c36", role: "Cloud Engineer" },
      { user_id: "64f8c0c6a1b23e8a1f4d9c40", role: "DevOps Engineer" }
    ]
  },
  {
    _id: "64f8c0c6a1b23e8a1f4d9d08",
    name: "Project H",
    description: "Description for project H",
    startDate: new Date("2023-11-01"),
    endDate: new Date("2024-04-01"),
    status: "Complete",
    created_by: "64f8c0c6a1b23e8a1f4d9c34",
    teamMembers: [
      { user_id: "64f8c0c6a1b23e8a1f4d9c36", role: "Cloud Engineer" },
      { user_id: "64f8c0c6a1b23e8a1f4d9c40", role: "DevOps Engineer" }
    ]
  }
];

export const tasks = [
  {
    _id: "64f8c0c6a1b23e8a1f4d9t01",
    project_id: "64f8c0c6a1b23e8a1f4d9d01", // Refers to Project A
    name: "Set up project repository",
    description: "Initialize Git repository and set up project structure.",
    due_date: new Date("2024-01-05"),
    status: "Ongoing",
    assignedTo: ["64f8c0c6a1b23e8a1f4d9c32","64f8c0c6a1b23e8a1f4d9c37","64f8c0c6a1b23e8a1f4d9c38"] // Assigned to Developer
  },
  {
    _id: "64f8c0c6a1b23e8a1f4d9t00",
    project_id: "64f8c0c6a1b23e8a1f4d9d01", // Refers to Project A
    name: "Initialize project",
    description: "Initialize project structure.",
    due_date: new Date("2024-01-05"),
    status: "Completed",
    assignedTo: ["64f8c0c6a1b23e8a1f4d9c32","64f8c0c6a1b23e8a1f4d9c35"] // Assigned to Developer
  },
  {
    _id: "64f8c0c6a1b23e8a1f4d9t90",
    project_id: "64f8c0c6a1b23e8a1f4d9d01", // Refers to Project A
    name: "Deploy",
    description: "Initialize Git repository and set up project structure.",
    due_date: new Date("2024-01-05"),
    status: "Completed",
    assignedTo: ["64f8c0c6a1b23e8a1f4d9c32","64f8c0c6a1b23e8a1f4d9c33","64f8c0c6a1b23e8a1f4d9c39"] // Assigned to Developer
  },
  {
    _id: "64f8c0c6a1b23e8a1f4d9t02",
    project_id: "64f8c0c6a1b23e8a1f4d9d02", // Refers to Project B
    name: "Design wireframes",
    description: "Create wireframes for the main dashboard.",
    due_date: new Date("2023-07-20"),
    status: "Completed",
    assignedTo: ["64f8c0c6a1b23e8a1f4d9c35"] // Assigned to Project Manager
  },
  {
    _id: "64f8c0c6a1b23e8a1f4d9t03",
    project_id: "64f8c0c6a1b23e8a1f4d9d03", // Refers to Project C
    name: "Create user authentication",
    description: "Implement user sign-up and login functionality.",
    due_date: new Date("2024-03-10"),
    status: "Ongoing",
    assignedTo: ["64f8c0c6a1b23e8a1f4d9c39"] // Assigned to Backend Developer
  },
  {
    _id: "64f8c0c6a1b23e8a1f4d9t04",
    project_id: "64f8c0c6a1b23e8a1f4d9d04", // Refers to Project D
    name: "Develop task manager feature",
    description: "Create task management module with due dates and priority levels.",
    due_date: new Date("2023-05-15"),
    status: "Completed",
    assignedTo: ["64f8c0c6a1b23e8a1f4d9c32"] // Assigned to Product Manager
  },
  {
    _id: "64f8c0c6a1b23e8a1f4d9t05",
    project_id: "64f8c0c6a1b23e8a1f4d9d05", // Refers to Project E
    name: "Create natural language model",
    description: "Build the core AI model for the chatbot.",
    due_date: new Date("2024-05-15"),
    status: "Ongoing",
    assignedTo: ["64f8c0c6a1b23e8a1f4d9c38", "64f8c0c6a1b23e8a1f4d9c39"] // Assigned to AI Specialist and Backend Developer
  },
  {
    _id: "64f8c0c6a1b23e8a1f4d9t06",
    project_id: "64f8c0c6a1b23e8a1f4d9d06", // Refers to Project F
    name: "Set up cloud infrastructure",
    description: "Deploy cloud environment for the application.",
    due_date: new Date("2024-01-15"),
    status: "Ongoing",
    assignedTo: ["64f8c0c6a1b23e8a1f4d9c36", "64f8c0c6a1b23e8a1f4d9c40"] // Assigned to Cloud and DevOps Engineers
  },
  {
    _id: "64f8c0c6a1b23e8a1f4d9t07",
    project_id: "64f8c0c6a1b23e8a1f4d9d06", // Refers to Project F
    name: "Prepare SRS",
    description: "Prepare SRS for application.",
    due_date: new Date("2024-01-15"),
    status: "Completed",
    assignedTo: ["64f8c0c6a1b23e8a1f4d9c32", "64f8c0c6a1b23e8a1f4d9c36"] // Assigned to Cloud and DevOps Engineers
  },
  {
    _id: "64f8c0c6a1b23e8a1f4d9t08",
    project_id: "64f8c0c6a1b23e8a1f4d9d06", // Refers to Project F
    name: "Test the Code",
    description: "Test the code.",
    due_date: new Date("2024-01-15"),
    status: "Ongoing",
    assignedTo: ["64f8c0c6a1b23e8a1f4d9c38", "64f8c0c6a1b23e8a1f4d9c37"] // Assigned to Cloud and DevOps Engineers
  }
];
