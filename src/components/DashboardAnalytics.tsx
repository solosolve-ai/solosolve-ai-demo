import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type CategoryData = {
  name: string;
  count: number;
};

const DashboardAnalytics = ({ complaints }: { complaints: any[] }) => {
  // Calculate category distribution
  const categoryData = complaints.reduce((acc: CategoryData[], complaint) => {
    const existingCategory = acc.find(item => item.name === complaint.category);
    if (existingCategory) {
      existingCategory.count++;
    } else {
      acc.push({ name: complaint.category, count: 1 });
    }
    return acc;
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
      <h2 className="text-lg font-semibold mb-4">Complaint Categories Distribution</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardAnalytics;