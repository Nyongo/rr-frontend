
export const generateBusCSVTemplate = () => {
  const headers = ['Registration Number', 'School Name', 'Make', 'Model', 'Seats Capacity', 'Type', 'Status'];
  const sampleData = [
    'ABC123', 'Lincoln Elementary', 'Ford', 'Transit', '30', 'Standard', 'Active'
  ];
  
  const csvContent = [headers.join(','), sampleData.join(',')].join('\n');
  return csvContent;
};

export const generateDriverCSVTemplate = () => {
  const headers = ['Name', 'Phone', 'School Name', 'Status'];
  const sampleData = [
    'John Doe', '+1234567890', 'Lincoln Elementary', 'Active'
  ];
  
  const csvContent = [headers.join(','), sampleData.join(',')].join('\n');
  return csvContent;
};

export const generateMinderCSVTemplate = () => {
  const headers = ['Name', 'Phone', 'School Name', 'Status'];
  const sampleData = [
    'Jane Smith', '+1234567890', 'Lincoln Elementary', 'Active'
  ];
  
  const csvContent = [headers.join(','), sampleData.join(',')].join('\n');
  return csvContent;
};

export const generateUserCSVTemplate = () => {
  const headers = ['Full Name', 'Email', 'Phone', 'School Name', 'Role', 'Status'];
  const sampleData = [
    'John Admin', 'john@school.edu', '+1234567890', 'Lincoln Elementary', 'Admin', 'Active'
  ];
  
  const csvContent = [headers.join(','), sampleData.join(',')].join('\n');
  return csvContent;
};

export const generateParentCSVTemplate = () => {
  const headers = ['Name', 'Parent Type', 'Phone', 'Email', 'Status'];
  const sampleData = [
    'Grace Wanjiku Kamau', 'Mother', '+254 722 123 456', 'grace.kamau@gmail.com', 'Active'
  ];
  
  const csvContent = [headers.join(','), sampleData.join(',')].join('\n');
  return csvContent;
};

export const downloadCSV = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
