export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {Icon && <Icon className="w-12 h-12 text-gray-700 mb-4" />}
      <h3 className="text-lg font-semibold text-gray-300">{title}</h3>
      {description && <p className="text-sm text-gray-500 mt-1 max-w-xs">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
