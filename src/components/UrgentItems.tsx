
export const UrgentItems = () => {
  const urgentItems = [
    {
      type: 'Task',
      title: 'Water greenhouse plants',
      priority: 'High',
      color: 'bg-red-100 border-red-500'
    },
    {
      type: 'Voucher',
      title: 'Gift voucher #V001 expires today',
      priority: 'Medium',
      color: 'bg-yellow-100 border-yellow-500'
    },
    {
      type: 'Layby',
      title: 'Customer pickup due: L004',
      priority: 'High',
      color: 'bg-red-100 border-red-500'
    },
    {
      type: 'Request',
      title: 'Rare fern requested - check availability',
      priority: 'Low',
      color: 'bg-green-100 border-green-500'
    }
  ];

  return (
    <div className="neo-card p-4 sm:p-6">
      <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">Urgent Items</h3>
      <div className="space-y-3 max-h-80 overflow-y-auto neo-scrollbar">
        {urgentItems.map((item, index) => (
          <div
            key={index}
            className={`${item.color} border-4 p-3 transition-all duration-200 hover:translate-x-1 hover:translate-y-1`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold bg-black text-white px-2 py-1 uppercase">
                  {item.type}
                </span>
                <p className="text-gray-900 font-medium mt-1 text-sm sm:text-base break-words">{item.title}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-1 ml-2 flex-shrink-0 ${
                item.priority === 'High' ? 'bg-red-500 text-white' :
                item.priority === 'Medium' ? 'bg-yellow-500 text-black' :
                'bg-green-500 text-white'
              }`}>
                {item.priority}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
