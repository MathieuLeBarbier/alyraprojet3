import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children } : {children : React.ReactNode}) => {
    return (
        <div className="flex flex-col">
            <Header />
            <main className="flex-1 overflow-y-auto mt-18 px-4 py-6">
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default Layout;