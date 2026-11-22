import Header from './Header'
import SideMenu from './SideMenu'

export default function DefaultLayout({ children }: any) {
  return (
    <>
      <Header />
      <div className='flex lg:flex-col'>
        <SideMenu />
        {children}
      </div>
    </>
  )
}
