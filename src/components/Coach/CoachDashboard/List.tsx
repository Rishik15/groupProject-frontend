import type { Contract } from "../../../utils/Interfaces/Dashboard/Coach/types";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString();
}

const List = ({
  data,
  renderActions,
}: {
  data: Contract[];
  renderActions?: (item: Contract) => React.ReactNode;
}) => {
  if (!data.length) {
    return (
      <div className="text-gray-400 text-sm text-center py-6">Nothing here</div>
    );
  }

  return (
    <div className="flex flex-col gap-3 py-2 px-4">
      {data.map((item) => (
        <div
          key={item.contract_id}
          className="flex items-center justify-between p-5 border rounded-3xl hover:shadow-sm transition"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
              {item.name[0]}
            </div>

            <div>
              <p className="font-medium text-[14px]">{item.name}</p>

              <p className="text-[12px] text-gray-500">
                {item.details}  ${item.price}
              </p>

              <p className="text-[11px] text-gray-400">
                {formatDate(item.start_date)}
                {item.end_date && ` - ${formatDate(item.end_date)}`}
              </p>
            </div>
          </div>

          {renderActions && (
            <div className="flex items-center gap-2">{renderActions(item)}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default List;
