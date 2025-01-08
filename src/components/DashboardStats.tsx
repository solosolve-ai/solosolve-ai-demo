type StatsProps = {
  complaints: any[];
};

const DashboardStats = ({ complaints }: StatsProps) => {
  const getStatusCounts = () => {
    const counts = {
      new: 0,
      "in-progress": 0,
      resolved: 0
    };
    complaints.forEach(complaint => {
      counts[complaint.status]++;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-sm font-medium text-gray-500">New</div>
        <div className="mt-2 text-3xl font-bold text-blue-500">{statusCounts.new}</div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-sm font-medium text-gray-500">In Progress</div>
        <div className="mt-2 text-3xl font-bold text-yellow-500">{statusCounts["in-progress"]}</div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-sm font-medium text-gray-500">Resolved</div>
        <div className="mt-2 text-3xl font-bold text-green-500">{statusCounts.resolved}</div>
      </div>
    </div>
  );
};

export default DashboardStats;