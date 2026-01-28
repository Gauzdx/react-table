export const generateDummyData = () => {
  const data = [];
  const roles = ['Developer', 'Designer', 'Manager', 'Product Owner', 'QA'];
  const statuses = ['Active', 'Inactive', 'Pending', 'Archived'];

  for (let i = 1; i <= 100; i++) {
    data.push({
      id: i,
      name: `User ${i}`,
      email: `user${i}@example.com`,
      role: roles[Math.floor(Math.random() * roles.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      lastLogin: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
      department: `Dept ${Math.floor(i / 10) + 1}`,
      salary: `$${Math.floor(Math.random() * 50000) + 50000}`,
      performance: `${Math.floor(Math.random() * 100)}%`,
      notes: `Notes for user ${i}`
    });
  }
  return data;
};

export const INITIAL_DATA = generateDummyData();
