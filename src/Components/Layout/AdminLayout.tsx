import Header from './Header'

export default function AdminLayout({ children }: any) {
  return (
    <>
      <Header />
      <div className='flex lg:flex-col'>{children}</div>
    </>
  )
}
