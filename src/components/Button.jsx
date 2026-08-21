export default function Button({ children, className='', ...props }){
  return (
    <button {...props} className={`inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 ${className}`}>{children}</button>
  )
}
