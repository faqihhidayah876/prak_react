export default function PageHeader(props) {
  return (
    <div id="pageheader-container" className="flex items-center justify-between p-4 mb-4">
      <div id="pageheader-left" className="flex flex-col">
        <span id="page-title" className="text-3xl font-bold text-gray-800">
          {props.title}
        </span>
        <div id="breadcrumb-links" className="flex items-center font-medium space-x-2 mt-2 text-sm">
          {Array.isArray(props.breadcrumb) ? (
            props.breadcrumb.map((item, index) => (
              <span key={index} className="flex items-center space-x-2">
                <span className={index === props.breadcrumb.length - 1 ? "text-hijau" : "text-gray-400"}>
                  {item}
                </span>
                {index < props.breadcrumb.length - 1 && <span className="text-gray-400">/</span>}
              </span>
            ))
          ) : (
            <span className="text-hijau">{props.breadcrumb}</span>
          )}
        </div>
      </div>
      <div id="action-button">
        {props.children} 
      </div>
    </div>
  );
}