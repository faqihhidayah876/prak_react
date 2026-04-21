export default function PageHeader(props) {
  return (
    <div id="pageheader-container" className="flex items-center justify-between p-4 mb-4">
      <div id="pageheader-left" className="flex flex-col">
        <span id="page-title" className="text-3xl font-bold text-gray-800">
          {props.title}
        </span>
        <div id="breadcrumb-links" className="flex items-center font-medium space-x-2 mt-2 text-sm">
          <span id="breadcrumb-home" className="text-gray-400">Dashboard</span>
          <span id="breadcrumb-separator" className="text-gray-400">/</span>
          <span id="breadcrumb-current" className="text-hijau">Order List</span>
        </div>
      </div>
      <div id="action-button">
        <button id="add-button" className="bg-white border border-gray-200 shadow-sm text-gray-600 px-4 py-2 rounded-lg flex items-center space-x-2 font-medium">
          <span>Filter Periode</span>
        </button>
      </div>
    </div>
  );
}